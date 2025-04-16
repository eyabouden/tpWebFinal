// package com.example.backend.Services;

// import com.example.backend.Entities.Article;
// import com.example.backend.Entities.Comment;
// import com.example.backend.Entities.User;
// import com.example.backend.Enum.Role;
// import com.example.backend.Repositories.ArticleRepository;
// import com.example.backend.Repositories.CommentRepository;
// import com.example.backend.Repositories.DomainRepository;
// import com.example.backend.Repositories.UserRepository;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.Date;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class PublicationService {

//     @Autowired
//     private ArticleRepository articleRepository;

//     @Autowired
//     private CommentRepository commentRepository;

//     @Autowired
//     private DomainRepository domainRepository;

//     @Autowired
//     private UserRepository userRepository;
//     /**
//      * Get all publications/articles
//      */
//     public List<Article> getAllPublications() {
//         return articleRepository.findAll();
//     }

//     /**
//      * Get publication by ID
//      */
//     public Optional<Article> getPublicationById(Long id) {
//         return articleRepository.findById(id);
//     }

//     /**
//      * Create a new publication
//      */
//     @Transactional
//     public Article createPublication(Article article, Long userId) {
//         User currentUser =userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
        
//         // Verify domain exists
//         if (article.getDomain() != null && article.getDomain().getId() != null) {
//             domainRepository.findById(article.getDomain().getId())
//                     .orElseThrow(() -> new RuntimeException("Domain not found"));
//         }
        
//         // Set status based on user role
//         // If admin or moderator, auto-approve, otherwise pending
//         if (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.MODERATEUR) {
//             // You can add a status field to your Article entity if needed
//             // article.setStatus("APPROVED");
//         } else {
//             // article.setStatus("PENDING");
//         }
        
//         // Save the article
//         return articleRepository.save(article);
//     }

//     /**
//      * Update a publication
//      */
//     @Transactional
//     public Article updatePublication(Long id, Article article, Long userId) {
//         User currentUser = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
        
//         Article existingArticle = articleRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Publication not found"));
        
//         // Check if user has rights to modify (is author, admin, or moderator)
//         boolean isAuthor = existingArticle.getContributions().stream()
//                 .anyMatch(contribution -> contribution.getUser().getId() == userId);
        
//         if (!isAuthor && currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.MODERATEUR) {
//             throw new RuntimeException("Not authorized to update this publication");
//         }
        
//         // Update fields
//         existingArticle.setTitre(article.getTitre());
//         existingArticle.setKeyword(article.getKeyword());
        
//         if (article.getDomain() != null && article.getDomain().getId() != null) {
//             existingArticle.setDomain(article.getDomain());
//         }
        
//         return articleRepository.save(existingArticle);
//     }

//     /**
//      * Delete a publication
//      */
//     @Transactional
//     public void deletePublication(Long id, Long userId) {
//         User currentUser =userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
        
//         Article existingArticle = articleRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Publication not found"));
        
//         // Check if user has rights to delete (is author, admin, or moderator)
//         boolean isAuthor = existingArticle.getContributions().stream()
//                 .anyMatch(contribution -> contribution.getUser().getId() == userId);
        
//         if (!isAuthor && currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.MODERATEUR) {
//             throw new RuntimeException("Not authorized to delete this publication");
//         }
        
//         articleRepository.delete(existingArticle);
//     }
    
//     /**
//      * Get publications by domain
//      */
//     public List<Article> getPublicationsByDomain(Long domainId) {
//         return articleRepository.findByDomainId(domainId);
//     }
    
//     /**
//      * Get publications by keyword
//      */
//     public List<Article> getPublicationsByKeyword(String keyword) {
//         return articleRepository.findByKeywordContainingIgnoreCase(keyword);
//     }
    
//     /**
//      * Add a comment to a publication
//      */
//     @Transactional
//     public Comment addComment(Long articleId, Comment comment, Long userId) {
//         User currentUser = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
        
//         Article article = articleRepository.findById(articleId)
//                 .orElseThrow(() -> new RuntimeException("Publication not found"));
        
//         comment.setUser(currentUser);
//         comment.setArticle(article);
//         comment.setCreationDate(new Date());
        
//         // Set status based on user role
//         if (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.MODERATEUR) {
//             comment.setStatus("APPROVED");
//         } else {
//             comment.setStatus("PENDING");
//         }
        
//         return commentRepository.save(comment);
//     }
    
//     /**
//      * Get comments for a publication
//      */
//     public List<Comment> getCommentsByArticle(Long articleId) {
//         return commentRepository.findByArticleId(articleId);
//     }
    
//     /**
//      * Approve or reject a comment (admin/moderator only)
//      */
//     @Transactional
//     public Comment moderateComment(Long commentId, String status, Long userId) {
//         User currentUser = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
        
//         // Only admin or moderator can moderate comments
//         if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.MODERATEUR) {
//             throw new RuntimeException("Not authorized to moderate comments");
//         }
        
//         Comment comment = commentRepository.findById(commentId)
//                 .orElseThrow(() -> new RuntimeException("Comment not found"));
        
//         comment.setStatus(status);
//         return commentRepository.save(comment);
//     }
// }