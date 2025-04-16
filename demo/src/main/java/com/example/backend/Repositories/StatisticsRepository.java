package com.example.backend.Repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.Entities.Statistics;

@Repository
public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    Long countByActionType(String actionType);
    Long countByArticleIdAndActionType(Long articleId, String actionType);
    Long countByArticleDomainIdAndActionType(Long domainId, String actionType);
   
    // Count by article ID and action type
    
    
    // Count downloads by domain and group by month
    @Query(value = "SELECT d.name AS domain, COUNT(s.id) AS count, " +
           "MONTH(s.action_date) AS month FROM statistics s " +
           "JOIN article a ON s.article_id = a.id " +
           "JOIN domain d ON a.domain_id = d.id " +
           "WHERE s.action_type = 'DOWNLOAD' " +
           "GROUP BY d.name, MONTH(s.action_date) " +
           "ORDER BY d.name, MONTH(s.action_date)", 
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