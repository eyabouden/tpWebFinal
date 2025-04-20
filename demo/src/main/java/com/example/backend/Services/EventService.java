package com.example.backend.Services;

import com.example.backend.Dto.CreateEventDTO;
import com.example.backend.Dto.UpdateEventDTO;
import com.example.backend.Entities.Event;
import com.example.backend.Entities.User;
import com.example.backend.Repositories.EventRepository;
import com.example.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        Date now = new Date();
    
        for (Event event : events) {
            String updatedStatus = determineEventStatus(event.getStartDate(), event.getEndDate());
            if (!updatedStatus.equals(event.getStatus())) {
                event.setStatus(updatedStatus);
                eventRepository.save(event);
            }
        }
    
        return events;
    }
    
    
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'ID : " + id));
    }
    
    @Transactional
    public Event createEvent(CreateEventDTO dto, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
          
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setLocation(dto.getLocation());
        event.setEventType(dto.getEventType());
        event.setCreatedBy(user);
        event.setStatus(determineEventStatus(dto.getStartDate(), dto.getEndDate()));

        
        return eventRepository.save(event);
    }
    
    @Transactional
    public Event updateEvent(Long id, UpdateEventDTO dto) {
        Event event = getEventById(id);
        
        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDescription() != null) event.setDescription(dto.getDescription());
        if (dto.getStartDate() != null) event.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) event.setEndDate(dto.getEndDate());
        if (dto.getLocation() != null) event.setLocation(dto.getLocation());
        if (dto.getEventType() != null) event.setEventType(dto.getEventType());
        
        event.setStatus(determineEventStatus(dto.getStartDate(), dto.getEndDate()));

        
        return eventRepository.save(event);
    }
    
    @Transactional
public Event registerUserForEvent(Long eventId, Long userId) {
    Event event = getEventById(eventId);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));

    if (!event.getParticipants().contains(user)) {
        event.getParticipants().add(user);
        return eventRepository.save(event);
    }

    return event; // Already registered
}

@Transactional
public Event unregisterUserFromEvent(Long eventId, Long userId) {
    Event event = getEventById(eventId);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));

    if (event.getParticipants().contains(user)) {
        event.getParticipants().remove(user);
        return eventRepository.save(event);
    }

    return event; // Already not in the list
}

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
    
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStartDateAfter(new Date());
    }
    
    public List<Event> getEventsByType(String eventType) {
        return eventRepository.findByEventType(eventType);
    }
    
    public List<Event> getEventsByOrganizer(Long userId) {
        return eventRepository.findByCreatedById(userId);
    }
    private String determineEventStatus(Date startDate, Date endDate) {
        Date now = new Date();
        if (now.before(startDate)) {
            return "UPCOMING";
        } else if (!now.after(endDate)) {
            return "ONGOING";
        } else {
            return "COMPLETED";
        }
    }
      
}