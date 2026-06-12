import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { BrandService } from '../../services/brand.service';
import { WishlistService } from '../../services/wishlist.service';
import { CategoryBannerService, CategoryBanner } from '../../services/category-banner.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container fade-in-el">
      <!-- Brands Reels Slider -->
      <section class="brands-reels-section" *ngIf="brands.length > 0">
        <div class="brands-marquee-wrapper">
          <div class="brands-marquee-track">
            <div class="brands-group">
              <div class="brand-item" *ngFor="let brand of brands" [routerLink]="['/catalog']" [queryParams]="{ brand: brand.id }">
                <div class="brand-img-wrapper" [style.backgroundImage]="'url(' + (brand.imageUrl || 'assets/placeholder.png') + ')'"></div>
                <span class="brand-name">{{ brand.name }}</span>
              </div>
            </div>
            <div class="brands-group">
              <div class="brand-item" *ngFor="let brand of brands" [routerLink]="['/catalog']" [queryParams]="{ brand: brand.id }">
                <div class="brand-img-wrapper" [style.backgroundImage]="'url(' + (brand.imageUrl || 'assets/placeholder.png') + ')'"></div>
                <span class="brand-name">{{ brand.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Carousel Banner -->
      <section class="carousel-section">
        <div class="carousel-container">
          <div class="carousel-track" [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
            <div class="carousel-slide" *ngFor="let banner of banners">
              <img [src]="banner.imageUrl" [alt]="banner.title" />
              <div class="carousel-overlay">
                <h2>{{ banner.title }}</h2>
              </div>
            </div>
          </div>
          
          <button class="carousel-btn prev" (click)="prevSlide()">❮</button>
          <button class="carousel-btn next" (click)="nextSlide()">❯</button>
          
          <div class="carousel-dots">
            <span 
              *ngFor="let banner of banners; let i = index" 
              class="dot" 
              [class.active]="currentSlide === i"
              (click)="setSlide(i)">
            </span>
          </div>
        </div>
      </section>

      <!-- Hero Banner -->
      <section class="hero-banner glass-panel">
        <div class="hero-text">
          <span class="hero-tag">NexShop Premium</span>
          <h1>Kafolatlangan Texnologiyalar Olamiga Xush Kelibsiz!</h1>
          <p>Bizda eng so'nggi rusumdagi smartfonlar, noutbuklar va professional aksessuarlar eng qulay shartlarda.</p>
        </div>
        <div class="hero-glow-effect"></div>
      </section>

      <!-- Hot Deals Section -->
      <section *ngIf="discountedProducts.length > 0" class="hot-deals-section fade-in-el">
        <div class="deals-header">
          <h2>🔥 Maxsus Chegirmalar</h2>
        </div>
        <div class="deals-scroll-container" #dealsContainer>
          <div *ngFor="let product of discountedProducts" class="deal-card glass-card">
            <div class="product-img-wrapper">
              <img [src]="getProductImages(product)[product.activeImageIndex || 0]" [alt]="product.name" class="product-img" [routerLink]="['/product', product.id]" />
              
              <!-- Card Image Slider Controls -->
              <ng-container *ngIf="getProductImages(product).length > 1">
                <button class="card-slider-arrow prev" (click)="prevCardImage(product, $event)">❮</button>
                <button class="card-slider-arrow next" (click)="nextCardImage(product, $event)">❯</button>
                <div class="card-slider-dots">
                  <span *ngFor="let img of getProductImages(product); let idx = index" 
                        class="card-slider-dot" 
                        [class.active]="(product.activeImageIndex || 0) === idx"
                        (click)="setCardImage(product, idx, $event)">
                  </span>
                </div>
              </ng-container>

              <span class="discount-badge">-{{ product.discount }}%</span>
            </div>
            
            <div class="product-info">
              <h3 [routerLink]="['/product', product.id]" class="product-name">{{ product.name }}</h3>
              
              <div class="deal-price-section">
                <span class="old-price">{{ product.price | number:'1.0-0' }} so'm</span>
                <span class="new-price">{{ getFinalPrice(product.price, product.discount) | number:'1.0-0' }} so'm</span>
              </div>
              
              <div class="deal-actions">
                <button class="btn-primary btn-deal" (click)="addToCart(product, $event)">
                  Savatga qo'shish
                </button>
                <button
                  class="btn-wish deal-wish-btn"
                  [class.wished]="isInWishlist(product.id)"
                  (click)="toggleWishlist(product, $event)"
                  title="Sevimlilarga qo'shish"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Layout -->
      <div class="catalog-layout" #catalogAnchor>
        <!-- Category Filter Sidebar -->
        <aside class="sidebar glass-panel">
          <h3>Kategoriyalar</h3>
          <ul class="category-list">
            <li 
              [class.active]="selectedCategoryId === null && selectedSubcategoryId === null && selectedChildCategoryId === null"
              (click)="selectCategory(null)"
            >
              Barcha mahsulotlar
            </li>
            <li *ngFor="let category of categories" class="category-accordion-item">
              <div 
                class="category-accordion-header"
                [class.active]="selectedCategoryId === category.id && selectedSubcategoryId === null && selectedChildCategoryId === null"
                (click)="toggleAccordion(category.id)"
              >
                <span>{{ category.name }}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  [class.rotated]="openCategoryId === category.id"
                  class="accordion-arrow"
                ><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <ul class="subcategory-list" *ngIf="openCategoryId === category.id">
                <li
                  [class.active]="selectedCategoryId === category.id && selectedSubcategoryId === null && selectedChildCategoryId === null"
                  (click)="selectCategoryOnly(category.id, category.name)"
                >Barchasi</li>
                <li 
                  *ngFor="let sub of getSubsForCategory(category.id)"
                  class="subcategory-accordion-item"
                >
                  <div 
                    class="subcategory-accordion-header"
                    [class.active]="selectedSubcategoryId === sub.id && selectedChildCategoryId === null"
                    (click)="toggleSubAccordion(sub.id)"
                  >
                    <span>{{ sub.name }}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                      [class.rotated]="openSubcategoryId === sub.id"
                      class="accordion-arrow"
                    ><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                  <ul class="childcategory-list" *ngIf="openSubcategoryId === sub.id">
                    <li
                      [class.active]="selectedSubcategoryId === sub.id && selectedChildCategoryId === null"
                      (click)="selectSubcategoryOnly(sub)"
                    >Barchasi</li>
                    <li
                      *ngFor="let child of sub.childCategories"
                      [class.active]="selectedChildCategoryId === child.id"
                      (click)="selectChildCategory(child)"
                    >
                      {{ child.name }}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </aside>

        <!-- Product Grid Area -->
        <main class="products-area">
          <div class="area-header">
            <h2>{{ catalogTitle }}</h2>
            <p *ngIf="products.length > 0" class="results-count">{{ products.length }} ta mahsulot topildi</p>
          </div>

          <!-- Loading state -->
          <div *ngIf="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Mahsulotlar yuklanmoqda...</p>
          </div>

          <!-- Empty state -->
          <div *ngIf="!isLoading && products.length === 0" class="empty-products glass-panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h3>Hech qanday mahsulot topilmadi</h3>
            <p>Boshqa kategoriya yoki qidiruv so'rovini sinab ko'ring.</p>
            <button (click)="resetCatalog()" class="btn-primary">Katalogga qaytish</button>
          </div>

          <!-- Grid -->
          <div *ngIf="!isLoading && products.length > 0" class="products-grid">
            <div *ngFor="let product of pagedProducts" class="product-card glass-card">
              <div class="product-img-wrapper">
                <img [src]="getProductImages(product)[product.activeImageIndex || 0]" [alt]="product.name" class="product-img" [routerLink]="['/product', product.id]" />
                
                <!-- Card Image Slider Controls -->
                <ng-container *ngIf="getProductImages(product).length > 1">
                  <button class="card-slider-arrow prev" (click)="prevCardImage(product, $event)">❮</button>
                  <button class="card-slider-arrow next" (click)="nextCardImage(product, $event)">❯</button>
                  <div class="card-slider-dots">
                    <span *ngFor="let img of getProductImages(product); let idx = index" 
                          class="card-slider-dot" 
                          [class.active]="(product.activeImageIndex || 0) === idx"
                          (click)="setCardImage(product, idx, $event)">
                    </span>
                  </div>
                </ng-container>

                <span *ngIf="product.discount" class="discount-badge">-{{ product.discount }}%</span>
                <span class="category-badge">{{ product.category?.name }}</span>
              </div>
              
              <div class="product-info">
                <h3 [routerLink]="['/product', product.id]" class="product-name">{{ product.name }}</h3>
             
                
                <div class="product-footer">
                  <div class="price-section">
                    <div *ngIf="product.discount" class="product-price new-price" style="font-size: 1.1rem; color: var(--danger-color); -webkit-text-fill-color: initial;">
                      {{ getFinalPrice(product.price, product.discount) | number:'1.0-0' }} so'm 
                      <span class="old-price" style="font-size:0.8rem; margin-left:0.5rem; text-decoration:line-through; color:var(--text-secondary)">{{ product.price | number:'1.0-0' }}</span>
                    </div>
                    <div *ngIf="!product.discount" class="product-price">{{ product.price | number:'1.0-0' }} so'm</div>
                    <div class="installment-badge">
                      <span class="installment-amount">{{ calculateInstallment(product.price) | number:'1.0-0' }} so'm</span> / 12 oy
                    </div>
                  </div>
                  
                  <ng-container *ngIf="product.stockQuantity > 0; else outOfStockBtn">
                    <div *ngIf="getCartItem(product.id) as cartItem; else addBtn" class="cart-controls">
                      <button
                        class="btn-wish"
                        [class.wished]="isInWishlist(product.id)"
                        (click)="toggleWishlist(product, $event)"
                        title="Sevimlilarga qo'shish"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" [attr.fill]="isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                      <div class="qty-control">
                        <button class="qty-btn" (click)="updateCartQty(cartItem, cartItem.quantity - 1)">-</button>
                        <span class="qty-val">{{ cartItem.quantity }}</span>
                        <button class="qty-btn" (click)="updateCartQty(cartItem, cartItem.quantity + 1)">+</button>
                      </div>
                      <a routerLink="/cart" class="btn-go-cart" title="Savatga o'tish">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      </a>
                    </div>
                    <ng-template #addBtn>
                      <div class="add-btn-row">
                        <button
                          class="btn-wish"
                          [class.wished]="isInWishlist(product.id)"
                          (click)="toggleWishlist(product, $event)"
                          title="Sevimlilarga qo'shish"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" [attr.fill]="isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                        <button 
                          (click)="addToCart(product, $event)" 
                          [disabled]="addingProductId === product.id"
                          class="btn-add-to-cart"
                        >
                          <span *ngIf="addingProductId !== product.id">Savatga +</span>
                          <span *ngIf="addingProductId === product.id" class="added-feedback">Qo'shildi!</span>
                        </button>
                      </div>
                    </ng-template>
                  </ng-container>
                  <ng-template #outOfStockBtn>
                    <div class="add-btn-row">
                      <button
                        class="btn-wish"
                        [class.wished]="isInWishlist(product.id)"
                        (click)="toggleWishlist(product, $event)"
                        title="Sevimlilarga qo'shish"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" [attr.fill]="isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                      <span class="out-of-stock">Tugagan</span>
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mat-paginator" *ngIf="!isLoading && products.length > pageSize">
            <div class="mat-paginator-container">
              <div class="mat-paginator-range-label">
                {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, products.length) }} / {{ products.length }}
              </div>
              <div class="mat-paginator-navigation">
                <button class="mat-icon-btn" (click)="goToPage(1)" [disabled]="currentPage === 1" title="Birinchi">&#171;</button>
                <button class="mat-icon-btn" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1" title="Oldingi">&#8249;</button>
                <ng-container *ngFor="let p of pageNumbers()">
                  <button class="mat-page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p }}</button>
                </ng-container>
                <button class="mat-icon-btn" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages" title="Keyingi">&#8250;</button>
                <button class="mat-icon-btn" (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages" title="Oxirgi">&#187;</button>
              </div>
              <div class="mat-paginator-page-size">
                <span>Sahifada:</span>
                <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="mat-page-select">
                  <option [value]="12">12</option>
                  <option [value]="24">24</option>
                  <option [value]="48">48</option>
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Custom Category Banners -->
      <ng-container *ngFor="let banner of categoryBanners">
        <section class="custom-category-section fade-in-el">
          <!-- Collage Banner turned into Auto-sliding Carousel -->
          <div class="custom-category-banner">
            
            <div class="category-banner-carousel">
              <div 
                class="carousel-image-slide" 
                *ngFor="let img of (banner.imageUrls?.length ? banner.imageUrls : [banner.imageUrl]); let idx = index"
                [class.active]="(banner.currentSlideIndex || 0) === idx"
                [style.backgroundImage]="'url(' + img + ')'">
              </div>
            </div>

            <div class="banner-overlay">
              <h2>{{ banner.categoryName }}</h2>
              <a [routerLink]="['/catalog']" [queryParams]="{ category: banner.categoryId }" class="btn-primary" style="text-decoration: none;">Barchasini ko'rish</a>
            </div>
          </div>
          
          <!-- Horizontal Scroll Products -->
          <div class="deals-scroll-container mt-3" *ngIf="banner.products && banner.products.length > 0">
            <div *ngFor="let product of banner.products" class="deal-card glass-card">
              <div class="product-img-wrapper">
                <img [src]="getProductImages(product)[product.activeImageIndex || 0]" [alt]="product.name" class="product-img" [routerLink]="['/product', product.id]" />
                
                <!-- Card Image Slider Controls -->
                <ng-container *ngIf="getProductImages(product).length > 1">
                  <button class="card-slider-arrow prev" (click)="prevCardImage(product, $event)">❮</button>
                  <button class="card-slider-arrow next" (click)="nextCardImage(product, $event)">❯</button>
                  <div class="card-slider-dots">
                    <span *ngFor="let img of getProductImages(product); let idx = index" 
                          class="card-slider-dot" 
                          [class.active]="(product.activeImageIndex || 0) === idx"
                          (click)="setCardImage(product, idx, $event)">
                    </span>
                  </div>
                </ng-container>

                <span *ngIf="product.discount" class="discount-badge">-{{ product.discount }}%</span>
              </div>
              
              <div class="product-info">
                <h3 [routerLink]="['/product', product.id]" class="product-name">{{ product.name }}</h3>
                <div class="deal-price-section">
                  <div *ngIf="product.discount" class="new-price" style="font-size: 1.2rem; color: var(--danger-color);">
                    {{ getFinalPrice(product.price, product.discount) | number:'1.0-0' }} so'm
                    <span class="old-price" style="font-size:0.8rem; margin-left:0.5rem; text-decoration:line-through; color:var(--text-secondary)">{{ product.price | number:'1.0-0' }}</span>
                  </div>
                  <div *ngIf="!product.discount" class="new-price" style="font-size: 1.2rem; color: var(--primary-color);">
                    {{ product.price | number:'1.0-0' }} so'm
                  </div>
                </div>
                <div class="deal-actions">
                  <button class="btn-primary btn-deal" style="background: var(--primary-gradient); box-shadow: 0 4px 15px var(--primary-glow); border: none; flex: 1;" (click)="addToCart(product, $event)">
                    Savatga
                  </button>
                  <button class="btn-wish deal-wish-btn" [class.wished]="isInWishlist(product.id)" (click)="toggleWishlist(product, $event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ng-container>
      </div>

      <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToastNotif">
      <div class="mat-snack-icon">
        <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <svg *ngIf="toastType === 'snack-warning'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </div>
      <span class="mat-snack-text">{{ toastMsg }}</span>
    </div>
  `,
  styles: [`

  .btn-primary{
    color: wheat;
  }
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
      position: relative;
    }

    /* Brands Reels Styles - Infinite scrolling marquee */
    .brands-reels-section {
      margin-bottom: 2rem;
      margin-top: 1.5rem;
      width: 100%;
      overflow: hidden;
      position: relative;
      padding: 0.5rem 0;
    }

    .brands-marquee-wrapper {
      width: 100%;
      overflow: hidden;
      display: flex;
    }

    .brands-marquee-track {
      display: flex;
      width: max-content;
      animation: marqueeScroll 25s linear infinite;
    }

    .brands-marquee-track:hover {
      animation-play-state: paused;
    }

    .brands-group {
      display: flex;
      gap: 2.25rem;
      padding-right: 2.25rem;
    }

    @keyframes marqueeScroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .brand-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      min-width: 85px;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .brand-item:hover {
      transform: translateY(-5px) scale(1.05);
    }

    .brand-img-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-color: #fff;
      border: 2px solid transparent;
      background-clip: padding-box;
      position: relative;
    }

    .brand-img-wrapper::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      z-index: -1;
      transition: all 0.3s ease;
    }

    .brand-item:hover .brand-img-wrapper::before {
      background: linear-gradient(135deg, #00f2fe, #4facfe);
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
    }

    .brand-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      max-width: 85px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Carousel Styles */
    .carousel-section {
      margin-bottom: 2.5rem;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      position: relative;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .carousel-container {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
    }

    .carousel-track {
      display: flex;
      width: 100%;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .carousel-slide {
      min-width: 100%;
      height: 100%;
      position: relative;
    }

    .carousel-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .carousel-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 3rem 2rem 2rem;
      background: linear-gradient(to top, rgba(10, 13, 20, 0.9) 0%, transparent 100%);
      color: white;
    }

    .carousel-overlay h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(10, 13, 20, 0.5);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
      z-index: 2;
    }

    .carousel-btn:hover {
      background: rgba(0, 242, 254, 0.8);
      border-color: rgba(0, 242, 254, 1);
    }

    .carousel-btn.prev {
      left: 1.5rem;
    }

    .carousel-btn.next {
      right: 1.5rem;
    }

    .carousel-dots {
      position: absolute;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
      z-index: 2;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot:hover {
      background: rgba(255, 255, 255, 0.8);
    }

    .dot.active {
      background: var(--primary-color);
      transform: scale(1.2);
      box-shadow: 0 0 10px var(--primary-glow);
    }

    @media (max-width: 768px) {
      .carousel-container { height: 250px; }
      .carousel-overlay h2 { font-size: 1.4rem; }
      .carousel-btn { width: 36px; height: 36px; font-size: 1rem; }
    }

    .hero-banner {
      position: relative;
      padding: 4rem 3rem;
      border-radius: var(--border-radius-lg);
      margin-bottom: 2.5rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, rgba(23, 29, 43, 0.6) 0%, rgba(10, 13, 20, 0.6) 100%);
    }

    /* ── Light theme hero overrides ── */
    :host-context([data-theme="light"]) .hero-banner {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 60%, #6366f1 100%);
      box-shadow: 0 12px 40px rgba(37, 99, 235, 0.25);
    }

    :host-context([data-theme="light"]) .hero-tag {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.45);
      color: #fff;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
    }

    :host-context([data-theme="light"]) .hero-text h1 {
      background: linear-gradient(to right, #ffffff, #e0f2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    :host-context([data-theme="light"]) .hero-text p {
      color: rgba(255, 255, 255, 0.85);
    }

    :host-context([data-theme="light"]) .hero-glow-effect {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%);
    }

    .hero-text {
      max-width: 700px;
      z-index: 2;
    }

    .hero-tag {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(0, 242, 254, 0.1);
      border: 1px solid rgba(0, 242, 254, 0.3);
      color: var(--primary-color);
      font-size: 0.8rem;
      font-weight: 700;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.15);
    }

    .hero-text h1 {
      font-size: 3rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      font-weight: 800;
      background: linear-gradient(to right, #ffffff, #d2d6dc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-text p {
      color: var(--text-secondary);
      font-size: 1.15rem;
    }

    .hero-glow-effect {
      position: absolute;
      top: -20%;
      right: -10%;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(255, 15, 123, 0.05) 50%, transparent 100%);
      filter: blur(50px);
      z-index: 1;
    }

    .catalog-layout {
      display: flex;
      gap: 2rem;
    }

    .sidebar {
      width: 280px;
      height: fit-content;
      padding: 1.75rem 1.5rem;
      flex-shrink: 0;
    }

    .sidebar h3 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
      font-family: var(--font-heading);
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 0.75rem;
    }

    .category-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-list > li {
      border-radius: var(--border-radius-sm);
      color: var(--text-secondary);
      font-weight: 500;
      transition: var(--transition-smooth);
    }

    .category-list > li:not(.category-accordion-item) {
      padding: 0.75rem 1rem;
      cursor: pointer;
    }

    .category-list > li:not(.category-accordion-item):hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      transform: translateX(3px);
    }

    .category-list > li.active {
      background: rgba(0, 242, 254, 0.08);
      border-left: 3px solid var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
    }

    .category-accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-radius: var(--border-radius-sm);
      transition: var(--transition-smooth);
    }

    .category-accordion-header:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
    }

    .category-accordion-header.active {
      background: rgba(0, 242, 254, 0.08);
      border-left: 3px solid var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
    }

    .accordion-arrow {
      transition: transform 0.3s ease;
      opacity: 0.7;
    }

    .accordion-arrow.rotated {
      transform: rotate(180deg);
      color: var(--primary-color);
      opacity: 1;
    }

    .subcategory-list {
      list-style: none;
      margin-top: 0.25rem;
      margin-left: 1rem;
      padding-left: 0.5rem;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      animation: subcatFadeIn 0.25s ease-out forwards;
    }

    @keyframes subcatFadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .subcategory-list > li {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
      border-radius: 4px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .subcategory-list > li:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      transform: translateX(2px);
    }

    .subcategory-list > li.active {
      color: var(--primary-color);
      background: rgba(0, 242, 254, 0.05);
      font-weight: 600;
    }

    .subcategory-accordion-item {
      display: flex;
      flex-direction: column;
    }
    .subcategory-accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: 0.9rem;
      border-radius: 4px;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    .subcategory-accordion-header:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
    }
    .subcategory-accordion-header.active {
      color: var(--primary-color);
      background: rgba(0, 242, 254, 0.05);
      font-weight: 600;
    }
    .childcategory-list {
      list-style: none;
      margin-top: 0.25rem;
      margin-left: 1rem;
      padding-left: 0.5rem;
      border-left: 1px dashed rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .childcategory-list > li {
      padding: 0.4rem 0.65rem;
      font-size: 0.85rem;
      border-radius: 4px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    .childcategory-list > li:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
    }
    .childcategory-list > li.active {
      color: var(--primary-color);
      background: rgba(0, 242, 254, 0.05);
      font-weight: 600;
    }

    .products-area {
      flex: 1;
    }

    .area-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.75rem;
    }

    .area-header h2 {
      font-size: 1.6rem;
      font-weight: 700;
    }

    .results-count {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 1.75rem;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
      overflow: hidden;
    }

    .product-img-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.2);
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover .product-img {
      transform: scale(1.08);
    }

    .category-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(11, 14, 20, 0.85);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
      backdrop-filter: blur(5px);
    }

    .product-info {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-name {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition-smooth);
    }

    .product-name:hover {
      color: var(--primary-color);
    }

    .product-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .product-footer {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      align-items: stretch;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.85rem;
    }

    .price-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .product-price {
      font-size: 1.3rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
      white-space: nowrap;
    }

    .installment-badge {
      font-size: 0.75rem;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
      border: 1px solid rgba(255, 255, 255, 0.05);
      white-space: nowrap;
    }

    .installment-amount {
      color: #fbbf24;
      font-weight: 700;
    }

    .btn-add-to-cart {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.5rem 0.95rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-add-to-cart:hover {
      background: var(--primary-gradient);
      border-color: transparent;
      color: #04080f;
      box-shadow: 0 0 12px var(--primary-glow);
    }

    .added-feedback {
      color: var(--success-color);
      font-weight: 700;
    }

    .cart-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .qty-control {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      overflow: hidden;
    }

    .qty-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      width: 28px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: bold;
      transition: var(--transition-smooth);
    }

    .qty-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-color);
    }

    .qty-val {
      min-width: 20px;
      text-align: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .btn-go-cart {
      background: var(--primary-gradient);
      color: #04080f;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: var(--transition-smooth);
    }

    .btn-go-cart:hover {
      box-shadow: 0 0 12px var(--primary-glow);
      transform: translateY(-2px);
    }

    .out-of-stock {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

    /* Wishlist Heart Button */
    .btn-wish {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 8px;
      border: 1px solid rgba(255, 77, 109, 0.25);
      background: rgba(255, 77, 109, 0.08);
      color: rgba(255, 77, 109, 0.6);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-wish:hover {
      background: rgba(255, 77, 109, 0.15);
      color: #ff4d6d;
      border-color: rgba(255, 77, 109, 0.5);
      transform: scale(1.1);
    }

    .btn-wish.wished {
      background: rgba(255, 77, 109, 0.2);
      color: #ff4d6d;
      border-color: #ff4d6d;
      animation: heartPop 0.3s ease;
    }

    @keyframes heartPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    /* Deal card actions row */
    .deal-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.75rem;
    }

    .deal-wish-btn {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .add-btn-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .add-btn-row .btn-add-to-cart {
      flex: 1;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 0;
      color: var(--text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px dashed var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .empty-products {
      padding: 4rem 2rem;
      text-align: center;
      max-width: 500px;
      margin: 2rem auto;
    }

    .empty-icon {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-products h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }

    .empty-products p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1024px) {
      .catalog-layout { flex-direction: column; }
      .sidebar { width: 100%; }
      .hero-banner { padding: 3rem 2rem; }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    }

    @media (max-width: 768px) {
      .home-container { padding: 0 0.75rem; }
      .carousel-container { height: 260px; }
      .carousel-overlay h2 { font-size: 1.4rem; }
      .carousel-btn { width: 36px; height: 36px; font-size: 0.95rem; }

      .hero-banner { padding: 2rem 1.5rem; text-align: center; }
      .hero-tag { margin: 0 auto 1rem; }
      .hero-text h1 { font-size: 2rem; }

      .catalog-layout { gap: 1.5rem; }
      .sidebar { padding: 1.25rem 1rem; }
      .category-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .category-list li { padding: 0.4rem 0.8rem; border-radius: 50px; border: 1px solid var(--glass-border); }

      .products-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
      .product-card { padding: 0; }
      .product-img-wrapper { height: 160px; }
      .product-info { padding: 0.85rem; }
      .product-name { font-size: 0.9rem; }
      .product-desc { display: none; }
      .product-price { font-size: 1.1rem; }
      .installment-badge { font-size: 0.68rem; }
      .btn-add-to-cart { font-size: 0.75rem; padding: 0.45rem 0.75rem; }
      .product-footer { flex-direction: column; align-items: stretch; gap: 0.5rem; }
    }

    @media (max-width: 480px) {
      .products-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      .carousel-container { height: 200px; }
      .carousel-overlay h2 { font-size: 1.1rem; }
      .hero-text h1 { font-size: 1.6rem; }
      .hero-text p { font-size: 0.9rem; }
      .area-header h2 { font-size: 1.2rem; }
    }

    /* Material Snackbar Toast */
    .mat-snackbar {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: 320px;
      max-width: 480px;
      padding: 0.9rem 1.4rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.35);
      z-index: 99999;
      animation: snackSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .snack-success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
    }

    .snack-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
    }

    .snack-warning {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
    }

    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }

    @keyframes snackSlideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* Image Slider inside Card */
    .product-img-wrapper {
      position: relative;
    }
    
    .card-slider-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(11, 14, 20, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-primary);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.8rem;
      transition: var(--transition-smooth);
      opacity: 0;
      z-index: 5;
      backdrop-filter: blur(8px);
      padding: 0;
      line-height: 1;
    }
    
    .product-img-wrapper:hover .card-slider-arrow {
      opacity: 1;
    }
    
    .card-slider-arrow:hover {
      background: var(--primary-color);
      color: #0b0e14;
      box-shadow: 0 0 10px var(--primary-glow);
      border-color: var(--primary-color);
    }
    
    .card-slider-arrow.prev {
      left: 8px;
    }
    
    .card-slider-arrow.next {
      right: 8px;
    }
    
    .card-slider-dots {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 5px;
      z-index: 5;
      background: rgba(11, 14, 20, 0.5);
      padding: 3px 8px;
      border-radius: 50px;
      backdrop-filter: blur(4px);
    }
    
    .card-slider-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    
    .card-slider-dot.active {
      background: var(--primary-color);
      width: 12px;
      border-radius: 3px;
    }

    /* Hot Deals Styles */
    .hot-deals-section {
      margin-bottom: 3rem;
    }
    
    .deals-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--danger-color);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .deals-scroll-container {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      padding-bottom: 1.5rem;
      scrollbar-width: thin;
      scrollbar-color: var(--primary-color) rgba(255, 255, 255, 0.05);
    }
    
    .deals-scroll-container::-webkit-scrollbar {
      height: 6px;
    }
    .deals-scroll-container::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    .deals-scroll-container::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 10px;
    }

    .deal-card {
      min-width: 280px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .discount-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--danger-color);
      color: white;
      padding: 0.3rem 0.7rem;
      font-size: 0.85rem;
      font-weight: 800;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
    }

    .deal-price-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .old-price {
      font-size: 0.95rem;
      color: var(--text-secondary);
      text-decoration: line-through;
    }

    .new-price {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--danger-color);
    }

    .btn-deal {
      width: 100%;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
      border: none;
    }
    .btn-deal:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    /* ======= Custom Category Banner ======= */
    .custom-category-section {
      margin-bottom: 4rem;
    }
    
    .custom-category-banner {
      width: 100%;
      height: 300px;
      border-radius: var(--border-radius-lg);
      position: relative;
      overflow: hidden;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      box-shadow: var(--shadow-md);
      background: var(--glass-bg);
    }
    
    .category-banner-carousel {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 0;
    }
    .carousel-image-slide {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    .carousel-image-slide.active {
      opacity: 1;
    }
    
    .custom-category-banner::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to right, rgba(11, 14, 20, 0.9) 0%, rgba(11, 14, 20, 0.6) 40%, rgba(11, 14, 20, 0.1) 100%);
      z-index: 1;
      pointer-events: none;
    }
    
    .banner-overlay {
      position: relative;
      z-index: 2;
      padding: 0 4rem;
      color: white;
      max-width: 600px;
    }
    
    .banner-overlay h2 {
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: white;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    
    .mt-3 {
      margin-top: 1.5rem;
    }

    /* ======= Pagination ======= */
    .mat-paginator {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      padding: 0.5rem 0 1rem;
    }
    .mat-paginator-container {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 0.75rem 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .mat-paginator-range-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      min-width: 120px;
      text-align: center;
    }
    .mat-paginator-navigation {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .mat-icon-btn, .mat-page-btn {
      background: none;
      border: 1px solid transparent;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      color: var(--text-secondary);
      transition: all 0.2s;
      font-weight: 600;
    }
    .mat-icon-btn:hover:not(:disabled), .mat-page-btn:hover {
      background: rgba(255,255,255,0.06);
      color: var(--text-primary);
      border-color: var(--glass-border);
    }
    .mat-icon-btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .mat-page-btn.active {
      background: var(--primary-gradient);
      color: white;
      border-color: transparent;
    }
    .mat-paginator-page-size {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .mat-page-select {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--glass-border);
      border-radius: 6px;
      color: var(--text-primary);
      padding: 0.3rem 0.6rem;
      font-size: 0.85rem;
      cursor: pointer;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  subcategories: any[] = [];
  openCategoryId: number | null = null;
  openSubcategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;
  selectedChildCategoryId: number | null = null;
  products: any[] = [];
  discountedProducts: any[] = [];
  cartItems: any[] = [];
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  catalogTitle: string = 'Barcha mahsulotlar';
  isLoading = true;
  addingProductId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 12;
  Math = Math;
  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }
  get pagedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }
  pageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const cur = this.currentPage;
    let start = Math.max(1, cur - 2);
    let end = Math.min(total, cur + 2);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
      end = Math.min(total, start + 4);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    if (this.catalogAnchor) {
      this.catalogAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success';
  private toastTimer: any;

  brands: any[] = [];
  // Carousel Properties
  banners = [
    { title: 'Noutbuklar chegirmasi', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop' },
    { title: 'Smartfonlar olami', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop' },
    { title: 'O\'yin qurilmalari', imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop' },
    { title: 'Aksessuarlar', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop' },
    { title: 'Premium texnika', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop' }
  ];
  currentSlide = 0;
  slideInterval: any;

  @ViewChild('dealsContainer') dealsContainer!: ElementRef;
  @ViewChild('catalogAnchor') catalogAnchor!: ElementRef;
  dealsInterval: any;

  wishlistProductIds = new Set<number>();
  categoryBanners: (CategoryBanner & { products?: any[], currentSlideIndex?: number })[] = [];
  bannersInterval: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private brandService: BrandService,
    private wishlistService: WishlistService,
    private bannerService: CategoryBannerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.startAutoSlide();
    this.startDealsAutoScroll();
    this.loadCategories();
    this.loadDiscountedProducts();
    this.loadBrands();
    this.loadCategoryBanners();
    // Listen to query parameters for search queries
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategoryId = params['category'] ? +params['category'] : null;
      this.selectedSubcategoryId = params['subcategory'] ? +params['subcategory'] : null;
      this.selectedChildCategoryId = params['childCategory'] ? +params['childCategory'] : null;

      if (this.searchQuery) {
        this.searchProducts(this.searchQuery);
      } else if (this.selectedChildCategoryId !== null) {
        this.loadProductsByChildCategory(this.selectedChildCategoryId);
      } else if (this.selectedSubcategoryId !== null) {
        this.loadProductsBySubcategory(this.selectedSubcategoryId);
      } else if (this.selectedCategoryId !== null) {
        this.loadProductsByCategory(this.selectedCategoryId);
      } else {
        this.loadAllProducts();
      }
    });

    // Cart items for UI updates
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    // Wishlist product IDs for heart icon state
    this.wishlistService.wishlistProductIds$.subscribe(ids => {
      this.wishlistProductIds = ids;
    });
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.dealsInterval) {
      clearInterval(this.dealsInterval);
    }
    if (this.bannersInterval) {
      clearInterval(this.bannersInterval);
    }
  }

  // Carousel Methods
  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 soniyada bitta o'zgaradi
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.banners.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.banners.length) % this.banners.length;
  }

  setSlide(index: number): void {
    this.currentSlide = index;
  }

  startDealsAutoScroll(): void {
    this.dealsInterval = setInterval(() => {
      if (this.dealsContainer && this.discountedProducts.length > 0) {
        const el = this.dealsContainer.nativeElement;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000);
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.resolveCategoryHierarchy();
    });
    this.productService.getSubcategories().subscribe(subs => {
      this.subcategories = subs;
      this.resolveCategoryHierarchy();
    });
  }

  resolveCategoryHierarchy(): void {
    if (this.selectedChildCategoryId && this.categories.length > 0 && this.subcategories.length > 0) {
      for (const cat of this.categories) {
        for (const sub of cat.subcategories || []) {
          const child = sub.childCategories?.find((c: any) => c.id === this.selectedChildCategoryId);
          if (child) {
            this.selectedCategoryId = cat.id;
            this.selectedSubcategoryId = sub.id;
            this.openCategoryId = cat.id;
            this.openSubcategoryId = sub.id;
            return;
          }
        }
      }
    }
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe(b => {
      this.brands = b;
    });
  }

  loadDiscountedProducts(): void {
    this.productService.getProducts().subscribe(prods => {
      this.discountedProducts = prods.filter(p => p.isActive && p.discount && p.discount > 0);
    });
  }

  loadCategoryBanners(): void {
    this.bannerService.getAllBanners().subscribe(banners => {
      this.categoryBanners = banners;
      this.categoryBanners.forEach(banner => {
        banner.currentSlideIndex = 0;
        this.productService.getProductsByCategory(banner.categoryId).subscribe(prods => {
          banner.products = prods.filter(p => p.isActive).slice(0, 10);
        });
      });
      this.startBannersAutoSlide();
    });
  }

  startBannersAutoSlide(): void {
    if (this.bannersInterval) {
      clearInterval(this.bannersInterval);
    }
    this.bannersInterval = setInterval(() => {
      this.categoryBanners.forEach(banner => {
        const totalImages = banner.imageUrls?.length || (banner.imageUrl ? 1 : 0);
        if (totalImages > 1) {
          banner.currentSlideIndex = ((banner.currentSlideIndex || 0) + 1) % totalImages;
        }
      });
    }, 5000);
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.catalogTitle = 'Barcha mahsulotlar';
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.productService.getCategoryById(categoryId).subscribe(cat => {
      this.catalogTitle = cat.name;
    });

    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadProductsBySubcategory(subcategoryId: number): void {
    this.isLoading = true;
    this.productService.getProductsBySubcategory(subcategoryId).subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadProductsByChildCategory(childCategoryId: number): void {
    this.isLoading = true;
    this.productService.getProductsByChildCategory(childCategoryId).subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  searchProducts(query: string): void {
    this.isLoading = true;
    this.catalogTitle = `"${query}" bo'yicha qidiruv natijalari`;
    this.productService.searchProducts(query).subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.selectedSubcategoryId = null;
    this.selectedChildCategoryId = null;
    this.openCategoryId = categoryId;
    this.openSubcategoryId = null;
    this.searchQuery = '';
    if (categoryId === null) {
      this.loadAllProducts();
    } else {
      this.loadProductsByCategory(categoryId);
    }
  }

  selectCategoryOnly(categoryId: number, name: string): void {
    this.selectedCategoryId = categoryId;
    this.selectedSubcategoryId = null;
    this.selectedChildCategoryId = null;
    this.searchQuery = '';
    this.loadProductsByCategory(categoryId);
  }

  selectSubcategoryOnly(sub: any): void {
    this.selectedCategoryId = sub.category?.id || null;
    this.selectedSubcategoryId = sub.id;
    this.selectedChildCategoryId = null;
    this.searchQuery = '';
    this.isLoading = true;
    this.catalogTitle = sub.name;
    this.loadProductsBySubcategory(sub.id);
  }

  selectChildCategory(child: any): void {
    this.selectedCategoryId = child.subcategory?.category?.id || null;
    this.selectedSubcategoryId = child.subcategory?.id || null;
    this.selectedChildCategoryId = child.id;
    this.searchQuery = '';
    this.isLoading = true;
    this.catalogTitle = child.name;
    this.loadProductsByChildCategory(child.id);
  }

  toggleAccordion(categoryId: number): void {
    this.openCategoryId = this.openCategoryId === categoryId ? null : categoryId;
  }

  toggleSubAccordion(subcategoryId: number): void {
    this.openSubcategoryId = this.openSubcategoryId === subcategoryId ? null : subcategoryId;
  }

  getSubsForCategory(categoryId: number): any[] {
    return this.subcategories.filter(s => s.category?.id === categoryId);
  }

  resetCatalog(): void {
    this.selectCategory(null);
  }

  addToCart(product: any, event?: Event): void {
    if (!this.authService.isLoggedIn()) {
      this.showToast('Savatga mahsulot qo\'shish uchun avval tizimga kiring!', 'snack-warning');
      return;
    }

    // Savatga uchish animatsiyasi
    if (event) {
      this.flyToCartAnimation(event);
    }

    this.addingProductId = product.id;
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.addingProductId = null;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Xatolik yuz berdi!', 'snack-error');
        this.addingProductId = null;
      }
    });
  }

  private flyToCartAnimation(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const card = button.closest('.product-card, .deal-card');
    if (!card) return;

    const img = card.querySelector('.product-img') as HTMLImageElement;
    if (!img) return;

    const cartIcon = document.querySelector('.cart-link, .mobile-cart') as HTMLElement;
    if (!cartIcon) return;

    // Kloni yaratamiz
    const clone = img.cloneNode(true) as HTMLImageElement;
    const rect = img.getBoundingClientRect();

    // Dastlabki holati
    Object.assign(clone.style, {
      position: 'fixed',
      top: rect.top + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      objectFit: 'cover',
      borderRadius: '8px',
      zIndex: '99999',
      transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
      pointerEvents: 'none',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
    });

    document.body.appendChild(clone);

    // Animatsiya uchun reflow talab qilinadi
    clone.offsetHeight;

    // Savat koordinatalarini aniqlash
    const cartRect = cartIcon.getBoundingClientRect();
    const cartCenterX = cartRect.left + cartRect.width / 2;
    const cartCenterY = cartRect.top + cartRect.height / 2;

    // Klonning oxirgi manziliga yetib borishi
    Object.assign(clone.style, {
      top: (cartCenterY - 15) + 'px', // O'rtasiga tushishi uchun
      left: (cartCenterX - 15) + 'px',
      width: '30px',
      height: '30px',
      opacity: '0.2',
      borderRadius: '50%',
      transform: 'scale(0.5)'
    });

    // Tugaganda o'chirish va savatchaga zarba (bump) effekti berish
    setTimeout(() => {
      clone.remove();

      // Bump effekti
      cartIcon.style.transform = 'scale(1.2)';
      cartIcon.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
      }, 200);

    }, 800);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIds.has(productId);
  }

  toggleWishlist(product: any, event: Event): void {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/register']);
      return;
    }

    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlistByProduct(product.id).subscribe({
        next: () => this.showToast('Sevimlilardan o\'chirildi!', 'snack-warning')
      });
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => this.showToast('Sevimlilarga qo\'shildi! ❤️', 'snack-success')
      });
    }
  }

  getCartItem(productId: number): any {
    return this.cartItems.find(item => item.product.id === productId);
  }

  updateCartQty(cartItem: any, newQty: number): void {
    if (newQty < 1) {
      this.cartService.removeFromCart(cartItem.id).subscribe();
    } else {
      this.cartService.updateCartItem(cartItem.id, newQty).subscribe();
    }
  }

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  calculateInstallment(price: number): number {
    return (price * 1.45) / 12;
  }

  getFinalPrice(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount / 100);
  }

  showToast(message: string, type: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.toastType = type;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }

  getProductImages(product: any): string[] {
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.imageUrls && product.imageUrls.length > 0) {
      product.imageUrls.forEach((url: string) => {
        if (url && !list.includes(url)) {
          list.push(url);
        }
      });
    }
    return list;
  }

  prevCardImage(product: any, event: Event): void {
    event.stopPropagation();
    const imgs = this.getProductImages(product);
    if (imgs.length <= 1) return;
    const cur = product.activeImageIndex || 0;
    product.activeImageIndex = (cur - 1 + imgs.length) % imgs.length;
  }

  nextCardImage(product: any, event: Event): void {
    event.stopPropagation();
    const imgs = this.getProductImages(product);
    if (imgs.length <= 1) return;
    const cur = product.activeImageIndex || 0;
    product.activeImageIndex = (cur + 1) % imgs.length;
  }

  setCardImage(product: any, index: number, event: Event): void {
    event.stopPropagation();
    product.activeImageIndex = index;
  }
}
