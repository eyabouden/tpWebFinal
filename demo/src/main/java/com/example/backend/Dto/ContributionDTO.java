package com.example.backend.Dto;

import java.util.Date;
import com.example.backend.Entities.Contribution;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContributionDTO {
    private Long id;
    private Long articleId;
    private Long contributorId;
    private String type;
    private Date date;
    private String lieu;
    private UserDTO user;  // Include user information
    
    public static ContributionDTO fromEntity(Contribution contribution) {
        ContributionDTO dto = new ContributionDTO();
        dto.setId(contribution.getId());
        if (contribution.getArticle() != null) {
            dto.setArticleId(contribution.getArticle().getId());
        }
        if (contribution.getUser() != null) {
            dto.setContributorId(contribution.getUser().getId());
            dto.setUser(UserDTO.fromEntity(contribution.getUser()));
        }
        dto.setType(contribution.getType());
        dto.setDate(contribution.getDate());
        dto.setLieu(contribution.getLieu());
        return dto;
    }
}