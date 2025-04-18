package com.example.backend.Dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CreateContributionDTO {
    private Long userId;
    private Long contributorId;
    private Long articleId;
    private String type;
    private Date date;
    private String lieu;
    
  
}
