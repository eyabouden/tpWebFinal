// package com.example.backend.Entities;

// import java.util.Date;

// import com.fasterxml.jackson.annotation.JsonBackReference;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import lombok.Getter;
// import lombok.Setter;

// @Entity
// @Getter
// @Setter
// public class Contribution {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne
//     @JoinColumn(name = "user_id", nullable = false)
//     @JsonBackReference
//     private User user; 

//     @ManyToOne
//     @JoinColumn(name = "article_id", nullable = false)
//      @JsonBackReference
//     private Article article; 

//     private String type; 

//     private Date date; 
//     private String lieu; 
// }

package com.example.backend.Entities;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Contribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "user-contributions")
    private User user;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    @JsonBackReference(value = "article-contributions") 
    private Article article;

    private String type; // "AUTHOR", "REVIEWER", "EDITOR", "CONTRIBUTOR" 

    private Date date; 
    private String lieu; 
}