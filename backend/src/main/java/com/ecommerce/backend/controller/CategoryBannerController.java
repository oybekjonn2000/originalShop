package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CategoryBannerDTO;
import com.ecommerce.backend.service.CategoryBannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category-banners")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CategoryBannerController {

    @Autowired
    private CategoryBannerService categoryBannerService;

    @GetMapping
    public ResponseEntity<List<CategoryBannerDTO>> getAllBanners() {
        return ResponseEntity.ok(categoryBannerService.getAllBanners());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryBannerDTO> createBanner(@RequestBody CategoryBannerDTO dto) {
        return ResponseEntity.ok(categoryBannerService.createBanner(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        categoryBannerService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }
}
