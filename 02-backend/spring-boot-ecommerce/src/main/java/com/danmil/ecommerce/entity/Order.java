package com.danmil.ecommerce.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "order_tracking_number")
    private String orderTrackingNumber;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "total_quantity")
    private int totalQuantity;

    @OneToOne (cascade = CascadeType.ALL)
    @JoinColumn (name="shipping_address_id", referencedColumnName = "id")
    private Address shippingAddress;

    @OneToOne (cascade = CascadeType.ALL)
    @JoinColumn (name="billing_address_id", referencedColumnName = "id")
    private Address billingAddress;

    @ManyToOne
    @JoinColumn (name="customer_id")
    private Customer customer;

    @Column(name = "status")
    private String status;

    @Column (name="date_created")
    @UpdateTimestamp
    private Date dateCreated;

    @Column (name="last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

    @OneToMany (mappedBy="order", cascade = CascadeType.ALL)
    private Set<OrderItem> orderItems = new HashSet<> ();

    public void add(OrderItem item) {
        if (item == null) return;
        if (orderItems == null) orderItems = new HashSet<> ();
        if (!orderItems.contains(item)) {
            orderItems.add (item);
            item.setOrder (this);
        }
    }




}
