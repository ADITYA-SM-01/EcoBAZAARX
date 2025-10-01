package com.example.demo.Model;

import com.example.demo.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findById(Long aLong);

    <S extends Product> S save(S entity);

    List<Product> findBySellerId(Long sellerId);

    // Fetch all products by category
    List<Product> findByCategoryIgnoreCase(String category);
}
