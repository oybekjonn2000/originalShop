import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="catalog-container fade-in-el">
      <!-- Header -->
      <div class="page-header text-center">
        <h1>Barcha Mahsulotlar</h1>
        <p class="subtitle">Eng so'nggi va sifatli texnikalarni kashf eting</p>
      </div>

      <div class="catalog-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar glass-panel">
          <div class="filter-section">
            <h3>Qidiruv</h3>
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Mahsulot nomini kiriting..." class="glass-input">
            </div>
          </div>

          <div class="filter-section">
            <h3>Kategoriyalar</h3>
            <ul class="category-list">
              <li [class.active]="selectedCategoryId === null" (click)="selectCategory(null)">Barchasi</li>
              <li *ngFor="let cat of categories" 
                  [class.active]="selectedCategoryId === cat.id" 
                  (click)="selectCategory(cat.id)">
                {{ cat.name }}
              </li>
            </ul>
          </div>

          <div class="filter-section">
            <h3>Saralash (Sort)</h3>
            <select [(ngModel)]="sortBy" (change)="applyFilters()" class="glass-input w-full">
              <option value="newest">Yangi qo'shilganlar</option>
              <option value="priceAsc">Arzonlari oldin</option>
              <option value="priceDesc">Qimmatlari oldin</option>
              <option value="nameAsc">Alifbo bo'yicha (A-Z)</option>
            </select>
          </div>
        </aside>

        <!-- Product Grid -->
        <main class="products-main">
          <div class="area-header">
            <h2>{{ getTitle() }}</h2>
            <p *ngIf="filteredProducts.length > 0" class="results-count">{{ filteredProducts.length }} ta mahsulot topildi</p>
          </div>

          <div *ngIf="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Mahsulotlar yuklanmoqda...</p>
          </div>

          <div *ngIf="!isLoading && filteredProducts.length === 0" class="empty-state glass-panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3>Mahsulot topilmadi</h3>
            <p>Boshqa so'z bilan qidirib ko'ring yoki filtrlarni o'zgartiring.</p>
            <button (click)="resetFilters()" class="btn-secondary">Filtrlarni tozalash</button>
          </div>

          <!-- Recommendations if not found -->
          <div *ngIf="!isLoading && filteredProducts.length === 0" class="recommendations-container fade-in-el">
            <div class="recommendations-header text-center">
              <h2>Sizga taklif etamiz</h2>
              <p class="subtitle">Qidirgan mahsulotingiz topilmadi, ammo ushbu mahsulotlar sizga yoqishi mumkin:</p>
            </div>
            
            <div *ngFor="let recGroup of getRecommendedProducts()" class="rec-category-group">
              <h3 class="rec-category-title">{{ recGroup.categoryName }}</h3>
              <div class="products-grid">
                <div *ngFor="let product of recGroup.products" class="product-card glass-card">
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
                    <span class="category-badge">{{ product.category?.name || 'Kategoriyasiz' }}</span>
                    <div class="stock-badge" *ngIf="product.stockQuantity < 5 && product.stockQuantity > 0">Sanoqli qoldi</div>
                    <div class="stock-badge out-of-stock" *ngIf="product.stockQuantity === 0">Tugagan</div>
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
                              (click)="addToCart(product)" 
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
            </div>
          </div>

          <div *ngIf="!isLoading && filteredProducts.length > 0" class="products-grid">
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
                <span class="category-badge">{{ product.category?.name || 'Kategoriyasiz' }}</span>
                <div class="stock-badge" *ngIf="product.stockQuantity < 5 && product.stockQuantity > 0">Sanoqli qoldi</div>
                <div class="stock-badge out-of-stock" *ngIf="product.stockQuantity === 0">Tugagan</div>
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
                          (click)="addToCart(product)" 
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
          <div class="mat-paginator" *ngIf="!isLoading && filteredProducts.length > pageSize">
            <div class="mat-paginator-container">
              <div class="mat-paginator-range-label">
                {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, filteredProducts.length) }} / {{ filteredProducts.length }}
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
    </div>

    <!-- Material Snackbar Toast -->
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
    .catalog-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      margin-bottom: 2.5rem;
      margin-top: 1rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .page-header .subtitle {
      color: var(--text-secondary);
      font-size: 1.05rem;
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      align-items: start;
    }

    /* Sidebar Filters */
    .filters-sidebar {
      padding: 1.75rem 1.5rem;
      position: sticky;
      top: 90px;
    }

    .filter-section {
      margin-bottom: 2rem;
    }

    .filter-section:last-child {
      margin-bottom: 0;
    }

    .filter-section h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
      font-family: var(--font-heading);
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 0.6rem;
    }

    .search-box {
      position: relative;
    }

    .search-box svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }

    .search-box input {
      padding-left: 2.8rem;
      width: 100%;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .category-list li {
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      color: var(--text-secondary);
      transition: var(--transition-smooth);
      font-size: 0.95rem;
      font-weight: 500;
      margin-bottom: 0.1rem;
    }

    .category-list li:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      transform: translateX(3px);
    }

    .category-list li.active {
      background: rgba(0, 242, 254, 0.08);
      border-left: 3px solid var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
    }

    .w-full {
      width: 100%;
    }

    /* Area Header */
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

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

    .stock-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(245, 158, 11, 0.9);
      color: white;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(4px);
    }

    .stock-badge.out-of-stock {
      background: rgba(239, 68, 68, 0.9);
    }

    .product-info {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-name {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition-smooth);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
      flex: 1;
    }

    .product-name:hover {
      color: var(--primary-color);
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
      gap: 0.2rem;
    }

    .product-price {
      font-size: 1.3rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
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
    }

    .installment-amount {
      color: #fbbf24;
      font-weight: 700;
    }

    .btn-view {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.5rem 0.95rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition-smooth);
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-view:hover {
      background: var(--primary-gradient);
      border-color: transparent;
      color: #04080f;
      box-shadow: 0 0 12px var(--primary-glow);
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
    .snack-success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; }
    .snack-error { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; }
    .snack-warning { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }

    @keyframes snackSlideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* Loading & Empty State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 0;
      color: var(--text-secondary);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      max-width: 500px;
      margin: 2rem auto;
    }

    .empty-state svg {
      color: var(--text-secondary);
      opacity: 0.5;
      margin-bottom: 1.5rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px dashed var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

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

    @media (max-width: 1200px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .catalog-layout { grid-template-columns: 1fr; }
      .filters-sidebar { position: static; }
      .category-list { flex-direction: row; flex-wrap: wrap; gap: 0.5rem; }
      .category-list li { padding: 0.4rem 0.8rem; border-radius: 50px; border: 1px solid var(--glass-border); }
      .category-list li.active { border-left: none; border: 1px solid var(--primary-color); }
      .products-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 768px) {
      .catalog-container { padding: 0 0.75rem; }
      .page-header h1 { font-size: 1.8rem; }
      .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .product-img-wrapper { height: 160px; }
      .product-info { padding: 0.85rem; }
      .product-name { font-size: 0.9rem; }
      .product-price { font-size: 1.1rem; }
      .installment-badge { font-size: 0.68rem; }
      .btn-view { font-size: 0.75rem; padding: 0.4rem 0.7rem; }
      .product-footer { flex-direction: column; align-items: stretch; gap: 0.5rem; }
    }

    @media (max-width: 480px) {
      .page-header h1 { font-size: 1.4rem; }
      .page-header { margin-bottom: 1.5rem; }
      .products-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      .product-name { font-size: 0.85rem; }
      .product-info { padding: 0.75rem; }
      .area-header h2 { font-size: 1.2rem; }
    }

    .recommendations-container {
      margin-top: 4rem;
      border-top: 1px dashed var(--glass-border);
      padding-top: 3rem;
      width: 100%;
    }

    .recommendations-header {
      margin-bottom: 2.5rem;
    }

    .recommendations-header h2 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .rec-category-group {
      margin-bottom: 3rem;
    }

    .rec-category-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 1.25rem;
      border-left: 4px solid var(--primary-color);
      padding-left: 0.75rem;
    }

    .rec-category-group .products-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1200px) {
      .rec-category-group .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .rec-category-group .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .rec-category-group .products-grid {
        grid-template-columns: 1fr 1fr;
      }
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

    .add-btn-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      width: 100%;
    }

    .add-btn-row .btn-add-to-cart {
      flex: 1;
    }

    /* Discount styling */
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
      z-index: 5;
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
  `]
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  cartItems: any[] = [];
  wishlistProductIds = new Set<number>();
  
  isLoading = true;
  searchTerm = '';
  selectedCategoryId: number | null = null;
  selectedBrandId: number | null = null;
  sortBy = 'newest';
  addingProductId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 12;
  Math = Math;
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }
  get pagedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success';
  private toastTimer: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm = params['q'];
      }
      if (params['brand']) {
        this.selectedBrandId = +params['brand'];
      }
      this.loadData();
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.wishlistService.wishlistProductIds$.subscribe(ids => {
      this.wishlistProductIds = ids;
    });
  }

  loadData(): void {
    this.isLoading = true;
    
    // Kategoriyalarni yuklash
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      }
    });

    // Mahsulotlarni yuklash
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectCategory(id: number | null): void {
    this.selectedCategoryId = id;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];

    // 1. Kategoriya bo'yicha filtr
    if (this.selectedCategoryId !== null) {
      result = result.filter(p => p.category && p.category.id === this.selectedCategoryId);
    }

    // Brand bo'yicha filtr
    if (this.selectedBrandId !== null) {
      result = result.filter(p => p.brand && p.brand.id === this.selectedBrandId);
    }

    // 2. Qidiruv bo'yicha filtr
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }

    // 3. Saralash (Sort)
    switch (this.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // Assume ID represents insertion order (newest = highest ID)
        result.sort((a, b) => b.id - a.id);
        break;
    }

    this.filteredProducts = result;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.sortBy = 'newest';
    this.applyFilters();
  }

  getTitle(): string {
    if (this.searchTerm.trim()) {
      return `"${this.searchTerm}" bo'yicha natijalar`;
    }
    if (this.selectedCategoryId !== null) {
      const cat = this.categories.find(c => c.id === this.selectedCategoryId);
      return cat ? cat.name : 'Mahsulotlar';
    }
    return 'Barcha mahsulotlar';
  }

  calculateInstallment(price: number): number {
    // 12 oylik, yiliga 45% ustama bilan
    return (price * 1.45) / 12;
  }

  addToCart(product: any): void {
    if (!this.authService.isLoggedIn()) {
      this.showToast('Savatga mahsulot qo\'shish uchun avval tizimga kiring!', 'snack-warning');
      return;
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

  showToast(message: string, type: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.toastType = type;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }

  getRecommendedProducts(): { categoryName: string, products: any[] }[] {
    const recommendations: { categoryName: string, products: any[] }[] = [];
    
    this.categories.forEach(cat => {
      const catProds = this.products
        .filter(p => p.category && p.category.id === cat.id)
        .slice(0, 4);
      
      if (catProds.length > 0) {
        recommendations.push({
          categoryName: cat.name,
          products: catProds
        });
      }
    });
    
    return recommendations;
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

  getFinalPrice(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount / 100);
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
