package com.ecommerce.backend.service;

import com.ecommerce.backend.model.ContactMessage;
import com.ecommerce.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public ContactMessage saveMessage(ContactMessage message) {
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);
        return contactMessageRepository.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public ContactMessage markAsRead(Long id) {
        Optional<ContactMessage> optionalMessage = contactMessageRepository.findById(id);
        if (optionalMessage.isPresent()) {
            ContactMessage message = optionalMessage.get();
            message.setRead(true);
            return contactMessageRepository.save(message);
        }
        throw new RuntimeException("Message not found");
    }

    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }
}
