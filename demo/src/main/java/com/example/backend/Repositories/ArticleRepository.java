package com.example.backend.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Article;
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
 
    
    // Query to get article counts by domain
    @Query("SELECT d.nomDomaine, COUNT(a) FROM Article a JOIN a.domain d GROUP BY d.nomDomaine")

    
    List<Object[]> countArticlesByDomain();

    Long countByUserId(Long userId);

    List<Article> findByKeywordContaining(String keyword); 
    Optional<Article> findByDoi(String doi); // 
    List<Article> findByDomainId(Long domainId);
    
    List<Article> findByKeywordContainingIgnoreCase(String keyword);
    
    List<Article> findByTitreContainingIgnoreCase(String titre);



    List<Article> findByStatus(String status);
   
}


