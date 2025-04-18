package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Dto.ArticleDTO;
import com.example.backend.Dto.ContributionDTO;
import com.example.backend.Dto.CreateContributionDTO;
import com.example.backend.Dto.UpdateContributionDTO;
import com.example.backend.Entities.Article;
import com.example.backend.Entities.Contribution;
import com.example.backend.Entities.User;
import com.example.backend.Services.ArticleService;
import com.example.backend.Services.ContributionService;
import com.example.backend.Services.UserService;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles/{articleId}/contributions")
@CrossOrigin(origins = "*")
public class ContributionController {

    @Autowired
    private ContributionService contributionService;
    
    @Autowired
    private ArticleService articleService;
    
    @Autowired
    private UserService userService;
    
    // @PostMapping
    // public ResponseEntity<?> addContribution(
    //         @PathVariable Long articleId,
    //         @RequestParam Long userId,
    //         @RequestBody CreateContributionDTO contributionDTO) {
        
    //     try {
    //         // Get article entity
    //         Article article = articleService.getArticleEntityById(articleId);
    //         if (article == null) {
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND)
    //                 .body("Article not found with ID: " + articleId);
    //         }
            
    //         // Verify the contributor exists
    //         User contributor = userService.getUserById(contributionDTO.getContributorId());
    //         if (contributor == null) {
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND)
    //                 .body("Contributor not found with ID: " + contributionDTO.getContributorId());
    //         }
            
    //         // Verify the user has permission (basic check - can be expanded)
    //         User user = userService.getUserById(userId);
    //         if (user == null) {
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND)
    //                 .body("User not found with ID: " + userId);
    //         }
            
    //         // Create and save the contribution
    //         Contribution contribution = new Contribution();
    //         contribution.setArticle(article);
    //         contribution.setUser(contributor);
    //         contribution.setType(contributionDTO.getType());
    //         contribution.setDate(new Date()); // Set current date
            
    //         Contribution savedContribution = contributionService.saveContribution(contribution);
            
    //         // Return the contribution DTO
    //         ContributionDTO responseDTO = ContributionDTO.fromEntity(savedContribution);
    //         return ResponseEntity.ok(responseDTO);
            
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    //             .body("Error: " + e.getMessage());
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //             .body("Error adding contribution: " + e.getMessage());
    //     }
    // }
    
    @DeleteMapping("/{contributionId}")
    public ResponseEntity<?> removeContribution(
            @PathVariable Long articleId,
            @PathVariable Long contributionId,
            @RequestParam Long userId) {
        
        try {
            // Verify the contribution exists
            Optional<Contribution> contributionOpt = contributionService.getContributionById(contributionId);
            if (!contributionOpt.isPresent() || !contributionOpt.get().getArticle().getId().equals(articleId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Contribution not found or does not belong to the specified article");
            }
            
            // Get user
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
            }
            
            // Check if the user is the article owner or admin
            Article article = contributionOpt.get().getArticle();
            if (!article.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("User does not have permission to remove contributions from this article");
            }
            
            // Remove the contribution
            contributionService.deleteContribution(contributionId);
            
            // Return the updated article
            ArticleDTO updatedArticle = articleService.getArticleById(articleId);
            return ResponseEntity.ok(updatedArticle);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error removing contribution: " + e.getMessage());
        }
    }


    // Add this method to your ContributionController class

@PutMapping("/{contributionId}")
public ResponseEntity<?> updateContribution(
        @PathVariable Long articleId,
        @PathVariable Long contributionId,
        @RequestParam Long userId,
        @RequestBody UpdateContributionDTO updateDTO) {
    
    try {
        // Verify the contribution exists
        Optional<Contribution> contributionOpt = contributionService.getContributionById(contributionId);
        if (!contributionOpt.isPresent() || !contributionOpt.get().getArticle().getId().equals(articleId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Contribution not found or does not belong to the specified article");
        }
        
        // Get user
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found with ID: " + userId);
        }
        
        // Check if the user is the article owner or admin
        Article article = contributionOpt.get().getArticle();
        if (!article.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("User does not have permission to update contributions for this article");
        }
        
        // Update the contribution
        Contribution contribution = contributionOpt.get();
        
        // Update values that were provided
        if (updateDTO.getType() != null) {
            contribution.setType(updateDTO.getType());
        }
        
        if (updateDTO.getLieu() != null) {
            contribution.setLieu(updateDTO.getLieu());
        }
        
        // Save the updated contribution
        Contribution updatedContribution = contributionService.saveContribution(contribution);
        
        // Return the updated contribution as DTO
        ContributionDTO responseDTO = ContributionDTO.fromEntity(updatedContribution);
        return ResponseEntity.ok(responseDTO);
        
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error updating contribution: " + e.getMessage());
    }
}
}