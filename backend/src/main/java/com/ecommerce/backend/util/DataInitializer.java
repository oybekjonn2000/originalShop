package com.ecommerce.backend.util;

import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.SubcategoryRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

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
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        log.info("Dastlabki ma'lumotlarni tekshirish va yaratish boshlandi...");

        // 1. Initialize Users
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@ecommerce.uz")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("Administrator")
                    .address("Toshkent shahar, Chilonzor tumani")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default Admin yaratildi: admin / admin123");
        }

        if (!userRepository.existsByUsername("user")) {
            User customer = User.builder()
                    .username("user")
                    .email("user@ecommerce.uz")
                    .password(passwordEncoder.encode("user123"))
                    .firstName("Eldor")
                    .lastName("Karimov")
                    .address("Toshkent shahar, Yunusobod tumani")
                    .role(Role.ROLE_USER)
                    .build();
            userRepository.save(customer);
            log.info("Default Customer yaratildi: user / user123");
        }

        // 2. Initialize Categories
        if (categoryRepository.count() == 0) {
            Category smartfonlar = Category.builder()
                    .name("Smartfonlar")
                    .description("Eng so'nggi rusumdagi telefonlar va smartfonlar")
                    .build();

            Category noutbuklar = Category.builder()
                    .name("Noutbuklar")
                    .description("O'qish, ish va o'yinlar uchun kuchli noutbuklar")
                    .build();

            Category aksessuarlar = Category.builder()
                    .name("Aksessuarlar")
                    .description("Quloqchinlar, sichqonchalar va boshqa qo'shimcha qurilmalar")
                    .build();

            categoryRepository.saveAll(Arrays.asList(smartfonlar, noutbuklar, aksessuarlar));
            log.info("Kategoriyalar yaratildi.");
        }

        // 3. Data Migration: Har bir kategoriya uchun subkategoriyalar yaratish
        //    Bu blok faqat subcategory jadval bo'sh bo'lganda ishlaydi.
        if (subcategoryRepository.count() == 0) {
            List<Category> categories = categoryRepository.findAll();

            Category smartfonlar = categories.stream()
                    .filter(c -> c.getName().equals("Smartfonlar")).findFirst().orElse(null);
            Category noutbuklar = categories.stream()
                    .filter(c -> c.getName().equals("Noutbuklar")).findFirst().orElse(null);
            Category aksessuarlar = categories.stream()
                    .filter(c -> c.getName().equals("Aksessuarlar")).findFirst().orElse(null);

            if (smartfonlar != null) {
                subcategoryRepository.saveAll(Arrays.asList(
                    Subcategory.builder().name("Apple iPhone").description("Apple iPhone seriyasi").category(smartfonlar).build(),
                    Subcategory.builder().name("Samsung Galaxy").description("Samsung Galaxy seriyasi").category(smartfonlar).build(),
                    Subcategory.builder().name("Xiaomi").description("Xiaomi smartfonlar").category(smartfonlar).build()
                ));
            }
            if (noutbuklar != null) {
                subcategoryRepository.saveAll(Arrays.asList(
                    Subcategory.builder().name("MacBook").description("Apple MacBook seriyasi").category(noutbuklar).build(),
                    Subcategory.builder().name("Gaming Noutbuklar").description("O'yin uchun noutbuklar").category(noutbuklar).build(),
                    Subcategory.builder().name("Biznes Noutbuklar").description("Ish uchun noutbuklar").category(noutbuklar).build()
                ));
            }
            if (aksessuarlar != null) {
                subcategoryRepository.saveAll(Arrays.asList(
                    Subcategory.builder().name("Quloqchinlar").description("Simsiz va simli quloqchinlar").category(aksessuarlar).build(),
                    Subcategory.builder().name("Sichqoncha va Klaviatura").description("Kompyuter periferiyalari").category(aksessuarlar).build(),
                    Subcategory.builder().name("Zaryadlovchilar").description("Zaryadlovchi qurilmalar").category(aksessuarlar).build()
                ));
            }
            log.info("Subkategoriyalar muvaffaqiyatli yaratildi.");
        }

        // 4. Initialize Products (faqat bo'sh bo'lganda)
        if (productRepository.count() == 0) {
            // Subkategoriyalarni olish
            Subcategory iphoneSub = subcategoryRepository.findAll().stream()
                    .filter(s -> s.getName().equals("Apple iPhone")).findFirst().orElse(null);
            Subcategory samsungSub = subcategoryRepository.findAll().stream()
                    .filter(s -> s.getName().equals("Samsung Galaxy")).findFirst().orElse(null);
            Subcategory macbookSub = subcategoryRepository.findAll().stream()
                    .filter(s -> s.getName().equals("MacBook")).findFirst().orElse(null);
            Subcategory gamingSub = subcategoryRepository.findAll().stream()
                    .filter(s -> s.getName().equals("Gaming Noutbuklar")).findFirst().orElse(null);
            Subcategory quloqchinSub = subcategoryRepository.findAll().stream()
                    .filter(s -> s.getName().equals("Quloqchinlar")).findFirst().orElse(null);
            Subcategory sichqonchaSub = subcategoryRepository.findAll().stream()
                    .filter(s -> s.getName().equals("Sichqoncha va Klaviatura")).findFirst().orElse(null);

            if (iphoneSub != null) {
                productRepository.save(Product.builder()
                        .name("iPhone 15 Pro Max")
                        .description("Titan korpus, A17 Pro super chip, 5x optik yaqinlashtiruvchi kamera va o'ta tiniq displey. 256GB xotira bilan jihozlangan premium smartfon.")
                        .price(1399.99)
                        .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(15)
                        .subcategory(iphoneSub)
                        .isActive(true)
                        .build());
            }

            if (samsungSub != null) {
                productRepository.save(Product.builder()
                        .name("Samsung Galaxy S24 Ultra")
                        .description("Galaxy AI intellektual yordamchisi, 200MP ultra-kamera, o'rnatilgan S-Pen stilus va titanium korpusga ega eng so'nggi flagman.")
                        .price(1249.99)
                        .imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(12)
                        .subcategory(samsungSub)
                        .isActive(true)
                        .build());
            }

            if (macbookSub != null) {
                productRepository.save(Product.builder()
                        .name("MacBook Pro 16 M3 Max")
                        .description("Apple M3 Max super chipi, 36GB birlashgan xotira, 1TB tezkor SSD. Grafika ustasi va dasturchilar uchun eng mukammal ish quroli.")
                        .price(3499.99)
                        .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(8)
                        .subcategory(macbookSub)
                        .isActive(true)
                        .build());
            }

            if (gamingSub != null) {
                productRepository.save(Product.builder()
                        .name("ASUS ROG Zephyrus G14")
                        .description("AMD Ryzen 9, RTX 4070 grafika, 120Hz OLED o'yin displeyi. Yengil, ammo o'ta baquvvat o'yin noutbuki.")
                        .price(1899.99)
                        .imageUrl("https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(5)
                        .subcategory(gamingSub)
                        .isActive(true)
                        .build());
            }

            if (quloqchinSub != null) {
                productRepository.save(Product.builder()
                        .name("Apple AirPods Pro 2")
                        .description("Active Noise Cancellation shovqinni kamaytirish tizimi, Adaptive Audio rejami, 6 soatgacha uzluksiz ishlaydigan quloqchin.")
                        .price(249.99)
                        .imageUrl("https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(30)
                        .subcategory(quloqchinSub)
                        .isActive(true)
                        .build());
            }

            if (sichqonchaSub != null) {
                productRepository.save(Product.builder()
                        .name("Logitech MX Master 3S")
                        .description("Ergonomik dizayn, 8K DPI datchik, har qanday yuzada ishlay oladigan va deyarli ovozsiz kliklanadigan professional simsiz sichqoncha.")
                        .price(99.99)
                        .imageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(25)
                        .subcategory(sichqonchaSub)
                        .isActive(true)
                        .build());
            }

            log.info("Namunaviy mahsulotlar muvaffaqiyatli yuklandi!");
        }

        // Synchronize PostgreSQL sequences just in case there were manual inserts
        try {
            log.info("PostgreSQL ketma-ketliklarini (sequences) sinxronizatsiya qilish boshlandi...");
            jdbcTemplate.execute("SELECT setval('brands_id_seq', COALESCE((SELECT MAX(id) FROM brands), 1))");
            jdbcTemplate.execute("SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1))");
            jdbcTemplate.execute("SELECT setval('subcategories_id_seq', COALESCE((SELECT MAX(id) FROM subcategories), 1))");
            jdbcTemplate.execute("SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1))");
            log.info("Barcha ketma-ketliklar sinxronlashtirildi.");
        } catch (Exception e) {
            log.warn("Ketma-ketliklarni sinxronlashtirishda xatolik (Bu xatolikka e'tibor bermasa ham bo'ladi): {}", e.getMessage());
        }
        
        log.info("Dastlabki ma'lumotlar to'liq tekshirildi.");
    }
}
