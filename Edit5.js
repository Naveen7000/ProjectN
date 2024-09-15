Sure! Below is the complete Spring Boot code with all the features we discussed:

- **Transfer functionality** with MongoDB storage of transaction details.
- **Recent transactions** API based on user PIN.
- **Pagination** and **sorting** (ascending or descending based on transaction time).

### 1. Transaction Model

```java
package com.example.moneyflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "TransactionsN") // Specifies the collection name
public class Transaction {

    @Id
    private String id;
    private String transactionId;
    private String userPin;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private LocalDateTime transactionDateTime;
    private double balanceAfterTransfer;

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getUserPin() {
        return userPin;
    }

    public void setUserPin(String userPin) {
        this.userPin = userPin;
    }

    public String getSenderAccountNumber() {
        return senderAccountNumber;
    }

    public void setSenderAccountNumber(String senderAccountNumber) {
        this.senderAccountNumber = senderAccountNumber;
    }

    public String getReceiverAccountNumber() {
        return receiverAccountNumber;
    }

    public void setReceiverAccountNumber(String receiverAccountNumber) {
        this.receiverAccountNumber = receiverAccountNumber;
    }

    public LocalDateTime getTransactionDateTime() {
        return transactionDateTime;
    }

    public void setTransactionDateTime(LocalDateTime transactionDateTime) {
        this.transactionDateTime = transactionDateTime;
    }

    public double getBalanceAfterTransfer() {
        return balanceAfterTransfer;
    }

    public void setBalanceAfterTransfer(double balanceAfterTransfer) {
        this.balanceAfterTransfer = balanceAfterTransfer;
    }
}
```

### 2. Transaction Repository

```java
package com.example.moneyflow.repos;

import com.example.moneyflow.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    // Find transactions by user PIN with pagination and sorting support
    Page<Transaction> findByUserPin(String userPin, Pageable pageable);
}
```

### 3. Transfer Repository

```java
package com.example.moneyflow.repos;

import com.example.moneyflow.model.Transfer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TransferRepository extends MongoRepository<Transfer, String> {

    Optional<Transfer> findByPin(String pin);

    Optional<Transfer> findByAccountNumberAndIfscCode(String accountNumber, String ifscCode);
}
```

### 4. Transfer Service

```java
package com.example.moneyflow.services;

import com.example.moneyflow.model.Transfer;
import com.example.moneyflow.model.Transaction;
import com.example.moneyflow.repos.TransferRepository;
import com.example.moneyflow.repos.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransferService {

    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Transfer money
    public String transferMoney(String senderPin, String receiverAccountNumber, String receiverIFSC, double amount) {

        Optional<Transfer> senderOpt = transferRepository.findByPin(senderPin);
        Optional<Transfer> receiverOpt = transferRepository.findByAccountNumberAndIfscCode(receiverAccountNumber, receiverIFSC);

        // Check if both sender and receiver exist
        if (senderOpt.isPresent() && receiverOpt.isPresent()) {

            Transfer sender = senderOpt.get();
            Transfer receiver = receiverOpt.get();

            // Check if sender has enough balance
            if (sender.getBalance() >= amount) {

                // Perform the transfer
                sender.setBalance(sender.getBalance() - amount);
                receiver.setBalance(receiver.getBalance() + amount);

                // Save the updated balances
                transferRepository.save(sender);
                transferRepository.save(receiver);

                // Generate a unique transaction ID
                String transactionId = UUID.randomUUID().toString();

                // Save the transaction details in TransactionsN collection
                Transaction transaction = new Transaction();
                transaction.setTransactionId(transactionId);  // Store unique transaction ID
                transaction.setUserPin(senderPin);            // Store the sender's PIN
                transaction.setSenderAccountNumber(sender.getAccountNumber());  // Sender's account number
                transaction.setReceiverAccountNumber(receiverAccountNumber);    // Receiver's account number
                transaction.setTransactionDateTime(LocalDateTime.now());        // Transaction timestamp
                transaction.setBalanceAfterTransfer(sender.getBalance());        // Sender's balance after transfer

                // Save the transaction record in MongoDB
                transactionRepository.save(transaction);

                return "Transfer successful! Transaction ID: " + transactionId;
            } else {
                return "Insufficient balance!";
            }

        } else {
            return "Sender or receiver not found!";
        }
    }

    // Method to retrieve recent transactions with pagination and sorting
    public Page<Transaction> getRecentTransactions(String userPin, int page, int size, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by("transactionDateTime").ascending() : Sort.by("transactionDateTime").descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return transactionRepository.findByUserPin(userPin, pageable);
    }
}
```

### 5. Transaction Controller

```java
package com.example.moneyflow.controllers;

import com.example.moneyflow.model.Transaction;
import com.example.moneyflow.services.TransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionController {

    @Autowired
    private TransferService transferService;

    // API to fetch recent transactions based on user PIN with pagination and sorting
    @GetMapping("/transactions/recent")
    public Page<Transaction> getRecentTransactions(
            @RequestParam String userPin,       // The user's PIN
            @RequestParam(defaultValue = "0") int page,  // The page number (starts from 0)
            @RequestParam(defaultValue = "10") int size,  // The page size (default is 10 transactions per page)
            @RequestParam(defaultValue = "desc") String sortDir  // Sort direction (asc or desc) based on transaction date
    ) {
        return transferService.getRecentTransactions(userPin, page, size, sortDir);
    }
}
```

### 6. Transfer Model (Assuming you already have it, as it's not discussed earlier)

```java
package com.example.moneyflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Transfers") // Assuming you have a collection for transfers
public class Transfer {

    @Id
    private String id;
    private String accountNumber;
    private String ifscCode;
    private double balance;
    private String pin;

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}
```

### Configuration

Ensure you have the following MongoDB configuration in your `application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/yourDatabaseName
spring.data.mongodb.database=yourDatabaseName
```

### Example Request

**Request:**
```
GET /transactions/recent?userPin=1234&page=0&size=10&sortDir=desc
```

- This will fetch the first page (`page=0`, as pages are zero-indexed) with 10 transactions (`size=10`), sorted in descending order of `transactionDateTime` (`sortDir=desc`).

**Response:**
You will get a paginated response, as described earlier, with the transaction content and pagination metadata.

### Conclusion

This code provides a complete solution with:

1. **Money transfer functionality** and saving the transaction in a MongoDB collection.
2. **Recent transactions** retrieval based on user PIN with **pagination** and **sorting**.
3. Exposed through a REST API endpoint to fetch recent transactions, supporting ascending (`asc`) and descending (`desc`) sort order based on transaction date.

