package com.nodewars.objects;

import java.util.ArrayList;
import java.util.List;

public class RoomDetails {
    private int occupancy;
    private List<String> occupants;
    private String slug;
    private long remainingTime;
    private boolean isTimerRunning;

    public RoomDetails(int occupancy, String slug) {
        this.occupancy = occupancy;
        this.slug = slug;
        this.remainingTime = 900;
        this.isTimerRunning = false;
        this.occupants = new ArrayList<>();
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

    public List<String> getOccupants() {
        return new ArrayList<>(occupants);
    }

    public void setOccupants(List<String> occupants) {
        if (occupants.size() > occupancy) {
            throw new IllegalArgumentException("Occupants list exceeds room capacity.");
        }
        this.occupants = new ArrayList<>(occupants);
    }

    public boolean addOccupant(String occupant) {
        if (occupants.size() < occupancy) {
            return occupants.add(occupant);
        } else {
            throw new IllegalStateException("Room is already at full capacity.");
        }
    }
}
