package com.example.backend.Dto;


import com.example.backend.Entities.User;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class EventParticipantDTO {
    private Long id;
    private String title;
    private String description;
    private Date startDate;
    private Date endDate;
    private String location;
    private String eventType;
    private String status;
    private UserSummaryDTO createdBy;
    private List<UserSummaryDTO> participants = new ArrayList<>();
    
    @Getter
    @Setter
    public static class UserSummaryDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String position;
        
        public static UserSummaryDTO fromUser(User user) {
            UserSummaryDTO dto = new UserSummaryDTO();
            dto.setId(user.getId());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setEmail(user.getEmail());
            dto.setPosition(user.getPosition());
            return dto;
        }
    }
    
    public static EventParticipantDTO fromEvent(com.example.backend.Entities.Event event) {
        EventParticipantDTO dto = new EventParticipantDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setLocation(event.getLocation());
        dto.setEventType(event.getEventType());
        dto.setStatus(event.getStatus());
        
        // Set creator info
        if (event.getCreatedBy() != null) {
            dto.setCreatedBy(UserSummaryDTO.fromUser(event.getCreatedBy()));
        }
        
        // Set participants
        if (event.getParticipants() != null) {
            dto.setParticipants(
                event.getParticipants().stream()
                .map(UserSummaryDTO::fromUser)
                .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
}