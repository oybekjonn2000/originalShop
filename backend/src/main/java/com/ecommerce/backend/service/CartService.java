package com.ecommerce.backend.service;

import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCartByUser(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Mahsulot topilmadi ID: " + productId));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Omborda yetarli mahsulot yo'q. Mavjud: " + product.getStockQuantity());
        }

        // Check if item already in cart
        return cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .map(existingItem -> {
                    int newQty = existingItem.getQuantity() + quantity;
                    if (product.getStockQuantity() < newQty) {
                        throw new RuntimeException("Omborda yetarli mahsulot yo'q.");
                    }
                    existingItem.setQuantity(newQty);
                    return cartItemRepository.save(existingItem);
                })
                .orElseGet(() -> {
                    CartItem newItem = CartItem.builder()
                            .user(user)
                            .product(product)
                            .quantity(quantity)
                            .build();
                    return cartItemRepository.save(newItem);
                });
    }

    public CartItem updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Savat elementi topilmadi ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Ushbu savat sizga tegishli emas!");
        }

        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new RuntimeException("Omborda yetarli mahsulot yo'q.");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Savat elementi topilmadi ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new RuntimeException("Ushbu savat sizga tegishli emas!");
        }

        cartItemRepository.delete(cartItem);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
