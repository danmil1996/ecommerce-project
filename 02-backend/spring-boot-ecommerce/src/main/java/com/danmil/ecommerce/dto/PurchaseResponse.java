package com.danmil.ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse {
    // lombok will generate for final fields the constructor or use @NotNull
    final private String orderTrackingNumber;
}
