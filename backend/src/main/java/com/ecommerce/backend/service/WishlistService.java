package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.model.WishlistItem;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<WishlistItem> getWishlistByUser(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public WishlistItem addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Mahsulot topilmadi ID: " + productId));

        // If already in wishlist, return existing
        return wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseGet(() -> {
                    WishlistItem newItem = new WishlistItem();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    return wishlistRepository.save(newItem);
                });
    }

    public void removeFromWishlist(Long userId, Long wishlistItemId) {
        WishlistItem item = wishlistRepository.findById(wishlistItemId)
                .orElseThrow(() -> new RuntimeException("Sevimlilar elementi topilmadi ID: " + wishlistItemId));

        if (!item.getUser().getId().equals(userId)) {
            throw new RuntimeException("Ushbu element sizga tegishli emas!");
        }

        wishlistRepository.delete(item);
    }

    public void removeFromWishlistByProductId(Long userId, Long productId) {
        wishlistRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(wishlistRepository::delete);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    public void clearWishlist(Long userId) {
        wishlistRepository.deleteByUserId(userId);
    }
}
