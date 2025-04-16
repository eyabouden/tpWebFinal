// package com.example.backend.Entities;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonBackReference;

// @Entity
// @Getter
// @Setter
// public class Article {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false, unique = true)
//     private String doi;

//     @Column(nullable = false)
//     private String titre;

//     @Column(nullable = false)
//     private String motsCles;

//     @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
//     private List<Contribution> contributions;

//     @ManyToOne
//     @JoinColumn(name = "domaine_id")
//      @JsonBackReference
//     private Domain domain;

    
// // }

// package com.example.backend.Entities;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonBackReference;
// import com.fasterxml.jackson.annotation.JsonManagedReference;

// @Entity
// @Getter
// @Setter
// public class Article {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @Column(nullable = false, unique = true)
//     private String doi;
    
//     @Column(nullable = false)
//     private String titre;
    
//     @Column(nullable = false)
//     private String motsCles;
    
//     @Column(nullable = false, length = 2000)
//     private String description;
    
//     // Many Articles belong to one Researcher
//     @ManyToOne
//     @JoinColumn(name = "researcher_id", nullable = false)
//     @JsonBackReference
//     private Researcher researcher;


//     @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
//     private List<Contribution> contributions;
    
//     // Many Articles belong to one Domain
//     @ManyToOne
//     @JoinColumn(name = "domaine_id")
//     @JsonBackReference
//     private Domain domain;
    
//     // One Article has one File
//     @OneToOne(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
//     @JsonManagedReference
//     private File file;
// }
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
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String doi;
    
    @Column(nullable = false)
    private String titre;
    
    @Column(nullable = false)
    private String keyword;
    
    @Column(nullable = false, length = 2000)
    private String description;
    @Column(nullable = false)
    private String status = "PENDING"; 
    

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    
    // 
    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Contribution> contributions;
    
    // Research domain
    @ManyToOne
    @JoinColumn(name = "domaine_id")
    @JsonBackReference
    private Domain domain;
    
    @Column(name = "file_path")
private String filePath;

    
}