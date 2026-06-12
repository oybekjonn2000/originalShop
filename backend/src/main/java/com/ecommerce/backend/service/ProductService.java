package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Brand;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.Subcategory;
import com.ecommerce.backend.model.ChildCategory;
import com.ecommerce.backend.repository.BrandRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.SubcategoryRepository;
import com.ecommerce.backend.repository.ChildCategoryRepository;
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
    private ChildCategoryRepository childCategoryRepository;

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
        return productRepository.findByChildCategorySubcategoryCategoryId(categoryId);
    }

    public List<Product> getProductsBySubcategory(Long subcategoryId) {
        return productRepository.findByChildCategorySubcategoryId(subcategoryId);
    }

    public List<Product> getProductsByChildCategory(Long childCategoryId) {
        return productRepository.findByChildCategoryId(childCategoryId);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mahsulot topilmadi ID: " + id));
    }

    public Product createProduct(Product product) {
        if (product.getImageUrls() != null && product.getImageUrls().size() > 10) {
            throw new RuntimeException("Mahsulot rasmlari soni 10 tadan oshmasligi kerak!");
        }
        if (product.getChildCategory() != null && product.getChildCategory().getId() != null) {
            ChildCategory childCategory = childCategoryRepository.findById(product.getChildCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Child kategoriya topilmadi ID: " + product.getChildCategory().getId()));
            product.setChildCategory(childCategory);
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
        product.setCharacteristics(productDetails.getCharacteristics());

        if (productDetails.getChildCategory() != null && productDetails.getChildCategory().getId() != null) {
            ChildCategory childCategory = childCategoryRepository.findById(productDetails.getChildCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Child kategoriya topilmadi ID: " + productDetails.getChildCategory().getId()));
            product.setChildCategory(childCategory);
        } else if (productDetails.getChildCategory() == null) {
            product.setChildCategory(null);
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
