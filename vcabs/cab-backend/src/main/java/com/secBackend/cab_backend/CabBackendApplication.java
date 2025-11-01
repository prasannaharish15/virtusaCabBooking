package com.secBackend.cab_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CabBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CabBackendApplication.class, args);
	}

}
