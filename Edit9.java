To implement Spring Security with JWT (JSON Web Token) authentication in your Spring Boot project, without using deprecated methods, and ensuring secure and stateless authentication, here's the entire solution, including the project structure, updated code, and explanations.

Project Structure

src/
│
├── main/
│   ├── java/com/example/moneyflow/
│   │   ├── controller/
│   │   │   └── MoneyFlowController.java
│   │   ├── model/
│   │   │   └── User.java
│   │   │   └── Transfer.java
│   │   ├── repos/
│   │   │   └── UserRepository.java
│   │   │   └── TransferRepository.java
│   │   ├── security/
│   │   │   └── JwtAuthenticationFilter.java
│   │   │   └── JwtTokenProvider.java
│   │   ├── service/
│   │   │   └── CustomUserDetailsService.java
│   │   │   └── UserService.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   └── resources/
│       └── application.properties
└── build.gradle


---

Step 1: Add Dependencies to build.gradle

dependencies {
    // Spring Security
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // JWT support
    implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
    implementation 'io.jsonwebtoken:jjwt-impl:0.11.5'
    implementation 'io.jsonwebtoken:jjwt-jackson:0.11.5'

    // Lombok for convenience
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    // Other dependencies
}


---

Step 2: User Entity (User.java)

package com.example.moneyflow.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    private String userId;
    private String password;
    private String email;
}


---

Step 3: Transfer Entity (Transfer.java)

package com.example.moneyflow.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Transfer {
    @Id
    private String id;
    private String userId;
    private String accountNumber;
    private String ifscCode;
    private String firstName;
    private String lastName;
    private String email;
    private double balance;
}


---

Step 4: Repository Interfaces

UserRepository.java


package com.example.moneyflow.repos;

import com.example.moneyflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserId(String userId);
    Optional<User> findByEmail(String email);
}

TransferRepository.java


package com.example.moneyflow.repos;

import com.example.moneyflow.model.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferRepository extends JpaRepository<Transfer, String> {
    Optional<Transfer> findByEmail(String email);
}


---

Step 5: JWT Token Provider (JwtTokenProvider.java)

package com.example.moneyflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final String JWT_SECRET = "your_secret_key";
    private final long JWT_EXPIRATION = 86400000L;  // 1 day

    public String generateToken(Authentication authentication) {
        String userId = authentication.getName();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    public String getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}


---

Step 6: JWT Filter (JwtAuthenticationFilter.java)

package com.example.moneyflow.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StringUtils;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, javax.servlet.ServletException {

        String jwt = getJwtFromRequest(request);

        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String userId = tokenProvider.getUserIdFromJWT(jwt);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userId);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}


---

Step 7: User Details Service (CustomUserDetailsService.java)

package com.example.moneyflow.service;

import com.example.moneyflow.repos.UserRepository;
import com.example.moneyflow.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with userId: " + userId));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUserId())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}


---

Step 8: Security Configuration (SecurityConfig.java)

package com.example.moneyflow.config;

import com.example.moneyflow.security.JwtAuthenticationFilter;
import com.example.moneyflow.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/register", "/api/user/login").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}


---

Step 9: Modify Controller (MoneyFlowController.java)

package com.example.moneyflow.controller;

import com.example.moneyflow.model.Transfer;
import com.example

MoneyFlowController.java (continued):

package com.example.moneyflow.controller;

import com.example.moneyflow.model.Transfer;
import com.example.moneyflow.service.UserService;
import com.example.moneyflow.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class MoneyFlowController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userId, password));

            String token = jwtTokenProvider.generateToken(authentication);

            return ResponseEntity.ok("Bearer " + token);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}


---

Step 10: Application Properties (application.properties)

spring.datasource.url=jdbc:mysql://localhost:3306/moneyflowdb
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect


---

Step 11: Modify User Service for Password Hashing (UserService.java)

package com.example.moneyflow.service;

import com.example.moneyflow.model.Transfer;
import com.example.moneyflow.model.User;
import com.example.moneyflow.repos.TransferRepository;
import com.example.moneyflow.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Transfer registerUser(String firstName, String lastName, String email, String password) {
        String userId = UUID.randomUUID().toString();
        String encodedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUserId(userId);
        user.setPassword(encodedPassword);
        user.setEmail(email);

        userRepository.save(user);

        Transfer transfer = new Transfer();
        transfer.setUserId(userId);
        transfer.setFirstName(firstName);
        transfer.setLastName(lastName);
        transfer.setEmail(email);
        transfer.setAccountNumber(UUID.randomUUID().toString().substring(0, 8));
        transfer.setIfscCode("IFSC" + UUID.randomUUID().toString().substring(0, 4));
        transfer.setBalance(0.0);

        transferRepository.save(transfer);

        return transfer;
    }

    public boolean authenticateUser(String userId, String password) {
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }
}


