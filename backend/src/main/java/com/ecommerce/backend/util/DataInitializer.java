package com.ecommerce.backend.util;

import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private ChildCategoryRepository childCategoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("Dastlabki ma'lumotlarni tekshirish va yaratish boshlandi...");

        // Load seed-data.json from classpath
        try (InputStream is = getClass().getResourceAsStream("/seed-data.json")) {
            if (is == null) {
                log.warn("seed-data.json fayli topilmadi! Ma'lumotlar yuklanmadi.");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);

            // 1. Initialize Users
            JsonNode usersNode = root.get("users");
            if (usersNode != null && usersNode.isArray() && userRepository.count() == 0) {
                log.info("Foydalanuvchilarni bazaga yozish...");
                for (JsonNode u : usersNode) {
                    jdbcTemplate.update(
                        "INSERT INTO users (id, username, email, password, first_name, last_name, role, address, phone_number, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        u.get("id").asLong(),
                        u.get("username").asText(),
                        u.get("email").asText(),
                        u.get("password").asText(),
                        u.has("first_name") && !u.get("first_name").isNull() ? u.get("first_name").asText() : null,
                        u.has("last_name") && !u.get("last_name").isNull() ? u.get("last_name").asText() : null,
                        u.has("role") && !u.get("role").isNull() ? u.get("role").asText() : null,
                        u.has("address") && !u.get("address").isNull() ? u.get("address").asText() : null,
                        u.has("phone_number") && !u.get("phone_number").isNull() ? u.get("phone_number").asText() : null,
                        u.has("profile_picture") && !u.get("profile_picture").isNull() ? u.get("profile_picture").asText() : null
                    );
                }
            }

            // 2. Initialize Brands
            JsonNode brandsNode = root.get("brands");
            if (brandsNode != null && brandsNode.isArray() && brandRepository.count() == 0) {
                log.info("Brandlarni bazaga yozish...");
                for (JsonNode b : brandsNode) {
                    jdbcTemplate.update(
                        "INSERT INTO brands (id, name, image_url) VALUES (?, ?, ?)",
                        b.get("id").asLong(),
                        b.get("name").asText(),
                        b.has("image_url") && !b.get("image_url").isNull() ? b.get("image_url").asText() : null
                    );
                }
            }

            // 3. Initialize Categories
            JsonNode categoriesNode = root.get("categories");
            if (categoriesNode != null && categoriesNode.isArray() && categoryRepository.count() == 0) {
                log.info("Kategoriyalarni bazaga yozish...");
                for (JsonNode c : categoriesNode) {
                    jdbcTemplate.update(
                        "INSERT INTO categories (id, name, description, image_url) VALUES (?, ?, ?, ?)",
                        c.get("id").asLong(),
                        c.get("name").asText(),
                        c.has("description") && !c.get("description").isNull() ? c.get("description").asText() : null,
                        c.has("image_url") && !c.get("image_url").isNull() ? c.get("image_url").asText() : null
                    );
                }
            }

            // 4. Initialize Category Attributes Templates
            JsonNode templatesNode = root.get("category_attributes_templates");
            if (templatesNode != null && templatesNode.isArray()) {
                Integer templateCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM category_attributes_templates", Integer.class);
                if (templateCount != null && templateCount == 0) {
                    log.info("Kategoriya xususiyatlar shablonlarini yozish...");
                    for (JsonNode t : templatesNode) {
                        jdbcTemplate.update(
                            "INSERT INTO category_attributes_templates (category_id, attribute_name) VALUES (?, ?)",
                            t.get("category_id").asLong(),
                            t.get("attribute_name").asText()
                        );
                    }
                }
            }

            // 5. Initialize Subcategories
            JsonNode subcategoriesNode = root.get("subcategories");
            if (subcategoriesNode != null && subcategoriesNode.isArray() && subcategoryRepository.count() == 0) {
                log.info("Subkategoriyalarni bazaga yozish...");
                for (JsonNode s : subcategoriesNode) {
                    jdbcTemplate.update(
                        "INSERT INTO subcategories (id, name, description, image_url, category_id) VALUES (?, ?, ?, ?, ?)",
                        s.get("id").asLong(),
                        s.get("name").asText(),
                        s.has("description") && !s.get("description").isNull() ? s.get("description").asText() : null,
                        s.has("image_url") && !s.get("image_url").isNull() ? s.get("image_url").asText() : null,
                        s.has("category_id") && !s.get("category_id").isNull() ? s.get("category_id").asLong() : null
                    );
                }
            }

            // 6. Initialize Child Categories
            JsonNode childCategoriesNode = root.get("child_categories");
            if (childCategoriesNode != null && childCategoriesNode.isArray() && childCategoryRepository.count() == 0) {
                log.info("Child kategoriyalarni bazaga yozish...");
                for (JsonNode cc : childCategoriesNode) {
                    jdbcTemplate.update(
                        "INSERT INTO child_categories (id, name, description, subcategory_id) VALUES (?, ?, ?, ?)",
                        cc.get("id").asLong(),
                        cc.get("name").asText(),
                        cc.has("description") && !cc.get("description").isNull() ? cc.get("description").asText() : null,
                        cc.has("subcategory_id") && !cc.get("subcategory_id").isNull() ? cc.get("subcategory_id").asLong() : null
                    );
                }
            }

            // 7. Initialize Products
            JsonNode productsNode = root.get("products");
            if (productsNode != null && productsNode.isArray() && productRepository.count() == 0) {
                log.info("Mahsulotlarni bazaga yozish...");
                for (JsonNode p : productsNode) {
                    String characteristicsJson = null;
                    if (p.has("characteristics") && !p.get("characteristics").isNull()) {
                        characteristicsJson = mapper.writeValueAsString(p.get("characteristics"));
                    }

                    jdbcTemplate.update(
                        "INSERT INTO products (id, name, description, price, image_url, stock_quantity, child_category_id, brand_id, full_description, is_active, discount, characteristics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb)",
                        p.get("id").asLong(),
                        p.get("name").asText(),
                        p.has("description") && !p.get("description").isNull() ? p.get("description").asText() : null,
                        p.get("price").asDouble(),
                        p.has("image_url") && !p.get("image_url").isNull() ? p.get("image_url").asText() : null,
                        p.get("stock_quantity").asInt(),
                        p.has("child_category_id") && !p.get("child_category_id").isNull() ? p.get("child_category_id").asLong() : null,
                        p.has("brand_id") && !p.get("brand_id").isNull() ? p.get("brand_id").asLong() : null,
                        p.has("full_description") && !p.get("full_description").isNull() ? p.get("full_description").asText() : null,
                        p.has("is_active") && !p.get("is_active").isNull() ? p.get("is_active").asBoolean() : true,
                        p.has("discount") && !p.get("discount").isNull() ? p.get("discount").asDouble() : 0.0,
                        characteristicsJson
                    );
                }
            }

            // 8. Initialize Product Images
            JsonNode productImagesNode = root.get("product_images");
            if (productImagesNode != null && productImagesNode.isArray()) {
                Integer imagesCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM product_images", Integer.class);
                if (imagesCount != null && imagesCount == 0) {
                    log.info("Mahsulot qo'shimcha rasmlarini yozish...");
                    for (JsonNode img : productImagesNode) {
                        jdbcTemplate.update(
                            "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                            img.get("product_id").asLong(),
                            img.get("image_url").asText()
                        );
                    }
                }
            }

        } catch (Exception e) {
            log.error("Dastlabki ma'lumotlarni yozishda xatolik yuz berdi: ", e);
        }

        // Synchronize PostgreSQL sequences to prevent duplicate key violations
        try {
            log.info("PostgreSQL ketma-ketliklarini (sequences) sinxronizatsiya qilish boshlandi...");
            jdbcTemplate.execute("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))");
            jdbcTemplate.execute("SELECT setval('brands_id_seq', COALESCE((SELECT MAX(id) FROM brands), 1))");
            jdbcTemplate.execute("SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1))");
            jdbcTemplate.execute("SELECT setval('subcategories_id_seq', COALESCE((SELECT MAX(id) FROM subcategories), 1))");
            jdbcTemplate.execute("SELECT setval('child_categories_id_seq', COALESCE((SELECT MAX(id) FROM child_categories), 1))");
            jdbcTemplate.execute("SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1))");
            log.info("Barcha ketma-ketliklar sinxronlashtirildi.");
        } catch (Exception e) {
            log.warn("Ketma-ketliklarni sinxronlashtirishda xatolik (Bu xatolikka e'tibor bermasa ham bo'ladi): {}", e.getMessage());
        }

        log.info("Dastlabki ma'lumotlar to'liq tekshirildi.");
    }
}
