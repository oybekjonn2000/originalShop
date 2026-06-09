package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User changeUserRole(Long id, Role newRole) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setRole(newRole);
            return userRepository.save(user);
        }
        throw new RuntimeException("Foydalanuvchi topilmadi");
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateProfile(Long id, User updateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi"));
        if (updateRequest.getUsername() != null && !updateRequest.getUsername().trim().isEmpty()) {
            if (!user.getUsername().equalsIgnoreCase(updateRequest.getUsername().trim())) {
                if (userRepository.existsByUsername(updateRequest.getUsername().trim())) {
                    throw new RuntimeException("Xatolik: Foydalanuvchi nomi allaqachon band qilingan!");
                }
                user.setUsername(updateRequest.getUsername().trim());
            }
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().trim().isEmpty()) {
            if (!user.getEmail().equalsIgnoreCase(updateRequest.getEmail().trim())) {
                if (userRepository.existsByEmail(updateRequest.getEmail().trim())) {
                    throw new RuntimeException("Xatolik: Email manzili allaqachon foydalanilmoqda!");
                }
                user.setEmail(updateRequest.getEmail().trim());
            }
        }

        user.setFirstName(updateRequest.getFirstName());
        user.setLastName(updateRequest.getLastName());
        user.setPhoneNumber(updateRequest.getPhoneNumber());
        user.setAddress(updateRequest.getAddress());
        user.setProfilePicture(updateRequest.getProfilePicture());

        return userRepository.save(user);
    }
}
