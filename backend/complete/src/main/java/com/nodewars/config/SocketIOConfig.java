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
        
            logger.info("Client " + client.getSessionId() + " is attempting to join room " + roomId);
        
            if (!rooms.containsKey(roomId)) {
                ackRequest.sendAckData("error");
                return;
            }
        
            RoomDetails roomDetails = rooms.get(roomId);
            int currentOccupancy = roomDetails.getOccupancy();
            if (currentOccupancy >= 2) {
                ackRequest.sendAckData("hi");
                return;
            }
        
            client.joinRoom(roomId);
            roomDetails.setOccupancy(currentOccupancy + 1);
            roomDetails.addOccupant(username);
        
            String pfp = s3Service.getPreSignedUrl(userService.getPfpByPreferredUsername(username));
            String elo = String.valueOf(userService.getEloByPreferredUsername(username));
        
            List<Map<String, String>> occupantsData = roomDetails.getOccupants().stream()
                .map(occupant -> {
                    String occupantPfp = s3Service.getPreSignedUrl(userService.getPfpByPreferredUsername(occupant));
                    String occupantElo = String.valueOf(userService.getEloByPreferredUsername(occupant));
                    return Map.of(
                        "username", occupant,
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