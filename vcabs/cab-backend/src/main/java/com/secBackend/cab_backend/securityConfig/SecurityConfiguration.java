package com.secBackend.cab_backend.securityConfig;

import com.secBackend.cab_backend.filter.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/auth/**","/api/otp/**").permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/customer/**").hasRole("CUSTOMER")
                                // Allow customers to GET driver locations (for tracking)
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/cabs/*/location", "/api/cabs/locations").hasAnyRole("CUSTOMER", "DRIVER")
                                // Other cab endpoints (POST location updates) restricted to drivers
                                .requestMatchers("/api/cabs/**","/api/driver/**").hasRole("DRIVER")
                                .anyRequest().authenticated())
                .formLogin(form->form.disable())
                .httpBasic(basic->basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setAllowCredentials(true); // Allow cookies / JWT tokens

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
