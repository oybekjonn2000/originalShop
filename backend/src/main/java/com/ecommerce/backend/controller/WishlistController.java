package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.WishlistItem;
import com.ecommerce.backend.security.UserDetailsImpl;
import com.ecommerce.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(wishlistService.getWishlistByUser(userDetails.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistItem> addToWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(userDetails.getUser(), productId));
    }

    @DeleteMapping("/remove/{wishlistItemId}")
    public ResponseEntity<?> removeFromWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long wishlistItemId) {
        wishlistService.removeFromWishlist(userDetails.getId(), wishlistItemId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Mahsulot sevimlilardan o'chirildi!");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove/product/{productId}")
    public ResponseEntity<?> removeFromWishlistByProduct(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlistByProductId(userDetails.getId(), productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Mahsulot sevimlilardan o'chirildi!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(userDetails.getId(), productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("inWishlist", inWishlist);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearWishlist(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        wishlistService.clearWishlist(userDetails.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Sevimlilar ro'yxati tozalandi!");
        return ResponseEntity.ok(response);
    }
}
