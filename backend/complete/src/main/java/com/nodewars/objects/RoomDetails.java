package com.nodewars.objects;

import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RoomDetails {
    private static final Logger logger = LoggerFactory.getLogger(RoomDetails.class);
    private int occupancy;
    private HashMap<String, String> occupants;
    private String slug;
    private long remainingTime;
    private boolean isTimerRunning;

    public RoomDetails(int occupancy, String slug) {
        this.occupancy = occupancy;
        this.slug = slug;
        this.remainingTime = 900;
        this.isTimerRunning = false;
        this.occupants = new HashMap<>();
    }

    public int getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(int occupancy) {
        this.occupancy = occupancy;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public long getRemainingTime() {
        return remainingTime;
    }

    public void setRemainingTime(long remainingTime) {
        this.remainingTime = remainingTime;
    }

    public boolean isTimerRunning() {
        return isTimerRunning;
    }

    public void setTimerRunning(boolean timerRunning) {
        isTimerRunning = timerRunning;
    }

    public HashMap<String, String> getOccupants() {
        return new HashMap<>(occupants);
    }

    public void setOccupants(HashMap<String, String> occupants) {
        if (occupants.size() > occupancy) {
            throw new IllegalArgumentException("Occupants list exceeds room capacity.");
        }
        this.occupants = new HashMap<>(occupants);
    }

    public boolean addOccupant(String occupant_id, String username) {
        logger.info("Attempting to add " + username + " with room occupancy " + occupants.size());
        logger.info("occupancy " + occupancy);

        for (Map.Entry<String, String> entry : occupants.entrySet()) {
            if (entry.getValue().equals(username)) {
                logger.info("Removing old client ID " + entry.getKey() + " for username " + username);
                occupants.remove(entry.getKey());
                break;
            }
        }

        if (occupants.size() < 2) {
            occupants.put(occupant_id, username);
            return true;
        } else {
            throw new IllegalStateException("Room is already at full capacity.");
        }
    }

    public boolean updateOccupant(String occupant_id, String username) {
        for (Map.Entry<String, String> entry : occupants.entrySet()) {
            if (entry.getValue().equals(username)) {
                logger.info("Updating occupant: Removing old client ID " + entry.getKey() + " for username " + username);
                occupants.remove(entry.getKey());
                break;
            }
        }

        occupants.put(occupant_id, username);
        return true;
    }
}
