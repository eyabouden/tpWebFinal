package com.example.backend.Repositories;

import com.example.backend.Entities.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    List<Contribution> findByArticleId(Long articleId);
    List<Contribution> findByUserId(Long userId);
    Long countByUserId(Long userId);
}