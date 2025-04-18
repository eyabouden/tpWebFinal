package com.example.backend.Dto;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CreateArticleDTO {
    private Long id;  // Only for updates
    private String titre;
    private String doi;
    private String keyword;
    private String description;
    private String status;
    private Long domainId;
    // No nested objects
}
