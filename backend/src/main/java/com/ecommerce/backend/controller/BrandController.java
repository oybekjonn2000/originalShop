package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Brand;
import com.ecommerce.backend.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    @PostMapping
    public Brand createBrand(@Valid @RequestBody Brand brand) {
        return brandService.createBrand(brand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @Valid @RequestBody Brand brandDetails) {
        return ResponseEntity.ok(brandService.updateBrand(id, brandDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Brand muvaffaqiyatli o'chirildi!");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllBrands() {
        brandService.deleteAllBrands();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Barcha brandlar muvaffaqiyatli o'chirildi!");
        return ResponseEntity.ok(response);
    }
}
