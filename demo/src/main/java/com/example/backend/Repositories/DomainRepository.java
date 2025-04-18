package com.example.backend.Repositories;

import com.example.backend.Entities.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {
    
    /**
     * Find a domain by its name
     */
    Optional<Domain> findByNomDomaine(String nomDomaine);
    
    /**
     * Check if a domain exists by name
     */
    boolean existsByNomDomaine(String nomDomaine);
    
    /**
     * Search domains by keyword in name
     */
    @Query("SELECT d FROM Domain d WHERE LOWER(d.nomDomaine) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Domain> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Find domains with articles count
     */
    @Query("SELECT d, COUNT(a) FROM Domain d LEFT JOIN d.articles a GROUP BY d.id")
    List<Object[]> findDomainsWithArticleCount();
    
    /**
     * Find domains sorted by article count (most articles first)
     */
    @Query("SELECT d FROM Domain d LEFT JOIN d.articles a GROUP BY d.id ORDER BY COUNT(a) DESC")
    List<Domain> findDomainsSortedByArticleCount();

    List<Domain> findByNomDomaineContainingIgnoreCase(String keyword);
} 