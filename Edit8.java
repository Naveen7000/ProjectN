To integrate Spring Security for user authentication in your Spring Boot project, follow these steps. I'll guide you through setting up Spring Security and modifying your existing code to handle authentication securely. You are using Gradle, so I'll also provide the necessary Gradle dependencies.

Step 1: Add Spring Security Dependencies in build.gradle

First, you need to add the Spring Security dependencies in your Gradle file.

dependencies {
    // Other dependencies
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.security:spring-security-crypto'
    
    // Add any other dependencies you need
}

Step 2: Create a Custom UserDetailsService

Spring Security needs a custom UserDetailsService to load user-specific data. You can modify your existing UserService to implement this interface.

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;

import com.example.moneyflow.repos.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUserId(userId);
        
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        
        User foundUser = user.get();
        return org.springframework.security.core.userdetails.User
                .withUsername(foundUser.getUserId())
                .password(foundUser.getPassword())  // Secure passwords will be handled later
                .roles("USER")  // You can assign roles dynamically
                .build();
    }
}

Step 3: Configure Security Settings in a Configuration Class

Now, let's create a configuration class to customize Spring Security's behavior.

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                   .userDetailsService(userDetailsService)
                   .passwordEncoder(passwordEncoder())
                   .and()
                   .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable()  // Disable CSRF for simplicity; enable in production
                .authorizeRequests()
                .antMatchers("/api/user/register", "/api/user/login").permitAll()  // Allow registration and login without authentication
                .anyRequest().authenticated()
                .and()
                .httpBasic()  // You can also use form-based login
                .and().build();
    }
}

Step 4: Modify Registration and Authentication Logic

In UserService, use BCryptPasswordEncoder to hash passwords:

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransferRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Transfer registerUser(String firstName, String lastName, String email, String password) {
        String userId = generateUserId(USER_ID_LENGTH);
        String accountNumber = generateAccountNumber();
        String ifscCode = generateIFSCCode();
        String senderPin = generateUniquePin();

        String encodedPassword = passwordEncoder.encode(password);  // Encode the password

        // Save the user credentials in users collection
        User user = new User(userId, encodedPassword);
        userRepository.save(user);

        Transfer transaction = new Transfer(senderPin, userId, accountNumber, ifscCode, firstName, lastName, email, 0.0);
        transactionRepository.save(transaction);

        return transaction;
    }

    public boolean authenticateUser(String userId, String password) {
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return passwordEncoder.matches(password, user.getPassword());  // Verify password
        }
        return false;
    }
}

Step 5: Modify Controller for Authentication

Now update your controller to use the Spring Security's built-in authentication features.

MoneyFlowController.java

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class MoneyFlowController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<Transfer> registerUser(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String password) {
        Transfer profile = userService.registerUser(firstName, lastName, email, password);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(
            @RequestParam String userId,
            @RequestParam String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userId, password));
            return ResponseEntity.ok("Login successful");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}

Step 6: Test the Application

Start your Spring Boot application.

Test registration and login using the /register and /login endpoints.

Ensure that passwords are stored securely (hashed) in the database.


Optional: Add JWT (JSON Web Token) Authentication

For a stateless authentication mechanism, you can extend this by adding JWT-based security later if required.


---

This setup should give you a secure foundation for user authentication in your Spring Boot project. Let me know if you need further adjustments or help!


In a typical Spring Boot project structure, configuration classes like the SecurityConfig should be placed in the config package or a similar logical package under your main application package. Here’s an example of how your project structure might look:

src
└── main
    └── java
        └── com
            └── example
                └── moneyflow
                    ├── config
                    │   └── SecurityConfig.java        // <-- Security configuration file
                    ├── controller
                    │   └── MoneyFlowController.java   // <-- Your controller
                    ├── model
                    │   └── User.java
                    │   └── Transfer.java
                    ├── repos
                    │   └── UserRepository.java
                    │   └── TransferRepository.java
                    └── services
                        └── UserService.java           // <-- Your service layer
                        └── CustomUserDetailsService.java

Steps to follow:

1. Create the config package under com.example.moneyflow.


2. Place SecurityConfig.java in this config package.



This structure helps in maintaining clean and modular code, where:

controller: Handles incoming requests.

services: Contains the business logic.

config: Holds all the configuration-related classes like SecurityConfig.


The Spring Boot application will automatically detect the SecurityConfig class as long as it's in the same package or a subpackage of the main application class.

Main Application Class Location

Make sure the main application class, typically named MoneyFlowApplication.java, is at the root of the package structure (in com.example.moneyflow). This allows Spring Boot to scan all the sub-packages for components, services, and configuration classes.


