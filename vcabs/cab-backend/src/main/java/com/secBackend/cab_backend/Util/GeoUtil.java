package com.secBackend.cab_backend.Util;

import org.springframework.stereotype.Component;

@Component
public class GeoUtil {

    private static final int EARTH_RADIUS_KM = 6371; // Earth radius in km

    // Calculate distance between two coordinates using Haversine formula
    public static double distanceInKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1); // convert latitude difference to radians
        double dLon = Math.toRadians(lon2 - lon1); // convert longitude difference to radians

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c; // distance in km
    }
}
