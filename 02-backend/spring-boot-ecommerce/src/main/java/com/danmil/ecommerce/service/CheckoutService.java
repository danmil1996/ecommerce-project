package com.danmil.ecommerce.service;

import com.danmil.ecommerce.dto.Purchase;
import com.danmil.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse  placeOrder(Purchase purchase);
}
