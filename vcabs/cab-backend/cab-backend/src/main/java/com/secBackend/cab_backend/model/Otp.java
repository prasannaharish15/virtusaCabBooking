package com.secBackend.cab_backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class Otp {
    private String code;
    private LocalDateTime expireTime;

    public Otp(String code, int minValid) {
        this.code = code;
        this.expireTime = LocalDateTime.now().plusMinutes(minValid);
    }

    public boolean isExpired(){
        return LocalDateTime.now().isAfter(expireTime);
    }
}
