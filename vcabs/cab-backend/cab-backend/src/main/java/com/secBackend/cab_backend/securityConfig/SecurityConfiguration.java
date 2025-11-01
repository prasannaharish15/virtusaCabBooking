package com.secBackend.cab_backend.securityConfig;

import com.secBackend.cab_backend.filter.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Component
public class SecurityConfiguration {

    private final JwtFilter jwtFilter;

    // Constructor injection
    public SecurityConfiguration(JwtFilter jwtFilter){
        this.jwtFilter = jwtFilter;
    }

    @Bean
    // Password encoder for hashing passwords
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/auth/**","/api/otp/**").permitAll() // Public endpoints
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/customer/**").hasRole("CUSTOMER")
                                .requestMatchers("/api/cabs/**","/api/driver/**").hasRole("DRIVER")
                                .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless session
                .formLogin(formLogin -> formLogin.disable()) // Disable form login
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }
}
