import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

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

          <div *ngIf="!isLoading && filteredProducts.length > 0" class="products-grid">
            <div *ngFor="let product of filteredProducts" class="product-card glass-card">
              <div class="product-img-wrapper" [routerLink]="['/product', product.id]">
                <img [src]="product.imageUrl" [alt]="product.name" class="product-img" />
                <span class="category-badge">{{ product.category?.name || 'Kategoriyasiz' }}</span>
                <div class="stock-badge" *ngIf="product.stockQuantity < 5 && product.stockQuantity > 0">Sanoqli qoldi</div>
                <div class="stock-badge out-of-stock" *ngIf="product.stockQuantity === 0">Tugagan</div>
              </div>

              <div class="product-info">
                <h3 [routerLink]="['/product', product.id]" class="product-name">{{ product.name }}</h3>

                <div class="product-footer">
                  <div class="price-section">
                    <div class="product-price">{{ product.price | number:'1.2-2' }} so'm</div>
                    <div class="installment-badge">
                      <span class="installment-amount">{{ calculateInstallment(product.price) | number:'1.2-2' }} so'm</span> / 12 oy
                    </div>
                  </div>
                  
                  <div class="actions-section">
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
                      <button [routerLink]="['/product', product.id]" class="btn-view">Ko'rish →</button>
                    </ng-template>
                  </div>
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

    @media (max-width: 1024px) {
      .catalog-layout { grid-template-columns: 1fr; }
      .filters-sidebar { position: static; }
      .category-list { flex-direction: row; flex-wrap: wrap; gap: 0.5rem; }
      .category-list li { padding: 0.4rem 0.8rem; border-radius: 50px; border: 1px solid var(--glass-border); }
      .category-list li.active { border-left: none; border: 1px solid var(--primary-color); }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    }

    @media (max-width: 768px) {
      .catalog-container { padding: 0 0.75rem; }
      .page-header h1 { font-size: 1.8rem; }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
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
  `]
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  cartItems: any[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedCategoryId: number | null = null;
  sortBy = 'newest';
  addingProductId: number | null = null;

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success';
  private toastTimer: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm = params['q'];
      }
      this.loadData();
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
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
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
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
}
