package com.danmil.ecommerce.service;

import com.danmil.ecommerce.dto.PaymentInfo;
import com.danmil.ecommerce.dto.Purchase;
import com.danmil.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse  placeOrder(Purchase purchase);

    // Stripe
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
