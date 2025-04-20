// package com.example.backend.Services;
// import com.example.backend.Entities.Article;
// import com.example.backend.Entities.Domain;
// import com.example.backend.Entities.Event;
// import com.example.backend.Entities.Statistics;
// import com.example.backend.Entities.User;
// import com.example.backend.Repositories.ArticleRepository;
// import com.example.backend.Repositories.DomainRepository;
// import com.example.backend.Repositories.EventRepository;
// import com.example.backend.Repositories.StatisticsRepository;
// import com.example.backend.Repositories.UserRepository;
// import com.example.backend.Enum.Role;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.*;
// import java.util.stream.Collectors;

// @Service
// public class StatisticsService {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private ArticleRepository articleRepository;

//     @Autowired
//     private EventRepository eventRepository;

//     @Autowired
//     private DomainRepository domainRepository;

//     @Autowired
//     private StatisticsRepository statisticsRepository;

//     /**
//      * Record a view or download action
//      */
//     public Statistics recordAction(Long articleId, Long userId, String actionType) {
//         Article article = articleRepository.findById(articleId)
//                 .orElseThrow(() -> new RuntimeException("Article not found"));
        
//         User user = null;
//         if (userId != null) {
//             user = userRepository.findById(userId)
//                     .orElseThrow(() -> new RuntimeException("User not found"));
//         }
        
//         Statistics stat = new Statistics();
//         stat.setArticle(article);
//         stat.setUser(user);
//         stat.setActionType(actionType);
//         stat.setActionDate(new Date());
        
//         return statisticsRepository.save(stat);
//     }
    
//     /**
//      * Get total counts of key entities
//      */
//     public Map<String, Long> getOverallStatistics() {
//         Map<String, Long> stats = new HashMap<>();
        
//         // Total users
//         stats.put("totalUsers", userRepository.count());
        
//         // Total researchers/chercheurs (users with RESEARCHER role)
//         stats.put("totalResearchers", userRepository.countByRole(Role.MODERATEUR));
        
//         // Total articles
//         stats.put("totalArticles", articleRepository.count());
        
//         // Total events
//         stats.put("totalEvents", eventRepository.count());
        
//         // Total domains
//         stats.put("totalDomains", domainRepository.count());
        
       
       
        
//         // Total views
//         stats.put("totalViews", statisticsRepository.countByActionType("VIEW"));
        
//         // Total downloads
//         stats.put("totalDownloads", statisticsRepository.countByActionType("DOWNLOAD"));
        
//         return stats;
//     }
    
//     /**
//      * Get article counts by domain
//      */
//     public List<Map<String, Object>> getArticlesByDomain() {
//         List<Object[]> results = articleRepository.countArticlesByDomain();
        
//         List<Map<String, Object>> stats = new ArrayList<>();
//         for (Object[] result : results) {
//             Map<String, Object> stat = new HashMap<>();
//             stat.put("domain", result[0]); // Domain name
//             stat.put("count", result[1]);  // Count of articles
//             stats.add(stat);
//         }
        
//         return stats;
//     }
    
//     /**
//      * Get download statistics by domain
//      */
//     // public List<Map<String, Object>> getDownloadsByDomain() {
//     //     List<Object[]> results = statisticsRepository.countDownloadsByDomain();
        
//     //     List<Map<String, Object>> stats = new ArrayList<>();
//     //     for (Object[] result : results) {
//     //         Map<String, Object> stat = new HashMap<>();
//     //         stat.put("domain", result[0]); // Domain name
//     //         stat.put("count", result[1]);  // Count of downloads
//     //         stat.put("month", result[2]);  // Month (if grouped by month)
//     //         stats.add(stat);
//     //     }
        
//     //     return stats;
//     // }
    
//     /**
//      * Get statistics for a specific article
//      */
//     public Map<String, Long> getArticleStatistics(Long articleId) {
//         Map<String, Long> stats = new HashMap<>();
        
//         stats.put("views", statisticsRepository.countByArticleIdAndActionType(articleId, "VIEW"));
//         stats.put("downloads", statisticsRepository.countByArticleIdAndActionType(articleId, "DOWNLOAD"));
        
//         return stats;
//     }

    
//     /**
//      * Get monthly statistics (views and downloads) for the past year
//      */
//     // public List<Map<String, Object>> getMonthlyStats() {
//     //     Calendar calendar = Calendar.getInstance();
//     //     calendar.add(Calendar.YEAR, -1); // Go back 1 year
//     //     Date oneYearAgo = calendar.getTime();
        
//     //     // List<Object[]> monthlyStats = statisticsRepository.getMonthlyStats(oneYearAgo);
        
//     //     List<Map<String, Object>> result = new ArrayList<>();
//     //     for (Object[] stat : monthlyStats) {
//     //         Map<String, Object> monthStat = new HashMap<>();
//     //         monthStat.put("year", stat[0]);
//     //         monthStat.put("month", stat[1]);
//     //         monthStat.put("actionType", stat[2]);
//     //         monthStat.put("count", stat[3]);
//     //         result.add(monthStat);
//     //     }
        
//     //     return result;
//     // }
    