---

Step 12: Testing the API

Register User:

Send a POST request to /api/user/register with firstName, lastName, email, and password as parameters.


Login User:

Send a POST request to /api/user/login with userId and password.

On successful login, the server will return a JWT token in the response body.




---

JWT Token Authentication

After successful login, include the JWT token in the Authorization header of your subsequent requests:

Authorization: Bearer <jwt_token>


---

Conclusion

This setup ensures that:

Passwords are securely hashed using BCryptPasswordEncoder.

JWT is used for stateless authentication, avoiding session management.

Endpoints for /api/user/register and /api/user/login are public, while all other endpoints are secured.

All deprecated methods (like httpBasic(), .and()) are avoided in favor of up-to-date code.


Let me know if you encounter any issues during implementation or need further clarification!



  In the latest version of the JJWT (Java JWT) library, some methods like .signWith(), .setSigningKey(), and .parser() have been deprecated and replaced with new alternatives to make the API safer and easier to use. Here's how you can modify your JWT generation and validation logic using the new methods.

Key Changes:

1. signWith now requires you to pass the SecretKey directly instead of a byte[] or String.


2. setSigningKey has been replaced with signWith() or build() depending on your use case.


3. parser() has been replaced with JwtParserBuilder.



Updated JWT Generation and Validation

Step 1: Generate JWT Tokens

In your JwtTokenUtil (or equivalent class), modify the token generation method to use the new .signWith():

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.security.Keys;

public class JwtTokenUtil {

    private static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60; // 5 hours

    // Example key. Use a more secure key in production.
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Generate token for user
    public String generateToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userId);
    }

    // Helper method to generate the token
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(secretKey)  // No longer need .setSigningKey()
                .compact();
    }
}

Explanation of changes:

Keys.secretKeyFor(SignatureAlgorithm.HS256): This method is now used to generate a SecretKey for signing.

.signWith(secretKey): The secret key is passed directly into signWith().


Step 2: Validate and Parse JWT Tokens

In the token validation method, use JwtParserBuilder instead of parser():

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class JwtTokenUtil {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Validate the token
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()    // Replaces .parser()
                .setSigningKey(secretKey)  // Use secret key directly
                .build()    // New method to return a JwtParser
                .parseClaimsJws(token)
                .getBody();
    }

    // Check if the token has expired
    public Boolean isTokenExpired(String token) {
        final Date expiration = getAllClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    // Validate token
    public Boolean validateToken(String token, String userId) {
        final String username = getAllClaimsFromToken(token).getSubject();
        return (username.equals(userId) && !isTokenExpired(token));
    }
}

Explanation of changes:

parserBuilder(): This method replaces parser().


    #-#-#-#--#-##-#-#-#-#-##-#-#-#-#-#-#-

    The methods .signWith, .setSigningKey, and .parser() in the io.jsonwebtoken library have been deprecated in recent versions of the JJWT library. You can use the updated methods to ensure that the code conforms to the latest standards.

Here is how you can update your JwtTokenProvider class to address these deprecated methods:

Key Updates:

1. signWith now takes a Key object instead of a String.


2. Jwts.parser() has been replaced by Jwts.parserBuilder().


3. setSigningKey also uses a Key object instead of a String.



Updated Code:

package com.example.moneyflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Use a SecretKey instead of a string for security purposes
    private final SecretKey JWT_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long JWT_EXPIRATION = 86400000L;  // 1 day

    // Generate a JWT token
    public String generateToken(Authentication authentication) {
        String userId = authentication.getName();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(JWT_SECRET_KEY)  // Use SecretKey instead of a string
                .compact();
    }

    // Extract userId from JWT token
    public String getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET_KEY)  // Use SecretKey
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // Validate JWT token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET_KEY)  // Use SecretKey
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

Explanation of Changes:

1. SecretKey for Signing:

Instead of using a string for signing the JWT, we use Keys.secretKeyFor(SignatureAlgorithm.HS512) to generate a SecretKey. This is more secure and is the recommended approach in newer versions of JJWT.



2. parser() to parserBuilder():

The parser() method has been replaced with parserBuilder(), which allows setting the signing key using setSigningKey() and then building the parser.



3. Using SecretKey:

Both signWith() and setSigningKey() now require SecretKey instead of plain strings. This provides better cryptographic security.




Dependencies:

Make sure you are using the latest version of the JJWT library:

implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
implementation 'io.jsonwebtoken:jjwt-impl:0.11.5'
implementation 'io.jsonwebtoken:jjwt-jackson:0.11.5'  // Required if you want to use Jackson for JSON serialization/deserialization

This code should now be up-to-date with the latest standards and remove any deprecated method issues. Let me know if you need further clarification!

    

    

