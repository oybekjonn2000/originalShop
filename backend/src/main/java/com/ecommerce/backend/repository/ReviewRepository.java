package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT r.product.id FROM Review r WHERE r.user.id = :userId")
    List<Long> findProductIdsByUserId(@Param("userId") Long userId);
}

