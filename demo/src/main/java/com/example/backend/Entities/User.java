// package com.example.backend.Entities;

// import com.example.backend.Enum.Role;
// import com.fasterxml.jackson.annotation.JsonManagedReference;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.util.Date;
// import java.util.List;

// @Entity
// @Getter
// @Setter
// public class User {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String firstName;
//     private String lastName;
//     private String email;
//     private String password;
//     private Date employmentDate;
//     private String originalEstablishment;
//     private String lastDiploma;
//     private String grade;

//     @Enumerated(EnumType.STRING)
//     private Role role;

  
// @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
// @JsonManagedReference
// private List<Contribution> contributions;

// // Add these to User entity
// @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
// @JsonManagedReference
// private List<Comment> comments;

// // @OneToMany(mappedBy = "publishedBy", cascade = CascadeType.ALL)
// // @JsonManagedReference
// // private List<Announcement> announcements;

// @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
// @JsonManagedReference
// private List<Notification> notifications;

// @OneToMany(mappedBy = "uploadedBy", cascade = CascadeType.ALL)
// @JsonManagedReference
// private List<File> uploadedFiles;

// @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
// @JsonManagedReference
// private List<Event> createdEvents;

// @ManyToMany(mappedBy = "participants")
// private List<Event> participatingEvents;
// }

package com.example.backend.Entities;

import com.example.backend.Enum.Role;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String institution;
    private String position;
    private String department;
    private Date employmentDate;
    private String grade;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-articles")  
    private List<Article> articles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-contributions") 
    private List<Contribution> contributions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-comments")
    private List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-notifications")
    private List<Notification> notifications;

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-events")
    private List<Event> createdEvents;

    @ManyToMany(mappedBy = "participants")
    @JsonBackReference(value = "event-participants")
    private List<Event> participatingEvents;
}