package com.example.backend.Services;

import com.example.backend.Dto.CreateContributionDTO;
import com.example.backend.Dto.UpdateContributionDTO;
import com.example.backend.Entities.Article;
import com.example.backend.Entities.Contribution;
import com.example.backend.Entities.User;
import com.example.backend.Repositories.ArticleRepository;
import com.example.backend.Repositories.ContributionRepository;
import com.example.backend.Repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ContributionService {
    
    @Autowired
    private ContributionRepository contributionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ArticleRepository articleRepository;
    
    public List<Contribution> getAllContributions() {
        return contributionRepository.findAll();
    }
    
    public Optional<Contribution> getContributionById(Long id) {
        return contributionRepository.findById(id);
    }
    
    @Transactional
    public Contribution createContribution(CreateContributionDTO dto) {
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + dto.getUserId()));
            
        Article article = articleRepository.findById(dto.getArticleId())
            .orElseThrow(() -> new RuntimeException("Article non trouvé avec l'ID : " + dto.getArticleId()));
            
        Contribution contribution = new Contribution();
        contribution.setUser(user);
        contribution.setArticle(article);
        contribution.setType(dto.getType());
        contribution.setDate(new Date()); // Date actuelle par défaut, ou utilisez dto.getDate() si fourni
        contribution.setLieu(dto.getLieu());
        
        return contributionRepository.save(contribution);
    }
    
    @Transactional
    public Contribution updateContribution(Long id, UpdateContributionDTO dto) {
        Contribution contribution = contributionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contribution non trouvée avec l'ID : " + id));
        
        if (dto.getType() != null) {
            contribution.setType(dto.getType());
        }
        
        if (dto.getDate() != null) {
            contribution.setDate(dto.getDate());
        }
        
        if (dto.getLieu() != null) {
            contribution.setLieu(dto.getLieu());
        }
        
        return contributionRepository.save(contribution);
    }
    
    @Transactional
    public void deleteContribution(Long id) {
        contributionRepository.deleteById(id);
    }
    
    public List<Contribution> getContributionsByArticleId(Long articleId) {
        return contributionRepository.findByArticleId(articleId);
    }
    
    public List<Contribution> getContributionsByUserId(Long userId) {
        return contributionRepository.findByUserId(userId);
    }
    
    @Transactional
    public Contribution saveContribution(Contribution contribution) {
        return contributionRepository.save(contribution);
    }
}