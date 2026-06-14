package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Brand;
import com.ecommerce.backend.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand topilmadi ID: " + id));
    }

    public Brand createBrand(Brand brand) {
        Brand saved = brandRepository.save(brand);
        auditLogService.logAdminAction("Brand yaratildi: " + saved.getName() + " (ID: " + saved.getId() + ")");
        return saved;
    }

    public Brand updateBrand(Long id, Brand brandDetails) {
        Brand brand = getBrandById(id);
        brand.setName(brandDetails.getName());
        brand.setImageUrl(brandDetails.getImageUrl());
        Brand saved = brandRepository.save(brand);
        auditLogService.logAdminAction("Brand tahrirlandi: " + saved.getName() + " (ID: " + saved.getId() + ")");
        return saved;
    }

    public void deleteBrand(Long id) {
        Brand brand = getBrandById(id);
        brandRepository.delete(brand);
        auditLogService.logAdminAction("Brand o'chirildi: " + brand.getName() + " (ID: " + id + ")");
    }

    public void deleteAllBrands() {
        brandRepository.deleteAll();
        auditLogService.logAdminAction("Barcha brandlar o'chirildi");
    }
}
