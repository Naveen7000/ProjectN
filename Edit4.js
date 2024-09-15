To implement this, you will need to create a new MongoDB collection named TransactionsN to store transaction records after the money transfer. In Spring Boot, you can use Spring Data MongoDB to interact with MongoDB.

Here’s how you can modify your code:

Steps:
Create a Transaction model class that will represent each transaction in MongoDB.
Create a TransactionRepository interface to manage the MongoDB collection.
Modify the transferMoney method to save the transaction details after the money transfer.

package com.example.moneyflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "TransactionsN") // Specifies the collection name
public class Transaction {

    @Id
    private String transactionId;
    private String userPin;
    private String senderAccountNumber;
    private LocalDateTime transactionDateTime;
    private double balanceAfterTransfer;

    // Getters and setters

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

2.Transaction Repository
Create a repository to handle CRUD operations for the TransactionsN collection.

package com.example.moneyflow.repos;

import com.example.moneyflow.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    // Custom query methods can be added if needed
}


3.Modify the TransferService
Now, modify the transferMoney method to save the transaction data in the TransactionsN collection after the transfer is successful.

package com.example.moneyflow.services;

import com.example.moneyflow.model.Transfer;
import com.example.moneyflow.model.Transaction;
import com.example.moneyflow.repos.TransferRepository;
import com.example.moneyflow.repos.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

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

                // Save the transaction details in TransactionsN collection
                Transaction transaction = new Transaction();
                transaction.setUserPin(senderPin);
                transaction.setSenderAccountNumber(sender.getAccountNumber());
                transaction.setTransactionDateTime(LocalDateTime.now());
                transaction.setBalanceAfterTransfer(sender.getBalance());

                transactionRepository.save(transaction);

                return "Transfer successful!";
            } else {
                return "Insufficient balance!";
            }

        } else {
            return "Sender or receiver not found!";
        }
    }
}
