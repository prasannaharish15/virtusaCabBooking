package com.secBackend.cab_backend.Util;

import com.secBackend.cab_backend.enumerations.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private  String secret ;
    @Value("${jwt.expiration}")
    long expiration;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    //Generate The JWT Token
    public String generateToken(String email, Role role) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+expiration))
                .claim("role",role.name())
                .signWith(getSecretKey(),SignatureAlgorithm.HS256)
                .compact();


    }

    //Get Subject From JWT
    public String getSubject(String jwtToken) {
        return getClaims(jwtToken).getSubject();
    }
    //Get Expiration From JWT
    public Date getExpiration(String jwtToken) {
        return getClaims(jwtToken).getExpiration();
    }
    //Get Role From JWT
    public String getRole(String token) {
        return getClaims(token).get("role",String.class);
    }

    //Validate JWT Token
    public boolean validateToken(String jwtToken, String email) {
        return getSubject(jwtToken).equals(email)&& !isTokenExpired(jwtToken);
    }
    //Check is Token Expired or not
    private boolean isTokenExpired(String jwtToken) {
        return getExpiration(jwtToken).before(new Date());
    }

    //Get All the Claims From JWT
    private Claims getClaims(String jwtToken) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();

    }
}