//     /**
//      * Get top downloaded articles
//      */
//     // public List<Map<String, Object>> getTopDownloadedArticles(int limit) {
//     //     List<Object[]> topArticles = statisticsRepository.findTopDownloadedArticles(limit);
        
//     //     List<Map<String, Object>> result = new ArrayList<>();
//     //     for (Object[] article : topArticles) {
//     //         Map<String, Object> articleStat = new HashMap<>();
//     //         articleStat.put("articleId", article[0]);
//     //         articleStat.put("title", article[1]);
//     //         articleStat.put("downloadCount", article[2]);
//     //         result.add(articleStat);
//     //     }
        
//     //     return result;
//     // }
    
//     // /**
//     //  * Get top viewed articles
//     //  */
//     // public List<Map<String, Object>> getTopViewedArticles(int limit) {
//     //     List<Object[]> topArticles = statisticsRepository.findTopViewedArticles(limit);
        
//     //     List<Map<String, Object>> result = new ArrayList<>();
//     //     for (Object[] article : topArticles) {
//     //         Map<String, Object> articleStat = new HashMap<>();
//     //         articleStat.put("articleId", article[0]);
//     //         articleStat.put("title", article[1]);
//     //         articleStat.put("viewCount", article[2]);
//     //         result.add(articleStat);
//     //     }
        
//     //     return result;
//     // }
// }
package com.example.backend.Services;
import com.example.backend.Entities.Article;
import com.example.backend.Entities.Domain;
import com.example.backend.Entities.Event;
import com.example.backend.Entities.Statistics;
import com.example.backend.Entities.User;
import com.example.backend.Repositories.ArticleRepository;
import com.example.backend.Repositories.DomainRepository;
import com.example.backend.Repositories.EventRepository;
import com.example.backend.Repositories.StatisticsRepository;
import com.example.backend.Repositories.UserRepository;
import com.example.backend.Enum.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private StatisticsRepository statisticsRepository;

    /**
     * Record a view or download action
     */
    public Statistics recordAction(Long articleId, Long userId, String actionType) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        
        Statistics stat = new Statistics();
        stat.setArticle(article);
        stat.setUser(user);
        stat.setActionType(actionType);
        stat.setActionDate(new Date());
        
        return statisticsRepository.save(stat);
    }
    
    /**
     * Get total counts of key entities
     */
    public Map<String, Long> getOverallStatistics() {
        Map<String, Long> stats = new HashMap<>();
        
        // Total users
        stats.put("totalUsers", userRepository.count());
        
        // Total researchers/chercheurs (users with RESEARCHER role)
        stats.put("totalResearchers", userRepository.countByRole(Role.MODERATEUR));
        
        // Total articles
        stats.put("totalArticles", articleRepository.count());
        
        // Total events
        stats.put("totalEvents", eventRepository.count());
        
        // Total domains
        stats.put("totalDomains", domainRepository.count());
        
        // Pending articles (if you have a status field)
       
        
        // Total views
        stats.put("totalViews", statisticsRepository.countByActionType("VIEW"));
        
        // Total downloads
        stats.put("totalDownloads", statisticsRepository.countByActionType("DOWNLOAD"));
        
        return stats;
    }
    
    /**
     * Get article counts by domain
     */
    public List<Map<String, Object>> getArticlesByDomain() {
        List<Object[]> results = articleRepository.countArticlesByDomain();
        
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("domain", result[0]); // Domain name
            stat.put("count", result[1]);  // Count of articles
            stats.add(stat);
        }
        
        return stats;
    }
    
    /**
     * Get download statistics by domain
     */
    public List<Map<String, Object>> getDownloadsByDomain() {
        List<Object[]> results = statisticsRepository.countDownloadsByDomain();
        
        List<Map<String, Object>> stats = new ArrayList<>();
        for (Object[] result : results) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("domain", result[0]); // Domain name
            stat.put("count", result[1]);  // Count of downloads
            stat.put("month", result[2]);  // Month (if grouped by month)
            stats.add(stat);
        }
        
        return stats;
    }
    
    /**
     * Get statistics for a specific article
     */
    public Map<String, Long> getArticleStatistics(Long articleId) {
        Map<String, Long> stats = new HashMap<>();
        
        stats.put("views", statisticsRepository.countByArticleIdAndActionType(articleId, "VIEW"));
        stats.put("downloads", statisticsRepository.countByArticleIdAndActionType(articleId, "DOWNLOAD"));
        
        return stats;
    }

    /**
     * Get monthly statistics (views and downloads) for the past year
     */
    public List<Map<String, Object>> getMonthlyStats() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, -1); // Go back 1 year
        Date oneYearAgo = calendar.getTime();
        
        List<Object[]> monthlyStats = statisticsRepository.getMonthlyStats(oneYearAgo);
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] stat : monthlyStats) {
            Map<String, Object> monthStat = new HashMap<>();
            monthStat.put("year", stat[0]);
            monthStat.put("month", stat[1]);
            monthStat.put("actionType", stat[2]);
            monthStat.put("count", stat[3]);
            result.add(monthStat);
        }
        
        return result;
    }
    
    
    
    
    
}