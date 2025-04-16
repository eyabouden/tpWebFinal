package com.example.backend.Dto;

import com.example.backend.Entities.Article;
import com.example.backend.Entities.Domain;
import com.example.backend.Entities.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleDTO {
    private Long id;
    private String titre;
    private String doi;
    private String keyword;
    private String description;
    private String status;
    private Long domainId;
    private String filePath;
    
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
        }
        
        return dto;
    }
    
    // Method to convert DTO to Entity
    public Article toEntity(User user, Domain domain) {
        Article article = new Article();
        article.setId(this.id);
        article.setTitre(this.titre);
        article.setDoi(this.doi);
        article.setKeyword(this.keyword);
        article.setDescription(this.description);
        article.setStatus(this.status);
        article.setUser(user);
        article.setDomain(domain);
        article.setFilePath(this.filePath);
        
        return article;
    }
    
    // Update existing entity
    public void updateEntity(Article article) {
        article.setTitre(this.titre);
        article.setDoi(this.doi);
        article.setKeyword(this.keyword);
        article.setDescription(this.description);
        if (this.status != null) {
            article.setStatus(this.status);
        }
    }
}