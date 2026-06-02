import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container fade-in-el">
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

      <!-- Main Layout -->
      <div class="catalog-layout">
        <!-- Category Filter Sidebar -->
        <aside class="sidebar glass-panel">
          <h3>Kategoriyalar</h3>
          <ul class="category-list">
            <li 
              [class.active]="selectedCategoryId === null"
              (click)="selectCategory(null)"
            >
              Barcha mahsulotlar
            </li>
            <li 
              *ngFor="let category of categories"
              [class.active]="selectedCategoryId === category.id"
              (click)="selectCategory(category.id)"
            >
              {{ category.name }}
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
            <div *ngFor="let product of products" class="product-card glass-card">
              <div class="product-img-wrapper" [routerLink]="['/product', product.id]">
                <img [src]="product.imageUrl" [alt]="product.name" class="product-img" />
                <span class="category-badge">{{ product.category?.name }}</span>
              </div>
              
              <div class="product-info">
                <h3 [routerLink]="['/product', product.id]" class="product-name">{{ product.name }}</h3>
                <p class="product-desc">{{ truncateText(product.description, 90) }}</p>
                
                <div class="product-footer">
                  <div class="price-section">
                    <div class="product-price">{{ product.price | number:'1.2-2' }} so'm</div>
                    <div class="installment-badge">
                      <span class="installment-amount">{{ calculateInstallment(product.price) | number:'1.2-2' }} so'm</span> / 12 oy
                    </div>
                  </div>
                  
                  <ng-container *ngIf="product.stockQuantity > 0; else outOfStockBtn">
                    <div *ngIf="getCartItem(product.id) as cartItem; else addBtn" class="cart-controls">
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
                      <button 
                        (click)="addToCart(product)" 
                        [disabled]="addingProductId === product.id"
                        class="btn-add-to-cart"
                      >
                        <span *ngIf="addingProductId !== product.id">Savatga +</span>
                        <span *ngIf="addingProductId === product.id" class="added-feedback">Qo'shildi!</span>
                      </button>
                    </ng-template>
                  </ng-container>
                  <ng-template #outOfStockBtn>
                    <span class="out-of-stock">Tugagan</span>
                  </ng-template>
                </div>
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
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
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
    }

    .category-list li {
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 500;
      transition: var(--transition-smooth);
      margin-bottom: 0.5rem;
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
      justify-content: space-between;
      align-items: flex-end;
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
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  products: any[] = [];
  cartItems: any[] = [];
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  catalogTitle: string = 'Barcha mahsulotlar';
  isLoading = true;
  addingProductId: number | null = null;

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success';
  private toastTimer: any;

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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.startAutoSlide();
    this.loadCategories();

    // Listen to query parameters for search queries
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategoryId = params['category'] ? +params['category'] : null;

      if (this.searchQuery) {
        this.searchProducts(this.searchQuery);
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
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
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

  loadCategories(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.catalogTitle = 'Barcha mahsulotlar';
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
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
    this.searchQuery = '';
    if (categoryId === null) {
      this.loadAllProducts();
    } else {
      this.loadProductsByCategory(categoryId);
    }
  }

  resetCatalog(): void {
    this.selectCategory(null);
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

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  calculateInstallment(price: number): number {
    return (price * 1.45) / 12;
  }

  showToast(message: string, type: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.toastType = type;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }
}
