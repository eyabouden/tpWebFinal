// package com.example.backend.Controllers;

// import com.example.backend.Entities.Article;
// import com.example.backend.Entities.Comment;
// import com.example.backend.Services.PublicationService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/publications")
// @CrossOrigin(origins = "*")
// public class PublicationController {

//     @Autowired
//     private PublicationService publicationService;

//     /**
//      * Get all publications
//      */
//     @GetMapping
//     public ResponseEntity<List<Article>> getAllPublications() {
//         List<Article> publications = publicationService.getAllPublications();
//         return ResponseEntity.ok(publications);
//     }

//     /**
//      * Get publication by ID
//      */
//     @GetMapping("/{id}")
//     public ResponseEntity<?> getPublicationById(@PathVariable Long id) {
//         return publicationService.getPublicationById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     /**
//      * Create a new publication
//      */
//     @PostMapping
//     public ResponseEntity<?> createPublication(
//             @RequestBody Article article,
//             @RequestParam Long userId) {
//         try {
//             Article createdArticle = publicationService.createPublication(article, userId);
//             return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
//         } catch (RuntimeException e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     /**
//      * Update a publication
//      */
//     @PutMapping("/{id}")
//     public ResponseEntity<?> updatePublication(
//             @PathVariable Long id,
//             @RequestBody Article article,
//             @RequestParam Long userId) {
//         try {
//             Article updatedArticle = publicationService.updatePublication(id, article, userId);
//             return ResponseEntity.ok(updatedArticle);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         }
//     }

//     /**
//      * Delete a publication
//      */
//     @DeleteMapping("/{id}")
//     public ResponseEntity<?> deletePublication(
//             @PathVariable Long id,
//             @RequestParam Long userId) {
//         try {
//             publicationService.deletePublication(id, userId);
//             return ResponseEntity.noContent().build();
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         }
//     }

//     /**
//      * Get publications by domain
//      */
//     @GetMapping("/domain/{domainId}")
//     public ResponseEntity<List<Article>> getPublicationsByDomain(@PathVariable Long domainId) {
//         List<Article> publications = publicationService.getPublicationsByDomain(domainId);
//         return ResponseEntity.ok(publications);
//     }

//     /**
//      * Search publications by keyword
//      */
//     @GetMapping("/search")
//     public ResponseEntity<List<Article>> searchPublications(@RequestParam String keyword) {
//         List<Article> publications = publicationService.getPublicationsByKeyword(keyword);
//         return ResponseEntity.ok(publications);
//     }

//     /**
//      * Add a comment to a publication
//      */
//     @PostMapping("/{articleId}/comments")
//     public ResponseEntity<?> addComment(
//             @PathVariable Long articleId,
//             @RequestBody Comment comment,
//             @RequestParam Long userId) {
//         try {
//             Comment createdComment = publicationService.addComment(articleId, comment, userId);
//             return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
//         } catch (RuntimeException e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     /**
//      * Get comments for a publication
//      */
//     @GetMapping("/{articleId}/comments")
//     public ResponseEntity<List<Comment>> getCommentsByArticle(@PathVariable Long articleId) {
//         List<Comment> comments = publicationService.getCommentsByArticle(articleId);
//         return ResponseEntity.ok(comments);
//     }

//     /**
//      * Moderate a comment (approve/reject) - admin/moderator only
//      */
//     @PutMapping("/comments/{commentId}/moderate")
//     public ResponseEntity<?> moderateComment(
//             @PathVariable Long commentId,
//             @RequestBody Map<String, String> request,
//             @RequestParam Long userId) {
//         try {
//             String status = request.get("status");
//             if (status == null || (!status.equals("APPROVED") && !status.equals("REJECTED"))) {
//                 return ResponseEntity.badRequest().body("Invalid status. Must be APPROVED or REJECTED");
//             }
            
//             Comment moderatedComment = publicationService.moderateComment(commentId, status, userId);
//             return ResponseEntity.ok(moderatedComment);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         }
//     }
// }