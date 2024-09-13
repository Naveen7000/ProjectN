We can break down your project into several steps to implement the backend for user registration, login, and money transfer using Spring Boot and MongoDB. Below is the full solution with explanations.

Project Structure

src
├── main
│   ├── java
│   │   └── com
│   │       └── example
│   │           └── moneytransfer
│   │               ├── controller
│   │               │   ├── UserController.java
│   │               │   └── TransferController.java
│   │               ├── model
│   │               │   ├── Transaction.java
│   │               │   ├── User.java
│   │               └── repository
│   │               │   ├── TransactionRepository.java
│   │               │   └── UserRepository.java
│   │               └── service
│   │                   ├── UserService.java
│   │                   └── TransferService.java
├── resources
│   └── application.properties
└── build.gradle


---

Step 1: User and Transaction Models

User.java (for user authentication)

package com.example.moneytransfer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usersN") // collection for storing user credentials
public class User {
    @Id
    private String userId;
    private String password;

    // Constructors, getters and setters
    public User(String userId, String password) {
        this.userId = userId;
        this.password = password;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

Transaction.java (for saving user info and transfers)

package com.example.moneytransfer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String userId;
    private String accountNumber;
    private String ifscCode;
    private String firstName;
    private String lastName;
    private String email;
    private double balance;

    // Constructors, getters and setters
    public Transaction(String userId, String accountNumber, String ifscCode, String firstName, String lastName, String email, double balance) {
        this.userId = userId;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.balance = balance;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}


---

Step 2: Repository Interfaces

UserRepository.java

package com.example.moneytransfer.repository;

import com.example.moneytransfer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUserId(String userId);
}

TransactionRepository.java

package com.example.moneytransfer.repository;

import com.example.moneytransfer.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    Optional<Transaction> findByAccountNumberAndIfscCode(String accountNumber, String ifscCode);
}


---

Step 3: Service Layer

UserService.java

package com.example.moneytransfer.service;

import com.example.moneytransfer.model.Transaction;
import com.example.moneytransfer.model.User;
import com.example.moneytransfer.repository.TransactionRepository;
import com.example.moneytransfer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Register a new user
    public Transaction registerUser(String firstName, String lastName, String email, String password) {
        String userId = UUID.randomUUID().toString();
        String accountNumber = generateAccountNumber();
        String ifscCode = generateIFSCCode();

        // Save the user credentials in usersN collection
        User user = new User(userId, password);
        userRepository.save(user);

        // Save user data in the transaction collection
        Transaction transaction = new Transaction(userId, accountNumber, ifscCode, firstName, lastName, email, 0.0); // initial balance
        transactionRepository.save(transaction);

        return transaction;
    }

    // Authenticate user on login
    public boolean authenticateUser(String userId, String password) {
        return userRepository.findByUserId(userId)
                .map(user -> user.getPassword().equals(password))
                .orElse(false);
    }

    private String generateAccountNumber() {
        return "AC" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String generateIFSCCode() {
        return "IFSC" + UUID.randomUUID().toString().substring(0, 4);
    }
}

TransferService.java

package com.example.moneytransfer.service;

import com.example.moneytransfer.model.Transaction;
import com.example.moneytransfer.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class TransferService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Transfer money
    public String transferMoney(String senderAccountNumber, String senderIFSC, String receiverAccountNumber, String receiverIFSC, double amount) {
        Optional<Transaction> senderOpt = transactionRepository.findByAccountNumberAndIfscCode(senderAccountNumber, senderIFSC);
        Optional<Transaction> receiverOpt = transactionRepository.findByAccountNumberAndIfscCode(receiverAccountNumber, receiverIFSC);

        if (senderOpt.isPresent() && receiverOpt.isPresent()) {
            Transaction sender = senderOpt.get();
            Transaction receiver = receiverOpt.get();

            if (sender.getBalance() >= amount) {
                sender.setBalance(sender.getBalance() - amount);
                receiver.setBalance(receiver.getBalance() + amount);

                transactionRepository.save(sender);
                transactionRepository.save(receiver);

                return "Transfer successful!";
            } else {
                return "Insufficient balance!";
            }
        } else {
            return "Sender or receiver not found!";
        }
    }
}


