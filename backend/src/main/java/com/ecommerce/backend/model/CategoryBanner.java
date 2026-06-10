package com.ecommerce.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "category_banners")
public class CategoryBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String imageUrl;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "category_banner_images", joinColumns = @JoinColumn(name = "banner_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;
}
