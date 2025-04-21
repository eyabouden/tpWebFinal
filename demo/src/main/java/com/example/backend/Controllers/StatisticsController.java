package com.example.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.backend.Entities.Statistics;

import java.util.List;
import java.util.Map;

import com.example.backend.Services.StatisticsService;
@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * Record a view or download action
     */
    @PostMapping("/record")
    public ResponseEntity<Statistics> recordAction(
            @RequestParam Long articleId,
            @RequestParam(required = false) Long userId,
            @RequestParam String actionType) {
        try {
            Statistics stat = statisticsService.recordAction(articleId, userId, actionType);
            return ResponseEntity.ok(stat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get overall statistics (counts of users, researchers, articles, events)
     */
    @GetMapping("/overall")
    public ResponseEntity<Map<String, Long>> getOverallStatistics() {
        Map<String, Long> stats = statisticsService.getOverallStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get article counts by domain
     */
    @GetMapping("/articles-by-domain")
    public ResponseEntity<List<Map<String, Object>>> getArticlesByDomain() {
        List<Map<String, Object>> stats = statisticsService.getArticlesByDomain();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get download statistics by domain
     */
    @GetMapping("/downloads-by-domain")
    public ResponseEntity<List<Map<String, Object>>> getDownloadsByDomain() {
        List<Map<String, Object>> stats = statisticsService.getDownloadsByDomain();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get statistics for a specific article
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<Map<String, Long>> getArticleStatistics(@PathVariable Long articleId) {
        Map<String, Long> stats = statisticsService.getArticleStatistics(articleId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Get monthly statistics
     */
    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyStats() {
        List<Map<String, Object>> stats = statisticsService.getMonthlyStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
    * Get count of articles created by a specific user
    */
   @GetMapping("/user/{userId}/articles-count")
   public ResponseEntity<Long> getArticleCountByUser(@PathVariable Long userId) {
       try {
           Long count = statisticsService.getArticleCountByUser(userId);
           return ResponseEntity.ok(count);
       } catch (RuntimeException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
       }
   }
   
   /**
    * Get count of events created by a specific user
    */
   @GetMapping("/user/{userId}/events-count")
   public ResponseEntity<Long> getEventCountByUser(@PathVariable Long userId) {
       try {
           Long count = statisticsService.getEventCountByUser(userId);
           return ResponseEntity.ok(count);
       } catch (RuntimeException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
       }
   }
   
   /**
    * Get count of events a user has attended as a participant
    */
   @GetMapping("/user/{userId}/events-attended")
   public ResponseEntity<Long> getEventsAttendedByUser(@PathVariable Long userId) {
       try {
           Long count = statisticsService.getEventsAttendedByUser(userId);
           return ResponseEntity.ok(count);
       } catch (RuntimeException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
       }
   }
   
   /**
    * Get comprehensive user statistics
    */
   @GetMapping("/user/{userId}")
   public ResponseEntity<Map<String, Long>> getUserStatistics(@PathVariable Long userId) {
       try {
           Map<String, Long> stats = statisticsService.getUserStatistics(userId);
           return ResponseEntity.ok(stats);
       } catch (RuntimeException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
       }
   }
  
}