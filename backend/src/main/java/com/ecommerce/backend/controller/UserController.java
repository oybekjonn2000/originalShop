package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.service.UserService;
import com.ecommerce.backend.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.backend.security.JwtTokenProvider;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> changeUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String roleStr = payload.get("role");
        Role newRole = Role.valueOf(roleStr);
        return ResponseEntity.ok(userService.changeUserRole(id, newRole));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody User updateRequest) {
        try {
            User updatedUser = userService.updateProfile(userDetails.getId(), updateRequest);
            String newToken = jwtTokenProvider.generateJwtTokenFromUsername(updatedUser.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("username", updatedUser.getUsername());
            response.put("email", updatedUser.getEmail());
            response.put("role", updatedUser.getRole().name());
            response.put("firstName", updatedUser.getFirstName());
            response.put("lastName", updatedUser.getLastName());
            response.put("address", updatedUser.getAddress());
            response.put("phoneNumber", updatedUser.getPhoneNumber());
            response.put("profilePicture", updatedUser.getProfilePicture());
            response.put("token", newToken);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
