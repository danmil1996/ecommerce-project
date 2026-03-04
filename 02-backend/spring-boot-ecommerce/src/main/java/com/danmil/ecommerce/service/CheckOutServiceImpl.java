package com.danmil.ecommerce.service;

import com.danmil.ecommerce.dao.CustomerRepository;
import com.danmil.ecommerce.dto.PaymentInfo;
import com.danmil.ecommerce.dto.Purchase;
import com.danmil.ecommerce.dto.PurchaseResponse;
import com.danmil.ecommerce.entity.Customer;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckOutServiceImpl implements CheckoutService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CheckOutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String stripeKey) {
        this.customerRepository = customerRepository;
        // Initialize Stripe API KEY
        Stripe.apiKey = stripeKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder (Purchase purchase) {
        // Set order data from Purchase object
        setOrderDataFromPurchase (purchase);
        // save to the database
        customerRepository.save (purchase.getOrder().getCustomer());
        // return the response
        return new PurchaseResponse (purchase.getOrder().getOrderTrackingNumber ());
    }

    @Override
    public PaymentIntent createPaymentIntent (PaymentInfo paymentInfo) throws StripeException {
        Map<String, Object> params = createPaymentIntentParams (paymentInfo);
        return PaymentIntent.create (params);
    }

    private static Map<String, Object> createPaymentIntentParams (PaymentInfo paymentInfo) {
        Map<String, Object> params = new HashMap<> ();
        params.put("amount", paymentInfo.getAmount ());
        params.put("currency", paymentInfo.getCurrency ());
        params.put("payment_method_types", List.of("card"));
        params.put ("description", "dmEShop purchase");
        params.put ("receipt_email", paymentInfo.getReceiptEmail ());
        return params;
    }

    private void setOrderDataFromPurchase (Purchase purchase) {
        // retrieve the order info from dto
        var order = purchase.getOrder();
        // generate tracking number
        order.setOrderTrackingNumber (generateTrackingNumber ());
        // populate order with orderItems
        purchase.getOrderItems ().forEach (order::add);
        // populate order with billing and shipping address
        order.setBillingAddress  (purchase.getBillingAddress ());
        order.setShippingAddress (purchase.getShippingAddress ());
        // Customer
        var customer = order.getCustomer();
        // Check if is an existing customer
        Customer dbCustomer = customerRepository.findByEmail (customer.getEmail ());
        if (dbCustomer != null) customer = dbCustomer;
        // populate customer with order
        customer.add (order);
    }

    private String generateTrackingNumber () {
        return UUID.randomUUID().toString();
    }
}
