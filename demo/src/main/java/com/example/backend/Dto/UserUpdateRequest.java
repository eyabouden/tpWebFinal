package com.example.backend.Dto;

import java.util.Date;

import com.example.backend.Enum.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String firstName; // Ensure this field is present
    private String lastName; // Ensure this field is present
    private String email; // Ensure this field is present
    private String password; // Ensure this field is present
    private String institution;
    private String position;
    private String department;
    private Date employmentDate;
    private String grade;
    private Role role; 
}