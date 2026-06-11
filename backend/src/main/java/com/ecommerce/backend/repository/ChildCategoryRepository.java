package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.ChildCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChildCategoryRepository extends JpaRepository<ChildCategory, Long> {
    List<ChildCategory> findBySubcategoryId(Long subcategoryId);
}
