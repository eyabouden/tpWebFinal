package com.example.backend.Dto;

import com.example.backend.Entities.User;
import com.example.backend.Enum.Role;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String institution;
    private String position;
    private String department;
    private Date employmentDate;
    private String grade;
    private Role role;
    
    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setInstitution(user.getInstitution());
        dto.setPosition(user.getPosition());
        dto.setDepartment(user.getDepartment());
        dto.setEmploymentDate(user.getEmploymentDate());
        dto.setGrade(user.getGrade());
        dto.setRole(user.getRole());
        return dto;
    }
}