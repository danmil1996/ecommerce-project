package com.danmil.ecommerce.dto;

import lombok.Data;

@Data
public class PaymentInfo {
    int amount;
    String currency;
    String receiptEmail;
}
