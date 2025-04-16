// Repository Layer: Contains the methods for accessing and manipulating data.
// Service Layer: Contains your business logic. This is where you’ll call repository methods, apply any additional logic, and return the results.
// Controller Layer: The controller interacts with the service layer to handle incoming requests (e.g., REST endpoints).
package com.example.backend.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.User;
import com.example.backend.Enum.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findById(Long userId);
    // Optional<Article> getUserById(Integer userId);
    Long countByRole(Role role);
}