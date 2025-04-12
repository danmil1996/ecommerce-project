package com.danmil.ecommerce.controller;

import com.danmil.ecommerce.dto.Purchase;
import com.danmil.ecommerce.dto.PurchaseResponse;
import com.danmil.ecommerce.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    @Autowired
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("purchase")
    public PurchaseResponse placeOrder (@RequestBody Purchase purchase) {
        return checkoutService.placeOrder(purchase);

    }
}
