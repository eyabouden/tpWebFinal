// package com.example.backend.Controllers;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.backend.Dto.LoginRequest;
// import com.example.backend.Dto.LoginResponse;
// import com.example.backend.Dto.RegisterRequest; // Create this DTO
// import com.example.backend.Entities.User;
// import com.example.backend.Services.UserService;
// import com.example.backend.security.JwtService;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {
    
//     private final AuthenticationManager authenticationManager;
//     private final UserService userService;
//     private final JwtService jwtService;
    
//     @Autowired
//     public AuthController(
//             AuthenticationManager authenticationManager,
//             UserService userService,
//             JwtService jwtService) {
//         this.authenticationManager = authenticationManager;
//         this.userService = userService;
//         this.jwtService = jwtService;
//     }
    
//     @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//         try {
//             System.out.println("Login attempt for email: " + loginRequest.getEmail());
            
//             Authentication authentication = authenticationManager.authenticate(
//                 new UsernamePasswordAuthenticationToken(
//                     loginRequest.getEmail(), 
//                     loginRequest.getPassword()
//                 )
//             );
            
//             System.out.println("Authentication successful for: " + loginRequest.getEmail());
            
//             // Generate JWT token
//             String token = jwtService.generateToken(authentication);
            
//             // Get user info
//             User user = userService.getUserByEmail(loginRequest.getEmail());
            
//             return ResponseEntity.ok(new LoginResponse(
//                 (long) user.getId(),
//                 user.getEmail(),
//                 user.getRole().toString(),
//                 token
//             ));
            
//         } catch (BadCredentialsException e) {
//             System.out.println("Bad credentials for: " + loginRequest.getEmail());
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//         } catch (Exception e) {
//             System.out.println("Login error: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
//         }
//     }
    
//     @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
//         try {
//             System.out.println("Register attempt for email: " + registerRequest.getEmail());

//             // Check if user already exists
//             if (userService.existsByEmail(registerRequest.getEmail())) {
//                 System.out.println("Registration failed: Email already registered - " + registerRequest.getEmail());
//                 return ResponseEntity.badRequest().body("Email already registered");
//             }

//             // Convert DTO to entity
//             User user = new User();
//             user.setEmail(registerRequest.getEmail());
//             user.setPassword(registerRequest.getPassword()); // Will be encoded in service
//             user.setFirstName(registerRequest.getFirstName());
//             user.setLastName(registerRequest.getLastName());
//            // user.setRole(registerRequest.getRole());
//             // Set other fields as needed

//             // Create new user
//             User newUser = userService.createUser(user);
//             System.out.println("User registered successfully: " + newUser.getEmail());

//             return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
//         } catch (Exception e) {
//             System.out.println("Registration error: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
//         }
//     }
// }


package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Dto.LoginRequest;
import com.example.backend.Dto.LoginResponse;
import com.example.backend.Dto.RegisterRequest;
import com.example.backend.Entities.User;
import com.example.backend.Enum.Role;
import com.example.backend.Services.UserService;
import com.example.backend.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    
    @Autowired
    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService,
           
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
       
        this.jwtService = jwtService;
    }
    
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail());
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );
            
            System.out.println("Authentication successful for: " + loginRequest.getEmail());
            
            // Generate JWT token
            String token = jwtService.generateToken(authentication);
            
            // Get user info
            User user = userService.getUserByEmail(loginRequest.getEmail());
            
            return ResponseEntity.ok(new LoginResponse(
                (long) user.getId(),
                user.getEmail(),
                user.getRole().toString(),
                token
            ));
            
        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for: " + loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Register attempt for email: " + registerRequest.getEmail());
    
            // Check if user already exists
            if (userService.existsByEmail(registerRequest.getEmail())) {
                System.out.println("Registration failed: Email already registered - " + registerRequest.getEmail());
                return ResponseEntity.badRequest().body("Email already registered");
            }
    
            // Convert DTO to entity
            User user = new User();
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword()); // to be encoded in the service
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
    
            // Définit le rôle (par défaut USER si null)
            Role role = registerRequest.getRole() != null ? registerRequest.getRole() : Role.UTILISATEUR;
            user.setRole(role);
    
            // Si MODERATEUR, remplir les champs spécifiques
            if (role == Role.MODERATEUR) {
                user.setInstitution(registerRequest.getInstitution());
                user.setPosition(registerRequest.getPosition());
                user.setDepartment(registerRequest.getDepartment());
                user.setEmploymentDate(registerRequest.getEmploymentDate());
                user.setGrade(registerRequest.getGrade());
            }
    
            // Create new user
            User newUser = userService.createUser(user);
            System.out.println("User registered successfully: " + newUser.getEmail());
    
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }
}    