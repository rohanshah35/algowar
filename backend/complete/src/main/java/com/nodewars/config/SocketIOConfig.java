package com.nodewars;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class SocketIOConfig {

    // Map to keep track of how many clients are in each room
    private Map<String, Integer> roomOccupancy = new HashMap<>();

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(9092);

        SocketIOServer server = new SocketIOServer(config);

        // Add connect listener to handle new client connections
        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        // Add disconnect listener
        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
            // After a client disconnects, reduce the room count
            for (String room : client.getAllRooms()) {
                roomOccupancy.put(room, roomOccupancy.get(room) - 1);
            }
        });

        // Handle custom join_room event where users can join a custom namespace (room)
        server.addEventListener("join_room", String.class, (client, roomId, ackRequest) -> {
            // Check if the room exists
            if (!roomOccupancy.containsKey(roomId)) {
                // If the room doesn't exist, send error response using ackSender
                ackRequest.sendAckData("error");
                return;
            }

            // Check if the room already has 2 clients
            int currentOccupancy = roomOccupancy.getOrDefault(roomId, 0);
            if (currentOccupancy >= 2) {
                // If the room is full, send error response using ackSender
                ackRequest.sendAckData("error");
                return;
            }

            // Room is not full, so allow the client to join
            client.joinRoom(roomId);
            roomOccupancy.put(roomId, currentOccupancy + 1);  // Increase the room count

            // Send success response using ackSender
            ackRequest.sendAckData("success" );

            // Notify all other clients in the room
            server.getRoomOperations(roomId).sendEvent("user_joined", "A new user has joined the room!");
        });

        // Handle custom create_room event where users can create a room
        server.addEventListener("create_room", String.class, (client, roomId, ackRequest) -> {
            // Check if the room already exists
            if (roomOccupancy.containsKey(roomId)) {
                // If the room already exists, send error response using ackSender
                ackRequest.sendAckData("error");
                return;
            }

            // If the room doesn't exist, create the room and set initial occupancy
            roomOccupancy.put(roomId, 0);

            client.joinRoom(roomId);

            // Send success response using ackSender
            ackRequest.sendAckData("success");
        });


        // Handle message event to communicate within a room
        server.addEventListener("message", String.class, (client, message, ackRequest) -> {
            String roomId = getRoomOfClient(client);

            if (roomId != null) {
                // Broadcast the message to all clients in the room
                server.getRoomOperations(roomId).sendEvent("room_message", message);
                System.out.println("Message from " + client.getSessionId() + " in room " + roomId + ": " + message);
            }
        });

        // Start the server
        server.start();
        System.out.println("SocketIO server started on port 9092");

        return server;
    }

    // Helper method to get the room ID the client is currently in (if any)
    private String getRoomOfClient(SocketIOClient client) {
        for (String room : client.getAllRooms()) {
            return room;  // Assuming client is in only one room, return the first one.
        }
        return null;  // If no room is found
    }
}