---

Step 4: Controllers

UserController.java

package com.example.moneytransfer.controller;

import com.example.moneytransfer.model.Transaction;
import com.example.moneytransfer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Transaction> registerUser(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String password
    ) {
        Transaction transaction = userService.registerUser(firstName, lastName, email, password);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(
            @RequestParam String userId,
            @RequestParam String password
    ) {
        boolean isAuthenticated = userService.authenticateUser(userId, password);
        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}

TransferController.java

package com.example.moneytransfer.controller;

import com.example.moneytransfer.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfer")
public class TransferController {

    @Autowired
    private TransferService transferService;

    @PostMapping
    public ResponseEntity<String> transferMoney(
            @RequestParam String senderAccountNumber,
            @RequestParam String senderIFSC,
            @RequestParam String receiverAccountNumber,
            @RequestParam String receiverIFSC,
            @RequestParam double amount

) {
        String transferStatus = transferService.transferMoney(senderAccountNumber, senderIFSC, receiverAccountNumber, receiverIFSC, amount);
        return ResponseEntity.ok(transferStatus);
    }
}


---

Step 5: Configuration

application.properties

This file configures the MongoDB connection and port for your Spring Boot application.

# MongoDB settings
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=moneytransferdb

# Server port
server.port=8080


---

Step 6: Gradle Configuration

In the build.gradle file, ensure that you include the necessary dependencies for Spring Boot and MongoDB:

plugins {
    id 'org.springframework.boot' version '3.0.1'
    id 'io.spring.dependency-management' version '1.0.13.RELEASE'
    id 'java'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}


---

JSON Structure in MongoDB

For the usersN collection:

{
    "_id": "c453c7ec-8517-4c36-b038-d902d5860cf5",
    "userId": "user1234",
    "password": "$2a$10$7QfBtZJlgXix/aCfK8/KVeiK/QI5RpT1AIXyR0c5QeG6T6Y3bKNvq"  // Password hashed using bcrypt
}

For the transactions collection:

{
    "_id": "5f6d20c2-a372-4c8e-8173-6bd6bfa44ecb",
    "userId": "user1234",
    "accountNumber": "AC12345678",
    "ifscCode": "IFSC1234",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "balance": 1000.0
}


---

How to Test This Using Postman

1. Register a User

Request:

POST /api/user/register

Params:

firstName: John
lastName: Doe
email: john.doe@example.com
password: mypassword

Response:

{
    "userId": "c453c7ec-8517-4c36-b038-d902d5860cf5",
    "accountNumber": "AC12345678",
    "ifscCode": "IFSC1234",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "balance": 0.0
}

2. Login a User

Request:

POST /api/user/login

Params:

userId: c453c7ec-8517-4c36-b038-d902d5860cf5
password: mypassword

Response:

"Login successful"

3. Transfer Money

Request:

POST /api/transfer

Params:

senderAccountNumber: AC12345678
senderIFSC: IFSC1234
receiverAccountNumber: AC87654321
receiverIFSC: IFSC4321
amount: 100

Response:

"Transfer successful!"


---

Explanation of Code

User Registration & Login:

The user registration feature allows a new user to input their details (firstName, lastName, email, password).

A userId, accountNumber, and IFSC code are generated and saved in two collections: one for user credentials (usersN) and one for transaction information (transactions).

Passwords are hashed using BCrypt for security before saving.


Money Transfer:

Users can transfer money between accounts by specifying the sender and receiver's accountNumber and IFSC code.

The transfer logic checks the balance of the sender to ensure they have sufficient funds before transferring the amount.


Service Layer:

Handles the business logic of registration, authentication, and money transfer, decoupling it from the controllers, making the code modular and clean.


MongoDB Integration:

MongoDB is used as the database where the user information is stored in two collections (usersN and transactions).

The data is accessed and manipulated using MongoRepository in Spring Data MongoDB.




---

Let me know if you need any additional clarification or changes!


To generate a human-readable, alphanumeric, and fixed-length ID, we can modify the code to use a custom logic. Here’s a way to create a fixed-length alphanumeric ID using Java's Random class, or alternatively using UUID in a truncated and readable format.

Updated Approach for ID Generation:

The userId will now be a combination of uppercase letters and numbers.

The length of the userId will be fixed, e.g., 8 characters.


Here's how to achieve this:

Service Layer Update

1. UserService.java

Modify the logic for generating the user ID and account number to be more human-readable and of fixed length.

package com.example.moneytransfer.service;

import com.example.moneytransfer.model.UserTransaction;
import com.example.moneytransfer.model.User;
import com.example.moneytransfer.repository.UserRepository;
import com.example.moneytransfer.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // SecureRandom for generating random alphanumeric strings
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int USER_ID_LENGTH = 8;
    private static final int ACCOUNT_NUMBER_LENGTH = 10;
    private static final String IFSC_PREFIX = "IFSC";

    // Method to generate random alphanumeric string for ID
    private String generateRandomAlphanumeric(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return builder.toString();
    }

    // Register a new user
    public UserTransaction registerUser(String firstName, String lastName, String email, String password) {
        // Generate human-readable, fixed-length alphanumeric userId and account number
        String userId = generateRandomAlphanumeric(USER_ID_LENGTH);
        String accountNumber = "AC" + generateRandomAlphanumeric(ACCOUNT_NUMBER_LENGTH);
        String ifscCode = IFSC_PREFIX + generateRandomAlphanumeric(4); // Fixed length IFSC with prefix

        // Hash the password
        String hashedPassword = passwordEncoder.encode(password);

        // Save user credentials in usersN collection
        User user = new User(userId, hashedPassword);
        userRepository.save(user);

        // Save transaction details in transactions collection
        UserTransaction userTransaction = new UserTransaction(userId, accountNumber, ifscCode, firstName, lastName, email, 0.0);
        transactionRepository.save(userTransaction);

        return userTransaction;
    }

    // Authenticate user by checking userId and password
    public boolean authenticateUser(String userId, String password) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }
}

