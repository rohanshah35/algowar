package com.nodewars.config;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.nodewars.dto.RoomRequestDto;
import com.nodewars.objects.RoomDetails;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;


@Configuration
public class SocketIOConfig {

    private Map<String, RoomDetails> rooms = new HashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(SocketIOConfig.class);

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(9092);

        SocketIOServer server = new SocketIOServer(config);

        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
            for (String room : client.getAllRooms()) {
                rooms.get(room).setOccupancy(rooms.get(room).getOccupancy() - 1);
            }
        });

        server.addEventListener("join_room", String.class, (client, roomId, ackRequest) -> {
            logger.info("Client " + client.getSessionId() + " is attempting to join room " + roomId);
            if (!rooms.containsKey(roomId)) {
                ackRequest.sendAckData("error");
                return;
            }

            int currentOccupancy = rooms.get(roomId).getOccupancy();
            logger.info("Room " + roomId + " has " + currentOccupancy + " occupants");
            if (currentOccupancy >= 2) {
                ackRequest.sendAckData("hi");
                return;
            }

            client.joinRoom(roomId);
            RoomDetails roomDetails = rooms.get(roomId);
            roomDetails.setOccupancy(currentOccupancy + 1);
            logger.info("Room " + roomId + " now has " + roomDetails.getOccupancy() + " occupants");
            rooms.put(roomId, roomDetails); 
            logger.info("Client " + client.getSessionId() + " has successfully joined room " + roomId);
            ackRequest.sendAckData(Map.of(
                "status", "success",
                "slug", roomDetails.getSlug()
            ));

            server.getRoomOperations(roomId).sendEvent("user_joined", "A new user has joined the room!");
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
}
