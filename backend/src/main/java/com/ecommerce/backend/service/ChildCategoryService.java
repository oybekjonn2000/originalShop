package com.ecommerce.backend.service;

import com.ecommerce.backend.model.ChildCategory;
import com.ecommerce.backend.model.Subcategory;
import com.ecommerce.backend.repository.ChildCategoryRepository;
import com.ecommerce.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChildCategoryService {
    private final ChildCategoryRepository childCategoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public List<ChildCategory> getAllChildCategories() {
        return childCategoryRepository.findAll();
    }

    public ChildCategory getChildCategoryById(Long id) {
        return childCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child category topilmadi ID: " + id));
    }

    public List<ChildCategory> getChildCategoriesBySubcategory(Long subcategoryId) {
        return childCategoryRepository.findBySubcategoryId(subcategoryId);
    }

    public ChildCategory createChildCategory(ChildCategory childCategory) {
        if (childCategory.getSubcategory() != null && childCategory.getSubcategory().getId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(childCategory.getSubcategory().getId())
                    .orElseThrow(() -> new RuntimeException("Subkategoriya topilmadi ID: " + childCategory.getSubcategory().getId()));
            childCategory.setSubcategory(subcategory);
        }
        return childCategoryRepository.save(childCategory);
    }

    public ChildCategory updateChildCategory(Long id, ChildCategory details) {
        ChildCategory childCategory = getChildCategoryById(id);
        childCategory.setName(details.getName());
        childCategory.setDescription(details.getDescription());
        if (details.getSubcategory() != null && details.getSubcategory().getId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(details.getSubcategory().getId())
                    .orElseThrow(() -> new RuntimeException("Subkategoriya topilmadi ID: " + details.getSubcategory().getId()));
            childCategory.setSubcategory(subcategory);
        }
        return childCategoryRepository.save(childCategory);
    }

    public void deleteChildCategory(Long id) {
        childCategoryRepository.deleteById(id);
    }

    public void deleteAllChildCategories() {
        childCategoryRepository.deleteAll();
    }
}