Explanation:

generateRandomAlphanumeric(int length): This function generates a random alphanumeric string of the given length. The characters are drawn from the string ALPHANUMERIC, which consists of uppercase letters and numbers.

Fixed-Length:

userId is a random 8-character alphanumeric string.

accountNumber is a random 10-character alphanumeric string prefixed with "AC".

ifscCode has a fixed prefix (IFSC) and is followed by a 4-character random alphanumeric string.




---

Example Output:

userId: A7ZB12PQ (8 characters, alphanumeric)

accountNumber: ACX7V92RT5 (10 characters with AC prefix)

ifscCode: IFSCA12B (IFSC prefix followed by 4 random characters)


With this approach, your IDs will be both human-readable and consistent in length.

How to Test:

During registration, the generated userId, accountNumber, and ifscCode will be included in the response to the user and saved in the database.

You can easily verify the generated values by checking the database or the response object from the API.


Would you like to proceed with this, or would you like to modify anything else?



Without senderdetails


You're right! We can streamline the transfer process by removing the need for the sender's account details since the sender is already authenticated in the system. This way, we can automatically determine the sender's details based on their login session or userId.

Steps:

Sender Information: The sender can be identified using the userId stored in the session after login. There’s no need to explicitly provide the sender’s account number and IFSC during the transfer.

Receiver Information: The receiver’s account number, IFSC code, and the amount to be transferred will be provided by the sender.


Here's how we can modify the approach:

1. The sender is identified by their authenticated userId.


2. The receiver's details (Account Number and IFSC) and the transfer amount are provided in the request.




---

Backend Code Changes:

1. TransferRequest.java (DTO for transfer)

This class will handle the incoming transfer request.

package com.example.moneytransfer.dto;

public class TransferRequest {

    private String receiverAccountNumber;
    private String receiverIfscCode;
    private double amount;

    // Getters and Setters
    public String getReceiverAccountNumber() {
        return receiverAccountNumber;
    }

    public void setReceiverAccountNumber(String receiverAccountNumber) {
        this.receiverAccountNumber = receiverAccountNumber;
    }

    public String getReceiverIfscCode() {
        return receiverIfscCode;
    }

