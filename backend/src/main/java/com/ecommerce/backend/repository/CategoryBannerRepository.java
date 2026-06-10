package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.CategoryBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryBannerRepository extends JpaRepository<CategoryBanner, Long> {
    List<CategoryBanner> findAllByOrderByDisplayOrderAsc();
    boolean existsByCategoryId(Long categoryId);
}
