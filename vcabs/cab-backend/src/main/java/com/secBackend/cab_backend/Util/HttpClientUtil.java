package com.secBackend.cab_backend.Util;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HttpClientUtil {

    private final RestTemplate restTemplate = new RestTemplate(); // Spring's HTTP client

    // Send POST request with JSON body and API key, return response as string
    public String postJson(String orsUrl, String body, String apiKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // set content type
        headers.set("Authorization", apiKey); // set API key header

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response =
                restTemplate.exchange(orsUrl, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode().isError()) {
            throw new RuntimeException("ORS API call failed: " + response.getStatusCode() + " - " + response.getBody());
        }

        return response.getBody(); // return JSON response
    }
}
