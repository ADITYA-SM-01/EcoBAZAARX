package com.example.demo.Controller;

import com.example.demo.Model.Product;
import com.example.demo.Model.ProductService;
import com.example.demo.Model.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final ProductService productService;
    public ProductController(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @PostMapping
    public Long addProduct(@RequestBody Product product) {
        product = productService.addProduct(product);
        return product.getId();
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
    @GetMapping("/seller/{id}")
    public List<Product> getAllProductOfSeller(@PathVariable Long id) {
        return productService.getProductsBySeller(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {
            // Ensure uploads directory exists
            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // Generate unique filename
            String fileName = id +"."+ Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf(".") + 1);
            Path filePath = Paths.get(uploadDir, fileName);

            // Save file
            Files.write(filePath, file.getBytes());

            // Build accessible URL
            String imageUrl = "http://localhost:8090/" + fileName;

            // Update product record
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            product.setImageUrl(imageUrl);
            productRepository.save(product);

            return ResponseEntity.ok("Image uploaded successfully: " + imageUrl);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading image: " + e.getMessage());
        }
    }

}
