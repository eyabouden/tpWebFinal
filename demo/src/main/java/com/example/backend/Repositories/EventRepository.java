package com.example.backend.Repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Event;
import com.example.backend.Entities.User;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventType(String eventType);
    List<Event> findByStartDateAfter(Date date);
    List<Event> findByCreatedById(Long userId);
    List<Event> findByParticipantsContaining(User participant);
    List<Event> findByStatus(String status);
    
}
