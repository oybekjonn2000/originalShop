package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.Review;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Review addReview(User user, Long productId, String comment, Integer rating) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Mahsulot topilmadi!"));

        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Baholash 1 dan 5 gacha bo'lishi kerak!");
        }

        // Check if user has purchased the product and order status is DELIVERED
        boolean hasPurchased = orderRepository.existsDeliveredOrderByUserAndProduct(user.getId(), productId);
        if (!hasPurchased) {
            throw new RuntimeException("Siz ushbu mahsulotni sotib olmagansiz yoki buyurtmangiz hali yetkazib berilmagan!");
        }

        // Check if user already reviewed this product
        boolean alreadyReviewed = reviewRepository.existsByUserIdAndProductId(user.getId(), productId);
        if (alreadyReviewed) {
            throw new RuntimeException("Siz ushbu mahsulotga allaqachon sharh qoldirgansiz!");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .comment(comment)
                .rating(rating)
                .build();

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public boolean canUserReviewProduct(Long userId, Long productId) {
        if (userId == null || productId == null) {
            return false;
        }
        return orderRepository.existsDeliveredOrderByUserAndProduct(userId, productId)
                && !reviewRepository.existsByUserIdAndProductId(userId, productId);
    }

    public List<Long> getReviewedProductIds(Long userId) {
        if (userId == null) {
            return List.of();
        }
        return reviewRepository.findProductIdsByUserId(userId);
    }
}

