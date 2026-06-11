package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.ChildCategory;
import com.ecommerce.backend.service.ChildCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/child-categories")
@RequiredArgsConstructor
public class ChildCategoryController {
    private final ChildCategoryService childCategoryService;

    @GetMapping
    public List<ChildCategory> getAllChildCategories() {
        return childCategoryService.getAllChildCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChildCategory> getChildCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(childCategoryService.getChildCategoryById(id));
    }

    @GetMapping("/subcategory/{subcategoryId}")
    public List<ChildCategory> getChildCategoriesBySubcategory(@PathVariable Long subcategoryId) {
        return childCategoryService.getChildCategoriesBySubcategory(subcategoryId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChildCategory> createChildCategory(@RequestBody ChildCategory childCategory) {
        return ResponseEntity.ok(childCategoryService.createChildCategory(childCategory));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChildCategory> updateChildCategory(
            @PathVariable Long id, 
            @RequestBody ChildCategory childCategory) {
        return ResponseEntity.ok(childCategoryService.updateChildCategory(id, childCategory));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteChildCategory(@PathVariable Long id) {
        childCategoryService.deleteChildCategory(id);
        return ResponseEntity.ok().build();
    }
}
