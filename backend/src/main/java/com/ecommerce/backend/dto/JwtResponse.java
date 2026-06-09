package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String address;
    private String phoneNumber;
    private String profilePicture;
}
