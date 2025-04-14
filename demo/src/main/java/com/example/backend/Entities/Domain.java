package com.example.backend.Entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Getter
@Setter
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nomDomaine; // Example: NLP, Image, Cybersecurity

   @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL)
@JsonManagedReference
private List<Article> articles;

}

