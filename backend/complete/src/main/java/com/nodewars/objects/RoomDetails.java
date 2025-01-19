package com.nodewars.objects;

public class RoomDetails {
    private int occupancy;
    private String slug;

    public RoomDetails(int occupancy, String slug) {
        this.occupancy = occupancy;
        this.slug = slug;
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
}

