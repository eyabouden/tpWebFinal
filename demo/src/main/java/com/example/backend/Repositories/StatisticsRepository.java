package com.example.backend.Repositories;

import com.example.backend.Entities.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    Long countByActionType(String actionType);
    Long countByArticleIdAndActionType(Long articleId, String actionType);
    Long countByArticleDomainIdAndActionType(Long domainId, String actionType);
   
    // Count by article ID and action type
    
    
    @Query(value = "SELECT d.nom_domaine AS domain, COUNT(s.id) AS count, " +
       "MONTH(s.action_date) AS month " +
       "FROM statistics s " +
       "JOIN article a ON s.article_id = a.id " +
       "JOIN domain d ON a.domaine_id = d.id " +  // This is the corrected join
       "WHERE s.action_type = 'DOWNLOAD' " +
       "GROUP BY d.nom_domaine, MONTH(s.action_date) " +
       "ORDER BY d.nom_domaine, MONTH(s.action_date)", 
       nativeQuery = true)
    List<Object[]> countDownloadsByDomain();

    // Get monthly stats for views and downloads
    @Query(value = "SELECT YEAR(s.action_date) AS year, " +
           "MONTH(s.action_date) AS month, " +
           "s.action_type AS actionType, " +
           "COUNT(s.id) AS count " +
           "FROM statistics s " +
           "WHERE s.action_date >= :startDate " +
           "GROUP BY YEAR(s.action_date), MONTH(s.action_date), s.action_type " +
           "ORDER BY YEAR(s.action_date), MONTH(s.action_date)", 
           nativeQuery = true)
    List<Object[]> getMonthlyStats(@Param("startDate") Date startDate);
    
    
    
}