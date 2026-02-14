// Crée un nouveau fichier : src/main/java/com/morphology/arabic_morphology_app/config/CorsConfig.java

package com.morphology.arabic_morphology_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Autorise TOUS les endpoints
                .allowedOrigins("http://localhost:3000")  // Ton frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Méthodes autorisées
                .allowedHeaders("*")  // Tous les headers
                .allowCredentials(true)  // Si tu utilises cookies/auth plus tard
                .maxAge(3600);  // Cache preflight 1h
    }
}