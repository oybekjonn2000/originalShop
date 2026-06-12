package com.ecommerce.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Data
@NoArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contact;
    private String subject;
    
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String message;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @jakarta.persistence.Column(name = "is_read")
    private Boolean read = false;
}
