package com.example.backend.Controllers;

import com.example.backend.Dto.CreateEventDTO;
import com.example.backend.Dto.EventParticipantDTO;
import com.example.backend.Dto.UpdateEventDTO;
import com.example.backend.Entities.Event;
import com.example.backend.Entities.User;
import com.example.backend.Services.EventService;

import com.example.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventService eventService;
    
    // Get all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
    
      // Create a new event (admin or moderator only)
      //@PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATEUR')")
    @PostMapping
public ResponseEntity<Event> createEvent(@RequestBody CreateEventDTO eventDTO) {
    // Get user email from Spring Security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName(); // This gets the username (email in your case)
    
    // Find the user by email
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    Event createdEvent = eventService.createEvent(eventDTO, user.getId());
    return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
}

      
    
    // Update event (only for organizer or admin)
    @PreAuthorize("hasAuthority('ADMIN') or @eventService.getEventById(#id).getOrganizer().getId() == authentication.principal.id")
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody UpdateEventDTO eventDTO) {
        Event updatedEvent = eventService.updateEvent(id, eventDTO);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }
    
    // Delete event (only for organizer or admin)
    @PreAuthorize("hasAuthority('ADMIN') or @eventService.getEventById(#id).getOrganizer().getId() == authentication.principal.id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Register a user for an event
@PostMapping("/{eventId}/register/{userId}")
public ResponseEntity<EventParticipantDTO> registerUserForEvent(
        @PathVariable Long eventId,
        @PathVariable Long userId) {
    Event updatedEvent = eventService.registerUserForEvent(eventId, userId);
    EventParticipantDTO dto = EventParticipantDTO.fromEvent(updatedEvent);
    return new ResponseEntity<>(dto, HttpStatus.OK);
}

@DeleteMapping("/{eventId}/unregister/{userId}")
public ResponseEntity<EventParticipantDTO> unregisterUserFromEvent(
        @PathVariable Long eventId,
        @PathVariable Long userId) {
    Event updatedEvent = eventService.unregisterUserFromEvent(eventId, userId);
    EventParticipantDTO dto = EventParticipantDTO.fromEvent(updatedEvent);
    return new ResponseEntity<>(dto, HttpStatus.OK);
}
    
    // Get upcoming events
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    // Get events by type (webinar, conference, etc.)
    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable String eventType) {
        List<Event> events = eventService.getEventsByType(eventType);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    // Get events by organizer
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<Event> events = eventService.getEventsByOrganizer(organizerId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
