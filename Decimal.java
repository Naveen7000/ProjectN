To ensure that the random double generated in the generateRandomBalance method has only 2 decimal places, you can format the number using Math.round() or BigDecimal. Here's how you can update the method:

Updated Spring Boot Code for generateRandomBalance

package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;
import java.math.BigDecimal;

@Service
public class BalanceService {

    // Method to generate random balance between 1000 and 1,000,000,000 with 2 decimal places
    public Double generateRandomBalance() {
        // Generate a random double value between 1000 and 1,000,000,000
        double randomBalance = ThreadLocalRandom.current().nextDouble(1000, 1_000_000_000);
        
        // Use BigDecimal to limit to 2 decimal places and return it
        BigDecimal bd = new BigDecimal(randomBalance).setScale(2, BigDecimal.ROUND_HALF_UP);
        return bd.doubleValue();
    }
}

Explanation:

1. ThreadLocalRandom.current().nextDouble(1000, 1_000_000_000): This still generates the random double value between 1000 and 1,000,000,000.


2. BigDecimal: The BigDecimal class is used to round the value to 2 decimal places. The setScale(2, BigDecimal.ROUND_HALF_UP) ensures that the number has only 2 decimal places, and it rounds the value properly (half up rounding).


3. .doubleValue(): Finally, the BigDecimal is converted back to double after rounding.



This ensures that the returned balance will always have exactly two decimal places.

Usage Example

If you use this method in your Spring Boot application, it will now generate random balances like 2345.67, 7568.92, or 100000000.00, always ensuring two decimal points.

Let me know if you need any further modifications!

  
