package com.danmil.ecommerce.service;

import com.danmil.ecommerce.dao.CustomerRepository;
import com.danmil.ecommerce.dto.Purchase;
import com.danmil.ecommerce.dto.PurchaseResponse;
import com.danmil.ecommerce.entity.Order;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckOutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckOutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
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
        // populate customer with order
        purchase.getCustomer ().add (order);
    }

    private String generateTrackingNumber () {
        return UUID.randomUUID().toString();
    }
}
