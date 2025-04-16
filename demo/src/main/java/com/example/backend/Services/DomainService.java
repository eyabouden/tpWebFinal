package com.example.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Dto.CreateDomainDTO;
import com.example.backend.Dto.UpdateDomainDTO;
import com.example.backend.Entities.Article;
import com.example.backend.Entities.Domain;
import com.example.backend.Repositories.DomainRepository;

@Service
public class DomainService {
    @Autowired
    private DomainRepository domainRepository;

    // Create a new domain
    @Transactional
    public Domain createDomain(CreateDomainDTO domainDTO) {
        Domain domain = new Domain();
        domain.setNomDomaine(domainDTO.getNomDomaine());
        return domainRepository.save(domain);
    }

    // Get all domains
    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    // Get domain by ID
    public Domain getDomainById(Long id) {
        return domainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Domain not found with id: " + id));
    }

    // Update domain
    @Transactional
    public Domain updateDomain(Long id, UpdateDomainDTO domainDTO) {
        Domain existingDomain = getDomainById(id);
        existingDomain.setNomDomaine(domainDTO.getNomDomaine());
        return domainRepository.save(existingDomain);
    }

    // Delete domain
    @Transactional
    public void deleteDomain(Long id) {
        Domain domain = getDomainById(id);
        domainRepository.delete(domain);
    }

    // Get all articles in a domain
    public List<Article> getArticlesByDomain(Long id) {
        Domain domain = getDomainById(id);
        return domain.getArticles();
    }

    // Search domains by keyword
    public List<Domain> searchDomainsByKeyword(String keyword) {
        return domainRepository.findByNomDomaineContainingIgnoreCase(keyword);
    }
}