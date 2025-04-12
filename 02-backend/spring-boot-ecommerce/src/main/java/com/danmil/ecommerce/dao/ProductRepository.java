package com.danmil.ecommerce.dao;

import com.danmil.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin ("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
    // SELECT * FROM product WHERE category_id = ?
    Page<Product> findByCategoryId (@Param ("id") Long id, Pageable pageable);
    // SELECT * FROM product WHERE name like contact ('%', :name, '%')
    Page<Product> findByNameContaining (@Param ("name") String name, Pageable pageable);
    
}
