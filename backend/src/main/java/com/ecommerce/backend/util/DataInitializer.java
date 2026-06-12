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
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@ecommerce.uz");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("Administrator");
            admin.setAddress("Toshkent shahar, Chilonzor tumani");
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            log.info("Default Admin yaratildi: admin / admin123");
        }

        if (!userRepository.existsByUsername("user")) {
            User customer = new User();
            customer.setUsername("user");
            customer.setEmail("user@ecommerce.uz");
            customer.setPassword(passwordEncoder.encode("user123"));
            customer.setFirstName("Eldor");
            customer.setLastName("Karimov");
            customer.setAddress("Toshkent shahar, Yunusobod tumani");
            customer.setRole(Role.ROLE_USER);
            userRepository.save(customer);
            log.info("Default Customer yaratildi: user / user123");
        }

        // 2. Initialize Categories
        if (categoryRepository.count() == 0) {
            Category smartfonlar = new Category();
            smartfonlar.setName("Smartfonlar");
            smartfonlar.setDescription("Eng so'nggi rusumdagi telefonlar va smartfonlar");
            smartfonlar.setAttributesTemplate(Arrays.asList("Ekran o'lchami", "Operativ xotira (RAM)", "Ichki xotira", "Kamera", "Batareya hajmi"));

            Category noutbuklar = new Category();
            noutbuklar.setName("Noutbuklar");
            noutbuklar.setDescription("O'qish, ish va o'yinlar uchun kuchli noutbuklar");
            noutbuklar.setAttributesTemplate(Arrays.asList("Ekran", "Protsessor", "RAM", "SSD/HDD hajmi", "Videokarta"));

            Category aksessuarlar = new Category();
            aksessuarlar.setName("Aksessuarlar");
            aksessuarlar.setDescription("Quloqchinlar, sichqonchalar va boshqa qo'shimcha qurilmalar");
            aksessuarlar.setAttributesTemplate(Arrays.asList("Ulanish turi", "Kabel uzunligi", "Rang"));

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
                Subcategory s1 = new Subcategory(); s1.setName("Apple iPhone"); s1.setDescription("Apple iPhone seriyasi"); s1.setCategory(smartfonlar);
                Subcategory s2 = new Subcategory(); s2.setName("Samsung Galaxy"); s2.setDescription("Samsung Galaxy seriyasi"); s2.setCategory(smartfonlar);
                Subcategory s3 = new Subcategory(); s3.setName("Xiaomi"); s3.setDescription("Xiaomi smartfonlar"); s3.setCategory(smartfonlar);
                subcategoryRepository.saveAll(Arrays.asList(s1, s2, s3));
            }
            if (noutbuklar != null) {
                Subcategory s4 = new Subcategory(); s4.setName("MacBook"); s4.setDescription("Apple MacBook seriyasi"); s4.setCategory(noutbuklar);
                Subcategory s5 = new Subcategory(); s5.setName("Gaming Noutbuklar"); s5.setDescription("O'yin uchun noutbuklar"); s5.setCategory(noutbuklar);
                Subcategory s6 = new Subcategory(); s6.setName("Biznes Noutbuklar"); s6.setDescription("Ish uchun noutbuklar"); s6.setCategory(noutbuklar);
                subcategoryRepository.saveAll(Arrays.asList(s4, s5, s6));
            }
            if (aksessuarlar != null) {
                Subcategory s7 = new Subcategory(); s7.setName("Quloqchinlar"); s7.setDescription("Simsiz va simli quloqchinlar"); s7.setCategory(aksessuarlar);
                Subcategory s8 = new Subcategory(); s8.setName("Sichqoncha va Klaviatura"); s8.setDescription("Kompyuter periferiyalari"); s8.setCategory(aksessuarlar);
                Subcategory s9 = new Subcategory(); s9.setName("Zaryadlovchilar"); s9.setDescription("Zaryadlovchi qurilmalar"); s9.setCategory(aksessuarlar);
                subcategoryRepository.saveAll(Arrays.asList(s7, s8, s9));
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
                ChildCategory cc = new ChildCategory(); cc.setName("Apple smartfonlar"); cc.setSubcategory(appleIphone);
                childCategoryRepository.save(cc);
            }
            if (samsungGalaxy != null) {
                ChildCategory cc = new ChildCategory(); cc.setName("Samsung smartfonlar"); cc.setSubcategory(samsungGalaxy);
                childCategoryRepository.save(cc);
            }
            if (macbook != null) {
                ChildCategory cc = new ChildCategory(); cc.setName("MacBook noutbuklar"); cc.setSubcategory(macbook);
                childCategoryRepository.save(cc);
            }
            if (gaming != null) {
                ChildCategory cc = new ChildCategory(); cc.setName("Asus ROG"); cc.setSubcategory(gaming);
                childCategoryRepository.save(cc);
            }
            if (quloqchinlar != null) {
                ChildCategory cc = new ChildCategory(); cc.setName("Simsiz quloqchinlar"); cc.setSubcategory(quloqchinlar);
                childCategoryRepository.save(cc);
            }
            if (sichqoncha != null) {
                ChildCategory cc = new ChildCategory(); cc.setName("Logitech sichqonchalar"); cc.setSubcategory(sichqoncha);
                childCategoryRepository.save(cc);
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

                Product p1 = new Product();
                p1.setName("iPhone 15 Pro Max");
                p1.setDescription("Titan korpus, A17 Pro super chip, 5x optik yaqinlashtiruvchi kamera va o'ta tiniq displey. 256GB xotira bilan jihozlangan premium smartfon.");
                p1.setPrice(1399.99);
                p1.setImageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop");
                p1.setStockQuantity(15);
                p1.setChildCategory(appleSmart);
                p1.setIsActive(true);
                p1.setCharacteristics(iphoneSpecs);
                productRepository.save(p1);
            }

            if (samsungSmart != null) {
                Map<String, String> samsungSpecs = new HashMap<>();
                samsungSpecs.put("Ekran o'lchami", "6.8 inchi Dynamic AMOLED 2X");
                samsungSpecs.put("Operativ xotira (RAM)", "12 GB");
                samsungSpecs.put("Ichki xotira", "512 GB");
                samsungSpecs.put("Kamera", "200 MP + 50 MP + 12 MP + 10 MP");
                samsungSpecs.put("Batareya hajmi", "5000 mA/soat");

                Product p2 = new Product();
                p2.setName("Samsung Galaxy S24 Ultra");
                p2.setDescription("Galaxy AI intellektual yordamchisi, 200MP ultra-kamera, o'rnatilgan S-Pen stilus va titanium korpusga ega eng so'nggi flagman.");
                p2.setPrice(1249.99);
                p2.setImageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop");
                p2.setStockQuantity(12);
                p2.setChildCategory(samsungSmart);
                p2.setIsActive(true);
                p2.setCharacteristics(samsungSpecs);
                productRepository.save(p2);
            }

            if (macbookPro != null) {
                Map<String, String> macSpecs = new HashMap<>();
                macSpecs.put("Ekran", "16.2 inchi Liquid Retina XDR");
                macSpecs.put("Protsessor", "Apple M3 Max (16-core CPU)");
                macSpecs.put("RAM", "36 GB");
                macSpecs.put("SSD/HDD hajmi", "1 TB SSD");
                macSpecs.put("Videokarta", "Apple 40-core GPU");

                Product p3 = new Product();
                p3.setName("MacBook Pro 16 M3 Max");
                p3.setDescription("Apple M3 Max super chipi, 36GB birlashgan xotira, 1TB tezkor SSD. Grafika ustasi va dasturchilar uchun eng mukammal ish quroli.");
                p3.setPrice(3499.99);
                p3.setImageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop");
                p3.setStockQuantity(8);
                p3.setChildCategory(macbookPro);
                p3.setIsActive(true);
                p3.setCharacteristics(macSpecs);
                productRepository.save(p3);
            }

            if (asusRog != null) {
                Map<String, String> asusSpecs = new HashMap<>();
                asusSpecs.put("Ekran", "14 inchi ROG Nebula Display QHD+ OLED 120Hz");
                asusSpecs.put("Protsessor", "AMD Ryzen 9 8945HS");
                asusSpecs.put("RAM", "32 GB LPDDR5X");
                asusSpecs.put("SSD/HDD hajmi", "1 TB PCIe 4.0 NVMe M.2");
                asusSpecs.put("Videokarta", "NVIDIA GeForce RTX 4070");

                Product p4 = new Product();
                p4.setName("ASUS ROG Zephyrus G14");
                p4.setDescription("AMD Ryzen 9, RTX 4070 grafika, 120Hz OLED o'yin displeyi. Yengil, ammo o'ta baquvvat o'yin noutbuki.");
                p4.setPrice(1899.99);
                p4.setImageUrl("https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop");
                p4.setStockQuantity(5);
                p4.setChildCategory(asusRog);
                p4.setIsActive(true);
                p4.setCharacteristics(asusSpecs);
                productRepository.save(p4);
            }

            if (airpods != null) {
                Map<String, String> airpodsSpecs = new HashMap<>();
                airpodsSpecs.put("Ulanish turi", "Simsiz (Bluetooth 5.3)");
                airpodsSpecs.put("Kabel uzunligi", "Simsiz zaryadlash keysi (USB-C)");
                airpodsSpecs.put("Rang", "Oq (White)");

                Product p5 = new Product();
                p5.setName("Apple AirPods Pro 2");
                p5.setDescription("Active Noise Cancellation shovqinni kamaytirish tizimi, Adaptive Audio rejami, 6 soatgacha uzluksiz ishlaydigan quloqchin.");
                p5.setPrice(249.99);
                p5.setImageUrl("https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=600&auto=format&fit=crop");
                p5.setStockQuantity(30);
                p5.setChildCategory(airpods);
                p5.setIsActive(true);
                p5.setCharacteristics(airpodsSpecs);
                productRepository.save(p5);
            }

            if (logitechMouse != null) {
                Map<String, String> mouseSpecs = new HashMap<>();
                mouseSpecs.put("Ulanish turi", "Simsiz (Logi Bolt yoki Bluetooth)");
                mouseSpecs.put("Kabel uzunligi", "Zaryadlash uchun USB-C kabeli");
                mouseSpecs.put("Rang", "Grafit qora (Graphite)");

                Product p6 = new Product();
                p6.setName("Logitech MX Master 3S");
                p6.setDescription("Ergonomik dizayn, 8K DPI datchik, har qanday yuzada ishlay oladigan va deyarli ovozsiz kliklanadigan professional simsiz sichqoncha.");
                p6.setPrice(99.99);
                p6.setImageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop");
                p6.setStockQuantity(25);
                p6.setChildCategory(logitechMouse);
                p6.setIsActive(true);
                p6.setCharacteristics(mouseSpecs);
                productRepository.save(p6);
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
