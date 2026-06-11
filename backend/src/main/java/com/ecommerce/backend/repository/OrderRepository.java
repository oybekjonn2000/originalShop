package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.orderItems oi WHERE o.user.id = :userId AND oi.product.id = :productId AND o.status = com.ecommerce.backend.model.OrderStatus.DELIVERED")
    boolean existsDeliveredOrderByUserAndProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}
