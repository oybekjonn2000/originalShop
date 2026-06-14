package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Subcategory;
import com.ecommerce.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.repository.CategoryRepository;

@Service
@RequiredArgsConstructor
public class SubcategoryService {
    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    public List<Subcategory> getAllSubcategories() {
        return subcategoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Subcategory getSubcategoryById(Long id) {
        return subcategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcategory topilmadi"));
    }

    public List<Subcategory> getSubcategoriesByCategory(Long categoryId) {
        return subcategoryRepository.findByCategoryId(categoryId);
    }

    public Subcategory createSubcategory(Subcategory subcategory) {
        if (subcategory.getCategory() != null && subcategory.getCategory().getId() != null) {
            Category category = categoryRepository.findById(subcategory.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Kategoriya topilmadi ID: " + subcategory.getCategory().getId()));
            subcategory.setCategory(category);
        }
        Subcategory saved = subcategoryRepository.save(subcategory);
        auditLogService.logAdminAction("Subkategoriya yaratildi: " + saved.getName() + " (ID: " + saved.getId() + ")");
        return saved;
    }

    public Subcategory updateSubcategory(Long id, Subcategory updated) {
        Subcategory existing = getSubcategoryById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        if (updated.getCategory() != null && updated.getCategory().getId() != null) {
            Category category = categoryRepository.findById(updated.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Kategoriya topilmadi ID: " + updated.getCategory().getId()));
            existing.setCategory(category);
        } else if (updated.getCategory() == null) {
            existing.setCategory(null);
        }
        Subcategory saved = subcategoryRepository.save(existing);
        auditLogService.logAdminAction("Subkategoriya tahrirlandi: " + saved.getName() + " (ID: " + saved.getId() + ")");
        return saved;
    }

    public void deleteSubcategory(Long id) {
        Subcategory subcategory = getSubcategoryById(id);
        subcategoryRepository.deleteById(id);
        auditLogService.logAdminAction("Subkategoriya o'chirildi: " + subcategory.getName() + " (ID: " + id + ")");
    }

    public void deleteAllSubcategories() {
        subcategoryRepository.deleteAll();
        auditLogService.logAdminAction("Barcha subkategoriyalar o'chirildi");
    }
}