    public void setReceiverIfscCode(String receiverIfscCode) {
        this.receiverIfscCode = receiverIfscCode;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}

2. MoneyTransferService.java

In the service layer, we now take the userId of the sender (which will come from the login session or token), and we take the receiver's account number, IFSC code, and the transfer amount from the request body.

package com.example.moneytransfer.service;

import com.example.moneytransfer.dto.TransferRequest;
import com.example.moneytransfer.model.UserTransaction;
import com.example.moneytransfer.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MoneyTransferService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Method to handle the money transfer
    public String transferMoney(String senderUserId, TransferRequest transferRequest) {
        // Fetch sender's transaction details
        UserTransaction senderTransaction = transactionRepository.findByUserId(senderUserId);
        if (senderTransaction == null) {
            return "Sender not found";
        }

        // Check if the sender has enough balance
        if (senderTransaction.getBalance() < transferRequest.getAmount()) {
            return "Insufficient balance";
        }

        // Fetch receiver's transaction details using account number and IFSC
        UserTransaction receiverTransaction = transactionRepository
                .findByAccountNumberAndIfscCode(
                        transferRequest.getReceiverAccountNumber(),
                        transferRequest.getReceiverIfscCode()
                );
        
        if (receiverTransaction == null) {
            return "Receiver not found";
        }

        // Transfer the amount
        senderTransaction.setBalance(senderTransaction.getBalance() - transferRequest.getAmount());
        receiverTransaction.setBalance(receiverTransaction.getBalance() + transferRequest.getAmount());

        // Save the updated transactions
        transactionRepository.save(senderTransaction);
        transactionRepository.save(receiverTransaction);

        return "Transfer successful";
    }
}

Explanation:

TransferRequest: Holds the necessary details of the receiver (account number, IFSC code) and the amount to be transferred.

Money Transfer Logic:

The sender's user ID (senderUserId) is passed in based on the currently logged-in user.

The receiver's account number and IFSC code are used to find the receiver’s details in the transaction collection.

The service checks if the sender has sufficient balance and, if yes, deducts the amount from the sender’s balance and adds it to the receiver's balance.


Response: Returns appropriate responses like "Transfer successful", "Sender not found", "Receiver not found", or "Insufficient balance".



---

3. MoneyTransferController.java

The controller will expose an API to handle the transfer request. It will take the authenticated user's userId and the transfer details (only the receiver’s details and amount) from the request body.

package com.example.moneytransfer.controller;

import com.example.moneytransfer.dto.TransferRequest;
import com.example.moneytransfer.service.MoneyTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfer")
public class MoneyTransferController {

    @Autowired
    private MoneyTransferService moneyTransferService;

    // Endpoint to transfer money
    @PostMapping("/money")
    public String transferMoney(
            @RequestParam("userId") String userId, // Assume this is passed based on login session/token
            @RequestBody TransferRequest transferRequest) {
        
        return moneyTransferService.transferMoney(userId, transferRequest);
    }
}

Example of Transfer Request Using Postman:

URL:

POST http://localhost:8080/api/transfer/money

Headers:

Content-Type: application/json


Body (JSON):

{
    "receiverAccountNumber": "AC12345678",
    "receiverIfscCode": "IFSC1234",
    "amount": 500.0
}

Sample Response:

{
    "message": "Transfer successful"
}

Notes:

No need to provide sender's account number or IFSC: The userId of the sender is retrieved automatically based on their authenticated session or token.

Input: Only the receiver’s account number, IFSC, and amount are needed to perform the transfer.

Error Handling: The service checks if the sender has sufficient balance and whether the receiver exists in the database before performing the transfer.



---

MongoDB Structure for Transactions:

The transactions collection will store all transaction-related data, including account numbers, IFSC codes, and balances.

{
    "_id": "A7ZB12PQ",
    "accountNumber": "AC12345678",
    "ifscCode": "IFSC1234",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "balance": 5000.0
}

Conclusion:

This approach simplifies the transfer process by eliminating the need to re-enter the sender’s account details. The system automatically uses the logged-in user’s details, and the user only needs to provide the receiver’s information and the amount to transfer.

Let me know if you need further clarification or additional features!

    



  
