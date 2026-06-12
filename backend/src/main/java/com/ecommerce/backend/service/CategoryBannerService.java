package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CategoryBannerDTO;
import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.CategoryBanner;
import com.ecommerce.backend.repository.CategoryBannerRepository;
import com.ecommerce.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryBannerService {

    @Autowired
    private CategoryBannerRepository categoryBannerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryBannerDTO> getAllBanners() {
        return categoryBannerRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryBannerDTO createBanner(CategoryBannerDTO dto) {
        if (categoryBannerRepository.existsByCategoryId(dto.getCategoryId())) {
            throw new RuntimeException("Banner for this category already exists!");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));

        CategoryBanner banner = new CategoryBanner();
        banner.setCategory(category);
        banner.setImageUrl(dto.getImageUrl());
        banner.setImageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : new java.util.ArrayList<>());
        banner.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);

        CategoryBanner saved = categoryBannerRepository.save(banner);
        return mapToDTO(saved);
    }

    public CategoryBannerDTO updateBanner(Long id, CategoryBannerDTO dto) {
        CategoryBanner banner = categoryBannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found with id: " + id));

        // Check if category changed and if banner for the new category already exists
        if (!banner.getCategory().getId().equals(dto.getCategoryId()) &&
                categoryBannerRepository.existsByCategoryId(dto.getCategoryId())) {
            throw new RuntimeException("Banner for this category already exists!");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));

        banner.setCategory(category);
        banner.setImageUrl(dto.getImageUrl());
        banner.setImageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : new java.util.ArrayList<>());
        banner.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);

        CategoryBanner saved = categoryBannerRepository.save(banner);
        return mapToDTO(saved);
    }

    public void deleteBanner(Long id) {
        if (!categoryBannerRepository.existsById(id)) {
            throw new RuntimeException("Banner not found!");
        }
        categoryBannerRepository.deleteById(id);
    }

    private CategoryBannerDTO mapToDTO(CategoryBanner banner) {
        return CategoryBannerDTO.builder()
                .id(banner.getId())
                .categoryId(banner.getCategory().getId())
                .categoryName(banner.getCategory().getName())
                .imageUrl(banner.getImageUrl())
                .imageUrls(banner.getImageUrls())
                .displayOrder(banner.getDisplayOrder())
                .build();
    }
}
