package com.example.backend.Controllers;

import com.example.backend.Dto.ArticleDTO;
import com.example.backend.Dto.ContributionDTO;
import com.example.backend.Dto.CreateContributionDTO;
import com.example.backend.Entities.Article;
import com.example.backend.Entities.Contribution;
import com.example.backend.Entities.User;
import com.example.backend.Services.ArticleService;
import com.example.backend.Services.ContributionService;
import com.example.backend.Services.UserService;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:4200")
public class ArticleController {

    @Autowired
    private ContributionService contributionService;
    
    @Autowired
    private ArticleService articleService;
    
    @Autowired
    private UserService userService;

   
    @GetMapping()
    public ResponseEntity<List<ArticleDTO>> getAllArticles() {
        List<ArticleDTO> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/{id}")
    public ArticleDTO getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id);
    }

    // Modified to use RequestParam for articleDTO to prevent circular reference issues
    @PostMapping
    public ResponseEntity<ArticleDTO> createArticle(
            @RequestBody ArticleDTO articleDTO,
            @RequestParam Long userId) {
        try {
            ArticleDTO created = articleService.createArticle(articleDTO, userId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ArticleDTO updateArticle(
            @PathVariable Long id,
            @RequestBody ArticleDTO articleDTO,
            @RequestParam Long userId) {
        return articleService.updateArticle(id, articleDTO, userId);
    }

    // Rest of the controller remains unchanged...
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id, @RequestParam Long userId) {
        articleService.deleteArticle(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{articleId}/contributions")
    public ResponseEntity<ContributionDTO> addContribution(
            @PathVariable Long articleId,
            @RequestBody CreateContributionDTO contributionDto,
            @RequestParam Long userId) {
        
        try {
            // Get article entity
            Article article = articleService.getArticleEntityById(articleId);
            if (article == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify the contributor exists
            User contributor = userService.getUserById(contributionDto.getContributorId());
            if (contributor == null) {
                return ResponseEntity.badRequest().build();
            }
            
            // Verify the user has permission
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.badRequest().build();
            }
            
            // Check for duplicate contribution
            boolean isDuplicate = article.getContributions().stream()
                .anyMatch(c -> c.getUser().getId().equals(contributionDto.getContributorId()) 
                        && c.getType().equals(contributionDto.getType()));
                        
            if (isDuplicate) {
                return ResponseEntity.badRequest()
                    .body(null); // Could return error message
            }
            
            // Create and save the contribution
            Contribution contribution = new Contribution();
            contribution.setArticle(article);
            contribution.setUser(contributor);
            contribution.setType(contributionDto.getType());
            contribution.setDate(new Date());
            contribution.setLieu(contributionDto.getLieu() != null ? contributionDto.getLieu() : "Not specified");
            
            Contribution savedContribution = contributionService.saveContribution(contribution);
            
            // Return the contribution DTO
            return ResponseEntity.ok(ContributionDTO.fromEntity(savedContribution));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    

    @PutMapping("/{id}/validate")
    public Article validateArticle(
            @PathVariable Long id,
            @RequestBody ArticleDTO articleDTO,
            @RequestParam Long adminId) {
        return articleService.validateArticle(id, articleDTO.getStatus(), adminId);
    }
    @PostMapping("/{articleId}/assign-domain/{domainId}")
    public ArticleDTO assignDomainToArticle(
            @PathVariable Long articleId,
            @PathVariable Long domainId,
            @RequestParam Long userId) {
        Article article = articleService.assignDomainToArticle(articleId, domainId, userId);
        return ArticleDTO.fromEntity(article);
    }

    @PostMapping("/{articleId}/upload")
    public ArticleDTO uploadFile(
            @PathVariable Long articleId,
            @RequestParam("file") MultipartFile file) {
        return articleService.uploadFile(articleId, file);
    }

    @GetMapping("/{articleId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long articleId) {
        try {
            Resource resource = articleService.downloadFile(articleId);
            
            // Get the article to determine the file name
            Article article = articleService.getArticleEntityById(articleId);
            String filename = article.getFilePath().substring(article.getFilePath().lastIndexOf('/') + 1);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
        


//     // Upload file for article
// @PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATEUR') or @articleService.getArticleById(#articleId).getAuthor().getId() == authentication.principal.id")
// @PostMapping("/{articleId}/upload")
// public ResponseEntity<Article> uploadArticleFile(
//         @PathVariable Long articleId,
//         @RequestParam("file") MultipartFile file) {
//     Article updatedArticle = articleService.uploadArticleFile(articleId, file);
//     return new ResponseEntity<>(updatedArticle, HttpStatus.OK);
// }

// // Download article file
// @GetMapping("/{articleId}/download")
// public ResponseEntity<Resource> downloadArticleFile(@PathVariable Long articleId) {
//     // Get file details from the article
//     Article article = articleService.getArticleById(articleId);
//     Resource fileResource = articleService.loadArticleFileAsResource(article);
    
//     return ResponseEntity.ok()
//             .contentType(MediaType.parseMediaType("application/octet-stream"))
//             .header(HttpHeaders.CONTENT_DISPOSITION, 
//                     "attachment; filename=\"" + article.getFileName() + "\"")
//             .body(fileResource);
// }

















//enhaceed oneee for after  

// package com.example.backend.Controllers;

// import com.example.backend.Dto.CreateArticleDTO;
// import com.example.backend.Dto.UpdateArticleDTO;
// import com.example.backend.Entities.Article;
// import com.example.backend.Services.ArticleService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.List;

// @RestController
// @RequestMapping("/api/articles")
// public class ArticleController {
//     @Autowired
//     private ArticleService articleService;

//     // Create a new article (only moderators and admins)
//     @PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATEUR')")
//     @PostMapping
//     public ResponseEntity<Article> createArticle(
//             @RequestBody CreateArticleDTO articleDTO,
//             @RequestAttribute("userId") Long userId) {
//         Article createdArticle = articleService.createArticle(articleDTO, userId);
//         return new ResponseEntity<>(createdArticle, HttpStatus.CREATED);
//     }

//     // Get all articles (accessible to all authenticated users)
//     @GetMapping
//     public ResponseEntity<List<Article>> getAllArticles() {
//         List<Article> articles = articleService.getAllArticles();
//         return new ResponseEntity<>(articles, HttpStatus.OK);
//     }

//     // Get article by ID (accessible to all authenticated users)
//     @GetMapping("/{id}")
//     public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
//         Article article = articleService.getArticleById(id);
//         return new ResponseEntity<>(article, HttpStatus.OK);
//     }

//     // Update article (only for author, moderator or admin)
//     @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MODERATEUR') or @articleService.getArticleById(#id).getAuthor().getId() == authentication.principal.id")
//     @PutMapping("/{id}")
//     public ResponseEntity<Article> updateArticle(
//             @PathVariable Long id, 
//             @RequestBody UpdateArticleDTO articleDTO) {
//         Article updatedArticle = articleService.updateArticle(id, articleDTO);
//         return new ResponseEntity<>(updatedArticle, HttpStatus.OK);
//     }

//     // Delete article (only for author, moderator or admin)
//     @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MODERATEUR') or @articleService.getArticleById(#id).getAuthor().getId() == authentication.principal.id")
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
//         articleService.deleteArticle(id);
//         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//     }

//     // Search articles by keyword (accessible to all authenticated users)
//     @GetMapping("/search")
//     public ResponseEntity<List<Article>> searchArticles(@RequestParam String keyword) {
//         List<Article> articles = articleService.searchArticlesByKeyword(keyword);
//         return new ResponseEntity<>(articles, HttpStatus.OK);
//     }

//     // Get featured/recent articles for homepage
//     @GetMapping("/featured")
//     public ResponseEntity<List<Article>> getFeaturedArticles() {
//         List<Article> articles = articleService.getFeaturedArticles();
//         return new ResponseEntity<>(articles, HttpStatus.OK);
//     }

//     // Upload file for article (PDF)
//     @PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATEUR') or @articleService.getArticleById(#articleId).getAuthor().getId() == authentication.principal.id")
//     @PostMapping("/{articleId}/upload")
//     public ResponseEntity<Article> uploadArticleFile(
//             @PathVariable Long articleId,
//             @RequestParam("file") MultipartFile file) {
//         Article updatedArticle = articleService.uploadArticleFile(articleId, file);
//         return new ResponseEntity<>(updatedArticle, HttpStatus.OK);
//     }

//     // Download article file
//     @GetMapping("/{articleId}/download")
//     public ResponseEntity<?> downloadArticleFile(@PathVariable Long articleId) {
//         // Implementation will depend on your file storage approach
//         return articleService.downloadArticleFile(articleId);
//     }

//     // Assign article to user (admin only)
//     @PreAuthorize("hasAuthority('ADMIN')")
//     @PostMapping("/{articleId}/assign-user/{userId}")
//     public ResponseEntity<Article> assignArticleToUser(
//             @PathVariable Long articleId, 
//             @PathVariable Long userId) {
//         Article assignedArticle = articleService.assignArticleToUser(articleId, userId);
//         return new ResponseEntity<>(assignedArticle, HttpStatus.OK);
//     }

//     // Assign article to domain
//     @PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATEUR') or @articleService.getArticleById(#articleId).getAuthor().getId() == authentication.principal.id")
//     @PostMapping("/{articleId}/assign-domain/{domainId}")
//     public ResponseEntity<Article> assignArticleToDomain(
//             @PathVariable Long articleId, 
//             @PathVariable Long domainId) {
//         Article assignedArticle = articleService.assignArticleToDomain(articleId, domainId);
//         return new ResponseEntity<>(assignedArticle, HttpStatus.OK);
//     }
    
//     // Get articles by user
//     @GetMapping("/user/{userId}")
//     public ResponseEntity<List<Article>> getArticlesByUser(@PathVariable Long userId) {
//         List<Article> articles = articleService.getArticlesByUser(userId);
//         return new ResponseEntity<>(articles, HttpStatus.OK);
//     }
    
//     // Add article to favorites
//     @PostMapping("/{articleId}/favorite")
//     public ResponseEntity<Void> addArticleToFavorites(
//             @PathVariable Long articleId,
//             @RequestAttribute("userId") Long userId) {
//         articleService.addArticleToFavorites(articleId, userId);
//         return new ResponseEntity<>(HttpStatus.OK);
//     }
    
//     // Remove article from favorites
//     @DeleteMapping("/{articleId}/unfavorite")
//     public ResponseEntity<Void> removeArticleFromFavorites(
//             @PathVariable Long articleId,
//             @RequestAttribute("userId") Long userId) {
//         articleService.removeArticleFromFavorites(articleId, userId);
//         return new ResponseEntity<>(HttpStatus.OK);
//     }
    
//     // Get user's favorite articles
//     @GetMapping("/favorites")
//     public ResponseEntity<List<Article>> getUserFavoriteArticles(
//             @RequestAttribute("userId") Long userId) {
//         List<Article> articles = articleService.getUserFavoriteArticles(userId);
//         return new ResponseEntity<>(articles, HttpStatus.OK);
//     }
// }