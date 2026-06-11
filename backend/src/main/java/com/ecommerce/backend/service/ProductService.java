package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Brand;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.Subcategory;
import com.ecommerce.backend.repository.BrandRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findBySubcategoryCategoryId(categoryId);
    }

    public List<Product> getProductsBySubcategory(Long subcategoryId) {
        return productRepository.findBySubcategoryId(subcategoryId);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mahsulot topilmadi ID: " + id));
    }

    public Product createProduct(Product product) {
        if (product.getImageUrls() != null && product.getImageUrls().size() > 10) {
            throw new RuntimeException("Mahsulot rasmlari soni 10 tadan oshmasligi kerak!");
        }
        if (product.getSubcategory() != null && product.getSubcategory().getId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(product.getSubcategory().getId())
                    .orElseThrow(() -> new RuntimeException("Subkategoriya topilmadi ID: " + product.getSubcategory().getId()));
            product.setSubcategory(subcategory);
        }
        if (product.getBrand() != null && product.getBrand().getId() != null) {
            Brand brand = brandRepository.findById(product.getBrand().getId())
                    .orElseThrow(() -> new RuntimeException("Brand topilmadi ID: " + product.getBrand().getId()));
            product.setBrand(brand);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        if (productDetails.getImageUrls() != null && productDetails.getImageUrls().size() > 10) {
            throw new RuntimeException("Mahsulot rasmlari soni 10 tadan oshmasligi kerak!");
        }
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setImageUrls(productDetails.getImageUrls());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setIsActive(productDetails.getIsActive());
        product.setDiscount(productDetails.getDiscount());
        product.setFullDescription(productDetails.getFullDescription());

        if (productDetails.getSubcategory() != null && productDetails.getSubcategory().getId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(productDetails.getSubcategory().getId())
                    .orElseThrow(() -> new RuntimeException("Subkategoriya topilmadi ID: " + productDetails.getSubcategory().getId()));
            product.setSubcategory(subcategory);
        } else if (productDetails.getSubcategory() == null) {
            product.setSubcategory(null);
        }

        if (productDetails.getBrand() != null && productDetails.getBrand().getId() != null) {
            Brand brand = brandRepository.findById(productDetails.getBrand().getId())
                    .orElseThrow(() -> new RuntimeException("Brand topilmadi ID: " + productDetails.getBrand().getId()));
            product.setBrand(brand);
        } else if (productDetails.getBrand() == null) {
            product.setBrand(null);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public void deleteAllProducts() {
        productRepository.deleteAll();
    }
}
