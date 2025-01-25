package com.nodewars.config;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.nodewars.dto.RoomRequestDto;
import com.nodewars.dto.RoomJoinDto;
import com.nodewars.dto.ChatMessageDto;
import com.nodewars.objects.RoomDetails;
import com.nodewars.service.S3Service;
import com.nodewars.service.UserService;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class SocketIOConfig {

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UserService userService;
    
    private static final Logger logger = LoggerFactory.getLogger(SocketIOConfig.class);

    private Map<String, RoomDetails> rooms = new HashMap<>();

    private SocketIOServer server;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(9092);

        server = new SocketIOServer(config);

        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
            for (String room : client.getAllRooms()) {
                rooms.get(room).setOccupancy(rooms.get(room).getOccupancy() - 1);
            }
        });

        // Example usage in an event listener
        server.addEventListener("request_draw", String.class, (client, roomId, ackRequest) -> {
            String requesterUsername = getUsernameForClient(roomId, client);
            
            if (requesterUsername != null) {
                RoomDetails room = rooms.get(roomId);
                
                if (room != null) {
                    // Broadcast draw request to the other player in the room
                    server.getRoomOperations(roomId).sendEvent("draw_requested", requesterUsername);
                }
            } else {
                // Handle the case where the username was not found (client is not part of the room)
                ackRequest.sendAckData("error: client not in room");
            }
        });

        server.addEventListener("respond_draw", Map.class, (client, data, ackRequest) -> {
            String roomId = (String) data.get("roomId");
            boolean accepted = (Boolean) data.get("accepted");

            RoomDetails room = rooms.get(roomId);
            if (room != null) {
                if (accepted) {
                    // Draw is confirmed by both players
                    server.getRoomOperations(roomId).sendEvent("game_draw", "Draw agreed");

                    // Kick all players from the room
                    room.getOccupants().keySet().forEach(clientId -> {
                        SocketIOClient roomClient = server.getClient(UUID.fromString(clientId));
                        if (roomClient != null) {
                            roomClient.leaveRoom(roomId);
                        }
                    });

                    // Optionally reset or close the room
                    rooms.remove(roomId);
                } else {
                    // Draw is rejected
                    server.getRoomOperations(roomId).sendEvent("draw_rejected", "Draw request declined");
                }
            }
        });


        server.addEventListener("forfeit", String.class, (client, roomId, ackRequest) -> {
            RoomDetails room = rooms.get(roomId);
            
            if (room != null) {
                // Broadcast forfeit to the room
                server.getRoomOperations(roomId).sendEvent("game_forfeit", "Opponent has forfeited.");
                
                // Kick all players from the room
                room.getOccupants().keySet().forEach(clientId -> {
                    SocketIOClient roomClient = server.getClient(UUID.fromString(clientId));
                    if (roomClient != null) {
                        roomClient.leaveRoom(roomId); // Optionally use `kick()` if available
                    }
                });

                // Optionally reset or close the room
                rooms.remove(roomId); // Close the room after the forfeit
            }
        });


        server.addEventListener("chat_message", ChatMessageDto.class, (client, data, ackRequest) -> {
            String roomId = getRoomOfClient(client);

            if (roomId != null) {
                server.getRoomOperations(roomId).sendEvent("room_message", data);
                logger.info("Message from {} in room {}: {}: {}", 
                    client.getSessionId(), roomId, data.getUsername(), data.getContent());
            }
        });

        server.addEventListener("join_room", RoomJoinDto.class, (client, data, ackRequest) -> {
            String roomId = data.getRoomId();
            String username = data.getUsername();

            logger.info("Client " + client.getSessionId() + " is attempting to join room " + roomId + " with username " + username);

            if (!rooms.containsKey(roomId)) {
                ackRequest.sendAckData("error");
                return;
            }

            RoomDetails roomDetails = rooms.get(roomId);

            if (roomDetails.getOccupants().containsValue(username)) {
                boolean updated = roomDetails.updateOccupant(client.getSessionId().toString(), username);
                if (!updated) {
                    ackRequest.sendAckData("error: room full");
                    return;
                }
            } else {
                int currentOccupancy = roomDetails.getOccupancy();
                if (currentOccupancy >= 2) {
                    ackRequest.sendAckData("error: room full");
                    return;
                }
                roomDetails.addOccupant(client.getSessionId().toString(), username);
            }

            client.joinRoom(roomId);

            String pfp = s3Service.getPreSignedUrl(userService.getPfpByPreferredUsername(username));
            String elo = String.valueOf(userService.getEloByPreferredUsername(username));

            List<Map<String, String>> occupantsData = roomDetails.getOccupants().entrySet().stream()
                .map(entry -> {
                    String occupantPfp = s3Service.getPreSignedUrl(userService.getPfpByPreferredUsername(entry.getValue()));
                    String occupantElo = String.valueOf(userService.getEloByPreferredUsername(entry.getValue()));
                    return Map.of(
                        "username", entry.getValue(),
                        "pfp", occupantPfp,
                        "elo", occupantElo
                    );
                })
                .collect(Collectors.toList());

            server.getRoomOperations(roomId).sendEvent("room_update", occupantsData);

            if (roomDetails.getOccupancy() == 2) {
                startRoomTimer(roomId);
            }

            ackRequest.sendAckData(Map.of(
                "status", "success",
                "slug", roomDetails.getSlug()
            ));
        });

        


        server.addEventListener("create_room", RoomRequestDto.class, (client, data, ackRequest) -> {
            String roomId = data.getRoomId();
            String slug = data.getSlug();
            logger.info("Client " + client.getSessionId() + " is attempting to create room " + roomId + " with slug " + slug);

            if (rooms.containsKey(roomId)) {
                ackRequest.sendAckData("error");
                return;
            }

            rooms.put(roomId, new RoomDetails(0, slug));
            logger.info("Room " + roomId + " has been created with slug " + slug);

            ackRequest.sendAckData("success");
        });

        server.addEventListener("message", String.class, (client, message, ackRequest) -> {
            String roomId = getRoomOfClient(client);

            if (roomId != null) {
                server.getRoomOperations(roomId).sendEvent("room_message", message);
                System.out.println("Message from " + client.getSessionId() + " in room " + roomId + ": " + message);
            }
        });

        server.start();
        System.out.println("SocketIO server started on port 9092");

        return server;
    }

        // Method to get the username for a given client based on roomId
    private String getUsernameForClient(String roomId, SocketIOClient client) {
        // Fetch the room details from the rooms map
        RoomDetails room = rooms.get(roomId);
        
        if (room != null) {
            // Iterate through the room's occupants to find the username for the given client sessionId
            for (Map.Entry<String, String> entry : room.getOccupants().entrySet()) {
                if (entry.getKey().equals(client.getSessionId())) {
                    // Return the username associated with the client's sessionId
                    return entry.getValue();
                }
            }
        }
        
        // If the client is not found in the room's occupants, return null or handle the error accordingly
        return null;
    }

    private String getRoomOfClient(SocketIOClient client) {
        for (String room : client.getAllRooms()) {
            return room;
        }
        return null;
    }

    private void startRoomTimer(String roomId) {
        RoomDetails room = rooms.get(roomId);
        if (room == null || room.isTimerRunning()) {
            return;
        }

        room.setTimerRunning(true);

        new Thread(() -> {
            while (room.getRemainingTime() > 0 && room.isTimerRunning()) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }

                room.setRemainingTime(room.getRemainingTime() - 1);
                server.getRoomOperations(roomId).sendEvent("timer_update", room.getRemainingTime());

                if (room.getOccupancy() == 0) {
                    room.setTimerRunning(false);
                    break;
                }
            }

            if (room.getRemainingTime() <= 0) {
                room.setTimerRunning(false);
                server.getRoomOperations(roomId).sendEvent("timer_ended", "Time's up!");
            }
        }).start();
    }

}