package com.secBackend.cab_backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.secBackend.cab_backend.Util.HttpClientUtil;
import com.secBackend.cab_backend.dataTransferObject.RouteResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final HttpClientUtil httpClientUtil;
    private final ObjectMapper objectMapper = new ObjectMapper(); // for parsing JSON

    // OpenRouteService API endpoint and API key
    private static final String ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car";
    private static final String API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjMxMGY5ZWI0ZTgwNTQ2MmViNmRlNDdkY2M3YzEzYmQzIiwiaCI6Im11cm11cjY0In0=";

    // Get route distance (km) and duration (minutes) between pickup and drop coordinates
    public RouteResult getRoute(double pickupLng, double pickupLat, double dropLng, double dropLat) {
        try {
            // Create JSON body for ORS request
            String body = """
                    {
                        "coordinates": [[%f, %f], [%f, %f]]
                    }
                    """.formatted(pickupLng, pickupLat, dropLng, dropLat);

            // Send POST request
            String jsonResponse = httpClientUtil.postJson(ORS_URL, body, API_KEY);

            // Parse JSON response
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode summary = root.path("routes").get(0).path("summary");

            if (summary.isMissingNode()) {
                throw new RuntimeException("ORS response missing 'routes.summary'. Raw response: " + jsonResponse);
            }

            double distance = summary.path("distance").asDouble() / 1000.0; // meters → km
            double duration = summary.path("duration").asDouble() / 60.0;   // seconds → minutes
            System.out.println("Distance and duration calculated:" + distance + " " + duration);

            return new RouteResult(distance, duration);

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch or parse route from ORS API", e);
        }
    }
}
