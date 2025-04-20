package com.example.backend.Dto;

import java.util.Date;

import com.example.backend.Enum.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {
    private String firstName;
    private String lastName; 
    private String email;
    private String password; 
    private String institution;
    private String position;
    private String department;
    private Date employmentDate;
    private String grade;
   // private Role role; 
}