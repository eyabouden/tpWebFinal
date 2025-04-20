package com.example.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.Enum.Role;
import com.example.backend.Dto.UserUpdateRequest;
import com.example.backend.Entities.User;
import com.example.backend.Entities.Event;
import com.example.backend.Repositories.UserRepository;
import com.example.backend.Repositories.EventRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        // Si le rôle n’est pas défini, assigner UTILISATEUR par défaut
        if (user.getRole() == null) {
            user.setRole(Role.UTILISATEUR);
        }
    
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setEmail(user.getEmail());
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        user.setEmploymentDate(user.getEmploymentDate());
        user.setInstitution(user.getInstitution());
        user.setPosition(user.getPosition());
        user.setGrade(user.getGrade());
        user.setDepartment(user.getDepartment());
    
        return userRepository.save(user);
    }
    
    
    public User changeUserRole(Long userId, Role newRole) {
        User user = getUserById(userId);
        
        // Save the old role to check for changes
        Role oldRole = user.getRole();
        
        // Update the role
        user.setRole(newRole);
        
        // If changing from MODERATEUR/ADMIN to UTILISATEUR, clear moderator-specific fields
        if (oldRole != Role.UTILISATEUR && newRole == Role.UTILISATEUR) {
            user.setEmploymentDate(null);
            user.setInstitution(null);
            user.setPosition(null);
            user.setDepartment(null);
            user.setGrade(null);
        }
        
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User updateUser(Long id, UserUpdateRequest userUpdateRequest) {
        User existingUser = getUserById(id);
        
        // Update basic fields
        existingUser.setFirstName(userUpdateRequest.getFirstName());
        existingUser.setLastName(userUpdateRequest.getLastName());
        existingUser.setEmail(userUpdateRequest.getEmail());
        
        // Only update password if provided
        if (userUpdateRequest.getPassword() != null && !userUpdateRequest.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }
        
        // Handle role-specific fields
        if (existingUser.getRole() == Role.UTILISATEUR) {
            // Clear moderator-specific fields for regular users
            existingUser.setEmploymentDate(null);
            existingUser.setInstitution(null);
            existingUser.setPosition(null);
            existingUser.setDepartment(null);
            existingUser.setGrade(null);
        } else {
            // Update moderator-specific fields if user is MODERATEUR or ADMIN
            existingUser.setEmploymentDate(userUpdateRequest.getEmploymentDate());
            existingUser.setInstitution(userUpdateRequest.getInstitution());
            existingUser.setPosition(userUpdateRequest.getPosition());
            existingUser.setDepartment(userUpdateRequest.getDepartment());
            existingUser.setGrade(userUpdateRequest.getGrade());
        }
        
        return userRepository.save(existingUser);
    }



    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public List<User> getUserArticles(Long userId) {
        // 
        return List.of(getUserById(userId));
    }

    public List<Event> getEventsOrganizedByUser(Long userId) {
        User user = getUserById(userId);
        return eventRepository.findByCreatedById(userId);
    }
    
    public List<Event> getEventsUserParticipatingIn(Long userId) {
        User user = getUserById(userId);
        return eventRepository.findByParticipantsContaining(user);
    }
}