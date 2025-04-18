package com.example.backend.Dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.backend.Entities.Article;
import com.example.backend.Entities.Domain;
import com.example.backend.Entities.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
// Prevent circular references during serialization
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDTO {
    private Long id;
    private String titre;
    private String doi;
    private String keyword;
    private String description;
    private String status;
    private Long domainId;
    private String filePath;
    private Long userId; // Use ID instead of nested object for creation
    
    // Explicitly define separate properties for retrieval only
    private DomainDTO domain;
    private UserDTO user;
    private List<ContributionDTO> contributions;
    
    // Constructor to convert from Entity to DTO
    public static ArticleDTO fromEntity(Article article) {
        ArticleDTO dto = new ArticleDTO();
        dto.setId(article.getId());
        dto.setTitre(article.getTitre());
        dto.setDoi(article.getDoi());
        dto.setKeyword(article.getKeyword());
        dto.setDescription(article.getDescription());
        dto.setStatus(article.getStatus());
        dto.setFilePath(article.getFilePath());
        
        if (article.getDomain() != null) {
            dto.setDomainId(article.getDomain().getId());
            // Create simplified domain DTO to avoid circular references
            DomainDTO domainDto = new DomainDTO();
            domainDto.setId(article.getDomain().getId());
            domainDto.setNomDomaine(article.getDomain().getNomDomaine());
            dto.setDomain(domainDto);
        }

        if (article.getUser() != null) {
            dto.setUserId(article.getUser().getId());
            dto.setUser(UserDTO.fromEntity(article.getUser()));
        }
        
        // Map the contributions
        if (article.getContributions() != null && !article.getContributions().isEmpty()) {
            dto.setContributions(article.getContributions().stream()
                .map(ContributionDTO::fromEntity)
                .collect(Collectors.toList()));
        } else {
            dto.setContributions(new ArrayList<>());
        }
        
        return dto;
    }
    
    // Method to convert DTO to Entity for creation
    public Article toEntity(User user, Domain domain) {
        Article article = new Article();
        article.setId(this.id);
        article.setTitre(this.titre);
        article.setDoi(this.doi);
        article.setKeyword(this.keyword);
        article.setDescription(this.description);
        article.setStatus(this.status != null ? this.status : "PENDING"); // Default status
        article.setUser(user);
        
        // Set domain if provided
        if (domain != null) {
            article.setDomain(domain);
        }
        
        article.setFilePath(this.filePath);
        
        return article;
    }
    
    // Update existing entity with new values
    public void updateEntity(Article article) {
        if (this.titre != null) {
            article.setTitre(this.titre);
        }
        if (this.doi != null) {
            article.setDoi(this.doi);
        }
        if (this.keyword != null) {
            article.setKeyword(this.keyword);
        }
        if (this.description != null) {
            article.setDescription(this.description);
        }
        if (this.status != null) {
            article.setStatus(this.status);
        }
    }
}

// Simple DTO for Domain to avoid circular references
@Getter
@Setter
@NoArgsConstructor
class DomainDTO {
    private Long id;
    private String nomDomaine;
}