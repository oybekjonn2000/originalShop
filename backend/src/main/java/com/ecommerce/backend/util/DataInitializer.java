package com.ecommerce.backend.util;

import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
                    .attributesTemplate(Arrays.asList("Ekran o'lchami", "Operativ xotira (RAM)", "Ichki xotira", "Kamera", "Batareya hajmi"))
                    .build();

            Category noutbuklar = Category.builder()
                    .name("Noutbuklar")
                    .description("O'qish, ish va o'yinlar uchun kuchli noutbuklar")
                    .attributesTemplate(Arrays.asList("Ekran", "Protsessor", "RAM", "SSD/HDD hajmi", "Videokarta"))
                    .build();

            Category aksessuarlar = Category.builder()
                    .name("Aksessuarlar")
                    .description("Quloqchinlar, sichqonchalar va boshqa qo'shimcha qurilmalar")
                    .attributesTemplate(Arrays.asList("Ulanish turi", "Kabel uzunligi", "Rang"))
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

        // 3.5. Initialize ChildCategories
        if (childCategoryRepository.count() == 0) {
            List<Subcategory> subs = subcategoryRepository.findAll();
            
            Subcategory appleIphone = subs.stream().filter(s -> s.getName().equals("Apple iPhone")).findFirst().orElse(null);
            Subcategory samsungGalaxy = subs.stream().filter(s -> s.getName().equals("Samsung Galaxy")).findFirst().orElse(null);
            Subcategory macbook = subs.stream().filter(s -> s.getName().equals("MacBook")).findFirst().orElse(null);
            Subcategory gaming = subs.stream().filter(s -> s.getName().equals("Gaming Noutbuklar")).findFirst().orElse(null);
            Subcategory quloqchinlar = subs.stream().filter(s -> s.getName().equals("Quloqchinlar")).findFirst().orElse(null);
            Subcategory sichqoncha = subs.stream().filter(s -> s.getName().equals("Sichqoncha va Klaviatura")).findFirst().orElse(null);
            
            if (appleIphone != null) {
                childCategoryRepository.save(ChildCategory.builder().name("Apple smartfonlar").subcategory(appleIphone).build());
            }
            if (samsungGalaxy != null) {
                childCategoryRepository.save(ChildCategory.builder().name("Samsung smartfonlar").subcategory(samsungGalaxy).build());
            }
            if (macbook != null) {
                childCategoryRepository.save(ChildCategory.builder().name("MacBook noutbuklar").subcategory(macbook).build());
            }
            if (gaming != null) {
                childCategoryRepository.save(ChildCategory.builder().name("Asus ROG").subcategory(gaming).build());
            }
            if (quloqchinlar != null) {
                childCategoryRepository.save(ChildCategory.builder().name("Simsiz quloqchinlar").subcategory(quloqchinlar).build());
            }
            if (sichqoncha != null) {
                childCategoryRepository.save(ChildCategory.builder().name("Logitech sichqonchalar").subcategory(sichqoncha).build());
            }
            log.info("Child kategoriyalar yaratildi.");
        }

        // 4. Initialize Products (faqat bo'sh bo'lganda)
        if (productRepository.count() == 0) {
            // Childkategoriyalarni olish
            ChildCategory appleSmart = childCategoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals("Apple smartfonlar")).findFirst().orElse(null);
            ChildCategory samsungSmart = childCategoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals("Samsung smartfonlar")).findFirst().orElse(null);
            ChildCategory macbookPro = childCategoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals("MacBook noutbuklar")).findFirst().orElse(null);
            ChildCategory asusRog = childCategoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals("Asus ROG")).findFirst().orElse(null);
            ChildCategory airpods = childCategoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals("Simsiz quloqchinlar")).findFirst().orElse(null);
            ChildCategory logitechMouse = childCategoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals("Logitech sichqonchalar")).findFirst().orElse(null);

            if (appleSmart != null) {
                Map<String, String> iphoneSpecs = new HashMap<>();
                iphoneSpecs.put("Ekran o'lchami", "6.7 inchi Super Retina XDR OLED");
                iphoneSpecs.put("Operativ xotira (RAM)", "8 GB");
                iphoneSpecs.put("Ichki xotira", "256 GB");
                iphoneSpecs.put("Kamera", "48 MP + 12 MP + 12 MP");
                iphoneSpecs.put("Batareya hajmi", "4441 mA/soat");

                productRepository.save(Product.builder()
                        .name("iPhone 15 Pro Max")
                        .description("Titan korpus, A17 Pro super chip, 5x optik yaqinlashtiruvchi kamera va o'ta tiniq displey. 256GB xotira bilan jihozlangan premium smartfon.")
                        .price(1399.99)
                        .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(15)
                        .childCategory(appleSmart)
                        .isActive(true)
                        .characteristics(iphoneSpecs)
                        .build());
            }

            if (samsungSmart != null) {
                Map<String, String> samsungSpecs = new HashMap<>();
                samsungSpecs.put("Ekran o'lchami", "6.8 inchi Dynamic AMOLED 2X");
                samsungSpecs.put("Operativ xotira (RAM)", "12 GB");
                samsungSpecs.put("Ichki xotira", "512 GB");
                samsungSpecs.put("Kamera", "200 MP + 50 MP + 12 MP + 10 MP");
                samsungSpecs.put("Batareya hajmi", "5000 mA/soat");

                productRepository.save(Product.builder()
                        .name("Samsung Galaxy S24 Ultra")
                        .description("Galaxy AI intellektual yordamchisi, 200MP ultra-kamera, o'rnatilgan S-Pen stilus va titanium korpusga ega eng so'nggi flagman.")
                        .price(1249.99)
                        .imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(12)
                        .childCategory(samsungSmart)
                        .isActive(true)
                        .characteristics(samsungSpecs)
                        .build());
            }

            if (macbookPro != null) {
                Map<String, String> macSpecs = new HashMap<>();
                macSpecs.put("Ekran", "16.2 inchi Liquid Retina XDR");
                macSpecs.put("Protsessor", "Apple M3 Max (16-core CPU)");
                macSpecs.put("RAM", "36 GB");
                macSpecs.put("SSD/HDD hajmi", "1 TB SSD");
                macSpecs.put("Videokarta", "Apple 40-core GPU");

                productRepository.save(Product.builder()
                        .name("MacBook Pro 16 M3 Max")
                        .description("Apple M3 Max super chipi, 36GB birlashgan xotira, 1TB tezkor SSD. Grafika ustasi va dasturchilar uchun eng mukammal ish quroli.")
                        .price(3499.99)
                        .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(8)
                        .childCategory(macbookPro)
                        .isActive(true)
                        .characteristics(macSpecs)
                        .build());
            }

            if (asusRog != null) {
                Map<String, String> asusSpecs = new HashMap<>();
                asusSpecs.put("Ekran", "14 inchi ROG Nebula Display QHD+ OLED 120Hz");
                asusSpecs.put("Protsessor", "AMD Ryzen 9 8945HS");
                asusSpecs.put("RAM", "32 GB LPDDR5X");
                asusSpecs.put("SSD/HDD hajmi", "1 TB PCIe 4.0 NVMe M.2");
                asusSpecs.put("Videokarta", "NVIDIA GeForce RTX 4070");

                productRepository.save(Product.builder()
                        .name("ASUS ROG Zephyrus G14")
                        .description("AMD Ryzen 9, RTX 4070 grafika, 120Hz OLED o'yin displeyi. Yengil, ammo o'ta baquvvat o'yin noutbuki.")
                        .price(1899.99)
                        .imageUrl("https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(5)
                        .childCategory(asusRog)
                        .isActive(true)
                        .characteristics(asusSpecs)
                        .build());
            }

            if (airpods != null) {
                Map<String, String> airpodsSpecs = new HashMap<>();
                airpodsSpecs.put("Ulanish turi", "Simsiz (Bluetooth 5.3)");
                airpodsSpecs.put("Kabel uzunligi", "Simsiz zaryadlash keysi (USB-C)");
                airpodsSpecs.put("Rang", "Oq (White)");

                productRepository.save(Product.builder()
                        .name("Apple AirPods Pro 2")
                        .description("Active Noise Cancellation shovqinni kamaytirish tizimi, Adaptive Audio rejami, 6 soatgacha uzluksiz ishlaydigan quloqchin.")
                        .price(249.99)
                        .imageUrl("https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(30)
                        .childCategory(airpods)
                        .isActive(true)
                        .characteristics(airpodsSpecs)
                        .build());
            }

            if (logitechMouse != null) {
                Map<String, String> mouseSpecs = new HashMap<>();
                mouseSpecs.put("Ulanish turi", "Simsiz (Logi Bolt yoki Bluetooth)");
                mouseSpecs.put("Kabel uzunligi", "Zaryadlash uchun USB-C kabeli");
                mouseSpecs.put("Rang", "Grafit qora (Graphite)");

                productRepository.save(Product.builder()
                        .name("Logitech MX Master 3S")
                        .description("Ergonomik dizayn, 8K DPI datchik, har qanday yuzada ishlay oladigan va deyarli ovozsiz kliklanadigan professional simsiz sichqoncha.")
                        .price(99.99)
                        .imageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop")
                        .stockQuantity(25)
                        .childCategory(logitechMouse)
                        .isActive(true)
                        .characteristics(mouseSpecs)
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
            jdbcTemplate.execute("SELECT setval('child_categories_id_seq', COALESCE((SELECT MAX(id) FROM child_categories), 1))");
            jdbcTemplate.execute("SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1))");
            log.info("Barcha ketma-ketliklar sinxronlashtirildi.");
        } catch (Exception e) {
            log.warn("Ketma-ketliklarni sinxronlashtirishda xatolik (Bu xatolikka e'tibor bermasa ham bo'ladi): {}", e.getMessage());
        }

        // Migrate existing products that only have subcategory_id to their new child_category_id
        try {
            log.info("Eski mahsulotlarni child kategoriyalarga migratsiya qilish boshlandi...");
            jdbcTemplate.execute("UPDATE products SET child_category_id = (SELECT cc.id FROM child_categories cc WHERE cc.subcategory_id = products.subcategory_id) WHERE child_category_id IS NULL AND subcategory_id IS NOT NULL");
            log.info("Eski mahsulotlar child kategoriyalar bilan muvaffaqiyatli bog'landi.");
        } catch (Exception e) {
            log.warn("Mahsulotlarni migratsiya qilishda xatolik (Bu xatolikka e'tibor bermasa ham bo'ladi): {}", e.getMessage());
        }
        


        log.info("Dastlabki ma'lumotlar to'liq tekshirildi.");
    }
}
