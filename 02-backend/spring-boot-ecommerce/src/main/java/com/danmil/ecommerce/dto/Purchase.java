package com.danmil.ecommerce.dto;

import com.danmil.ecommerce.entity.*;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Order order;
    private Address shippingAddress;
    private Address billingAddress;
    private Set<OrderItem> orderItems;

}
