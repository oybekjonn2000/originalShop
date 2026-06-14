package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategoriya topilmadi ID: " + id));
    }

    public Category createCategory(Category category) {
        Category saved = categoryRepository.save(category);
        auditLogService.logAdminAction("Kategoriya yaratildi: " + saved.getName() + " (ID: " + saved.getId() + ")");
        return saved;
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImageUrl(categoryDetails.getImageUrl());
        category.setAttributesTemplate(categoryDetails.getAttributesTemplate());
        Category saved = categoryRepository.save(category);
        auditLogService.logAdminAction("Kategoriya tahrirlandi: " + saved.getName() + " (ID: " + saved.getId() + ")");
        return saved;
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
        auditLogService.logAdminAction("Kategoriya o'chirildi: " + category.getName() + " (ID: " + id + ")");
    }

    public void deleteAllCategories() {
        categoryRepository.deleteAll();
        auditLogService.logAdminAction("Barcha kategoriyalar o'chirildi");
    }
}
