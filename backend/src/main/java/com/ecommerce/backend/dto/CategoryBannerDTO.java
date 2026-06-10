package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryBannerDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private List<String> imageUrls;
    private Integer displayOrder;
}
