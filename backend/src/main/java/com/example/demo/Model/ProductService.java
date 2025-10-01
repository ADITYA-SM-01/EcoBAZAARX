package com.example.demo.Model;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    /**
     * Get all products by category
     */
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    /**
     * Optional: Get all products (active only)
     */
    public List<Product> getAllActiveProducts() {
        return productRepository.findAll()
                .stream()
                .filter(Product::getIsActive)
                .toList();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = getProductById(id);
        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setBrand(updatedProduct.getBrand());
        existing.setSellerId(updatedProduct.getSellerId());
        existing.setCategory(updatedProduct.getCategory());
        existing.setStock(updatedProduct.getStock());
        existing.setCarbonFootprint(updatedProduct.getCarbonFootprint());
        existing.setSustainablePackaging(updatedProduct.getSustainablePackaging());
        existing.setRating(updatedProduct.getRating());
        existing.setImageUrl(updatedProduct.getImageUrl());
        existing.setIsActive(updatedProduct.getIsActive());
        existing.setUnitsSold(updatedProduct.getUnitsSold());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
