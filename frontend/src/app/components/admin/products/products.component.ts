import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-products-container fade-in-el">
      <div class="page-header">
        <div>
          <h1>Mahsulotlar Boshqaruvi</h1>
          <p class="subtitle">Katalogdagi barcha mahsulotlarni qo'shish, tahrirlash va o'chirish</p>
        </div>
        <button (click)="openAddModal()" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Yangi Mahsulot
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="filter-bar glass-panel">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterProducts()"
          placeholder="Mahsulot nomi yoki tavsifi bo'yicha qidiring..."
          class="glass-input search-field"
        />
        <select [(ngModel)]="selectedCategoryFilter" (change)="filterProducts()" class="glass-input filter-select">
          <option [ngValue]="null">Barcha kategoriyalar</option>
          <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
        </select>
        <select [(ngModel)]="sortBy" (change)="filterProducts()" class="glass-input filter-select">
          <option value="default">Saralash: Standart</option>
          <option value="name-asc">Nomi bo'yicha (A-Z)</option>
          <option value="name-desc">Nomi bo'yicha (Z-A)</option>
          <option value="price-asc">Narxi: Arzonroq</option>
          <option value="price-desc">Narxi: Qimmatroq</option>
          <option value="stock-asc">Omborda: Kamroq</option>
          <option value="stock-desc">Omborda: Ko'proq</option>
        </select>
      </div>

      <!-- Products Table -->
      <div class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th (click)="toggleSort('name')" class="sortable-header">
                Mahsulot nomi
                <span class="sort-icon" *ngIf="sortBy.startsWith('name')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th (click)="toggleSort('category')" class="sortable-header">
                Kategoriya
                <span class="sort-icon" *ngIf="sortBy.startsWith('category')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th (click)="toggleSort('brand')" class="sortable-header">
                Brand
                <span class="sort-icon" *ngIf="sortBy.startsWith('brand')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th (click)="toggleSort('price')" class="sortable-header">
                Narxi
                <span class="sort-icon" *ngIf="sortBy.startsWith('price')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th (click)="toggleSort('discount')" class="sortable-header">
                Chegirma
                <span class="sort-icon" *ngIf="sortBy.startsWith('discount')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th (click)="toggleSort('stock')" class="sortable-header">
                Omborda
                <span class="sort-icon" *ngIf="sortBy.startsWith('stock')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th (click)="toggleSort('status')" class="sortable-header">
                Status
                <span class="sort-icon" *ngIf="sortBy.startsWith('status')">{{ sortBy.endsWith('-asc') ? ' ▲' : ' ▼' }}</span>
              </th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of pagedProducts">
              <td>
                <img [src]="product.imageUrl" [alt]="product.name" class="product-thumb" />
              </td>
              <td>
                <span class="product-name">{{ product.name }}</span>
              </td>
              <td>{{ product.category?.name || '—' }}</td>
              <td>{{ product.brand?.name || '—' }}</td>
              <td><strong>{{ product.price | number:'1.0-0' }} so'm</strong></td>
              <td>
                <span *ngIf="product.discount" class="discount-badge">-{{ product.discount }}%</span>
                <span *ngIf="!product.discount">—</span>
              </td>
              <td>
                <span [class]="product.stockQuantity <= 5 ? 'stock-low' : 'stock-ok'">
                  {{ product.stockQuantity }} ta
                </span>
              </td>
              <td>
                <span class="badge" [class]="product.isActive ? 'badge-delivered' : 'badge-cancelled'">
                  {{ product.isActive ? 'Faol' : 'Nofaol' }}
                </span>
              </td>
              <td class="actions-col">
                <button (click)="openEditModal(product)" class="btn-icon btn-edit" title="Tahrirlash">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button (click)="deleteProduct(product.id)" class="btn-icon btn-delete" title="O'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredProducts.length === 0">
              <td colspan="9" class="empty-row">Mahsulotlar topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mat-paginator" *ngIf="filteredProducts.length > pageSize">
        <div class="mat-paginator-container">
          <div class="mat-paginator-range-label">
            {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, filteredProducts.length) }} / {{ filteredProducts.length }}
          </div>
          <div class="mat-paginator-navigation">
            <button class="mat-icon-btn" (click)="goToPage(1)" [disabled]="currentPage === 1" title="Birinchi sahifa">
              &#171;
            </button>
            <button class="mat-icon-btn" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1" title="Oldingi">
              &#8249;
            </button>
            <ng-container *ngFor="let p of pageNumbers()">
              <button class="mat-page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p }}</button>
            </ng-container>
            <button class="mat-icon-btn" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages" title="Keyingi">
              &#8250;
            </button>
            <button class="mat-icon-btn" (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages" title="Oxirgi sahifa">
              &#187;
            </button>
          </div>
          <div class="mat-paginator-page-size">
            <span>Sahifada:</span>
            <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="mat-page-select">
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ isEditMode ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish" }}</h2>
            <button (click)="closeModal()" class="btn-close">✕</button>
          </div>

          <form (ngSubmit)="saveProduct()" class="modal-form">
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="glass-label">Mahsulot nomi *</label>
                <input type="text" [(ngModel)]="form.name" name="name" class="glass-input" required placeholder="iPhone 15 Pro" />
              </div>
              <div class="form-group flex-1">
                <label class="glass-label">Kategoriya *</label>
                <select [(ngModel)]="form.categoryId" name="categoryId" class="glass-input" required>
                  <option [ngValue]="null" disabled>Kategoriya tanlang</option>
                  <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label class="glass-label">Brand</label>
                <select [(ngModel)]="form.brandId" name="brandId" class="glass-input">
                  <option [ngValue]="null">Brand tanlang (ixtiyoriy)</option>
                  <option *ngFor="let brand of brands" [ngValue]="brand.id">{{ brand.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="glass-label">Tavsif</label>
              <textarea [(ngModel)]="form.description" name="description" class="glass-input" rows="3" placeholder="Mahsulot haqida batafsil ma'lumot..."></textarea>
            </div>

            <div class="form-group">
              <label class="glass-label">Umumiy tafsif</label>
              <textarea [(ngModel)]="form.fullDescription" name="fullDescription" class="glass-input" rows="5" placeholder="Mahsulotning umumiy, to'liq tafsifi..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="glass-label">Narxi (so'm) *</label>
                <input type="number" [(ngModel)]="form.price" name="price" class="glass-input" required step="0.01" min="0" placeholder="0.00" />
              </div>
              <div class="form-group flex-1">
                <label class="glass-label">Chegirma (%)</label>
                <input type="number" [(ngModel)]="form.discount" name="discount" class="glass-input" min="0" max="100" placeholder="0" />
              </div>
              <div class="form-group flex-1">
                <label class="glass-label">Ombordagi soni *</label>
                <input type="number" [(ngModel)]="form.stockQuantity" name="stockQuantity" class="glass-input" required min="0" placeholder="0" />
              </div>
            </div>

            <!-- Rasmlar Yuklash Qismi (10 tagacha) -->
            <div class="form-group">
              <label class="glass-label">
                Mahsulot Rasmlari (10 tagacha)
                <span class="drag-hint">· tartibini o'zgartirish uchun sudrab qo'ying</span>
              </label>
              <div class="multi-image-grid">
                <div
                  *ngFor="let img of allImageUrls; let i = index"
                  class="multi-image-item"
                  [class.dragging]="dragIndex === i"
                  [class.drag-over]="dragOverIndex === i && dragIndex !== i"
                  draggable="true"
                  (dragstart)="onDragStart(i, $event)"
                  (dragover)="onDragOver(i, $event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop(i, $event)"
                  (dragend)="onDragEnd()"
                >
                  <img [src]="img" alt="Rasm" />
                  <span *ngIf="i === 0" class="main-badge">Asosiy</span>
                  <div class="drag-icon" title="Sudrab o'zgartirish">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>
                  </div>
                  <button type="button" class="remove-img-btn" (click)="removeImage(i, $event)" title="O'chirish">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div class="add-image-btn" *ngIf="allImageUrls.length < 10" (click)="triggerFileInput()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>Rasm qo'shish</span>
                </div>
              </div>
              <input #fileInput type="file" accept="image/*" multiple (change)="onFilesSelected($event)" class="file-input-hidden" />
              <div *ngIf="isUploading" class="upload-progress">
                <div class="upload-spinner"></div>
                <span>Rasm yuklanmoqda...</span>
              </div>
              <p *ngIf="allImageUrls.length > 0" class="image-count-hint">{{ allImageUrls.length }} / 10 ta rasm yuklangan · Birinchi rasm asosiy hisoblanadi</p>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" class="checkbox-input" />
                <span>Mahsulot faol (katalogda ko'rinsin)</span>
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="btn-secondary">Bekor qilish</button>
              <button type="submit" [disabled]="isSaving" class="btn-primary">
                <span *ngIf="isSaving">Saqlanmoqda...</span>
                <span *ngIf="!isSaving">{{ isEditMode ? 'Saqlash' : "Qo'shish" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Confirm Modal -->
      <div class="modal-overlay" *ngIf="showConfirmModal" (click)="closeConfirmModal()">
        <div class="modal-card glass-panel confirm-modal" (click)="$event.stopPropagation()">
          <div class="modal-header confirm-header">
            <div class="confirm-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h2>O'chirishni tasdiqlang</h2>
          </div>
          <div class="confirm-body">
            <p>Bu mahsulotni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>
          </div>
          <div class="modal-actions confirm-actions">
            <button (click)="closeConfirmModal()" class="btn-secondary">Bekor qilish</button>
            <button (click)="confirmDelete()" class="btn-primary btn-danger">O'chirish</button>
          </div>
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
    </div>
  `,
  styles: [`
    .admin-products-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .filter-bar {
      display: flex;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .search-field {
      flex: 1;
    }

    .filter-select {
      width: 240px;
    }

    .product-thumb {
      width: 52px;
      height: 52px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(0,0,0,0.1);
    }

    .product-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .discount-badge {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger-color);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.85rem;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .stock-ok { color: var(--success-color); font-weight: 600; }
    .stock-low { color: var(--warning-color); font-weight: 600; }

    .actions-col {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-edit { color: var(--primary-color); }
    .btn-edit:hover { background: rgba(79, 172, 254, 0.1); border-color: var(--primary-color); }

    .btn-delete { color: var(--danger-color); }
    .btn-delete:hover { background: rgba(239, 68, 68, 0.1); border-color: var(--danger-color); }

    .empty-row {
      text-align: center;
      color: var(--text-secondary) !important;
      padding: 3rem !important;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2rem 1rem;
      overflow-y: auto;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      width: 100%;
      max-width: 660px;
      padding: 2.5rem;
      border-radius: var(--border-radius-lg);
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 1rem;
    }

    .modal-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
    }

    .btn-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
    }

    .btn-close:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .flex-1 { flex: 1; }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-color);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }

    /* Confirm Modal CSS */
    .confirm-modal {
      max-width: 400px;
      padding: 2rem;
      text-align: center;
    }
    .confirm-header {
      flex-direction: column;
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 1rem;
      gap: 1rem;
    }
    .confirm-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--danger-color);
      margin: 0 auto;
    }
    .confirm-body p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .confirm-actions {
      justify-content: center;
      gap: 1rem;
    }
    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
      border: none !important;
    }
    .btn-danger:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
      transform: translateY(-2px);
    }

    @media (max-width: 640px) {
      .filter-bar { flex-direction: column; }
      .filter-select { width: 100%; }
      .form-row { flex-direction: column; }
    }

    /* Multi-Image Upload Grid */
    .multi-image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.85rem;
      margin-top: 0.5rem;
    }

    .multi-image-item {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.02);
    }

    .multi-image-item img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .main-badge {
      position: absolute;
      top: 5px;
      left: 5px;
      background: var(--primary-gradient);
      color: #04080f;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 50px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .remove-img-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: rgba(239, 68, 68, 0.85);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      backdrop-filter: blur(4px);
      padding: 0;
    }

    .multi-image-item:hover .remove-img-btn {
      opacity: 1;
    }

    .add-image-btn {
      width: 100%;
      padding-bottom: 100%;
      position: relative;
      border: 2px dashed rgba(79, 172, 254, 0.35);
      border-radius: 10px;
      background: rgba(79, 172, 254, 0.03);
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .add-image-btn:hover {
      border-color: var(--primary-color);
      background: rgba(79, 172, 254, 0.08);
    }

    .add-image-btn svg,
    .add-image-btn span {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .add-image-btn svg {
      top: calc(50% - 22px);
      color: var(--primary-color);
      transform: translate(-50%, 0);
    }

    .add-image-btn span {
      bottom: 16%;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--primary-color);
      white-space: nowrap;
    }

    .file-input-hidden {
      display: none;
    }

    .upload-progress {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.75rem;
      color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .upload-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(79, 172, 254, 0.25);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .image-count-hint {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }


    /* Drag states */
    .multi-image-item {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.02);
      cursor: grab;
      transition: transform 0.18s ease, border-color 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
    }

    .multi-image-item:active { cursor: grabbing; }

    .multi-image-item.dragging {
      opacity: 0.35;
      border-color: var(--primary-color);
      transform: scale(0.96);
    }

    .multi-image-item.drag-over {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color), inset 0 0 20px rgba(0, 242, 254, 0.15);
      transform: scale(1.04);
    }

    .drag-icon {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.55);
      display: flex;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    .multi-image-item:hover .drag-icon {
      opacity: 1;
    }

    .drag-hint {
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--text-secondary);
      text-transform: none;
      letter-spacing: 0;
      margin-left: 0.25rem;
    }

    /* Material Snackbar Toast */
    .mat-snackbar {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: 300px;
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
    .snack-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }
    .snack-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.4);  color: #f87171; }
    .snack-warning { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ======= Pagination ======= */
    .mat-paginator {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      padding: 0.5rem 0;
    }
    .mat-paginator-container {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 0.6rem 1.25rem;
      flex-wrap: wrap;
    }
    .mat-paginator-range-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      min-width: 110px;
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
      width: 34px;
      height: 34px;
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
      opacity: 0.3;
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
      padding: 0.25rem 0.5rem;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .sortable-header {
      cursor: pointer;
      user-select: none;
      transition: var(--transition-smooth);
    }
    .sortable-header:hover {
      color: var(--primary-color) !important;
      background: rgba(255, 255, 255, 0.08) !important;
    }
    .sort-icon {
      font-size: 0.75rem;
      margin-left: 4px;
      color: var(--primary-color);
      display: inline-block;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  searchTerm = '';
  selectedCategoryFilter: number | null = null;
  sortBy = 'default';

  // Pagination
  currentPage = 1;
  pageSize = 10;
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
  }
  onPageSizeChange(): void {
    this.currentPage = 1;
  }
  showModal = false;
  isEditMode = false;
  isSaving = false;
  editingId: number | null = null;

  showConfirmModal = false;
  productToDelete: number | null = null;

  // Image upload
  imagePreviewUrl: string | null = null;
  isUploading = false;

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success';
  private toastTimer: any;

  allImageUrls: string[] = [];

  form = {
    name: '',
    description: '',
    fullDescription: '',
    price: 0,
    discount: 0,
    stockQuantity: 0,
    imageUrl: '',
    imageUrls: [] as string[],
    categoryId: null as number | null,
    brandId: null as number | null,
    isActive: true
  };

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.productService.getCategories().subscribe(c => this.categories = c);
    this.brandService.getBrands().subscribe(b => this.brands = b);
    this.productService.getProducts().subscribe(p => {
      this.products = p;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    let result = this.products.filter(p => {
      const matchSearch = !this.searchTerm ||
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchCat = !this.selectedCategoryFilter || p.category?.id === this.selectedCategoryFilter;
      return matchSearch && matchCat;
    });

    if (this.sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (this.sortBy === 'category-asc') {
      result.sort((a, b) => (a.category?.name || '').localeCompare(b.category?.name || ''));
    } else if (this.sortBy === 'category-desc') {
      result.sort((a, b) => (b.category?.name || '').localeCompare(a.category?.name || ''));
    } else if (this.sortBy === 'brand-asc') {
      result.sort((a, b) => (a.brand?.name || '').localeCompare(b.brand?.name || ''));
    } else if (this.sortBy === 'brand-desc') {
      result.sort((a, b) => (b.brand?.name || '').localeCompare(a.brand?.name || ''));
    } else if (this.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'discount-asc') {
      result.sort((a, b) => (a.discount || 0) - (b.discount || 0));
    } else if (this.sortBy === 'discount-desc') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (this.sortBy === 'stock-asc') {
      result.sort((a, b) => a.stockQuantity - b.stockQuantity);
    } else if (this.sortBy === 'stock-desc') {
      result.sort((a, b) => b.stockQuantity - a.stockQuantity);
    } else if (this.sortBy === 'status-asc') {
      result.sort((a, b) => (a.isActive === b.isActive) ? 0 : a.isActive ? 1 : -1);
    } else if (this.sortBy === 'status-desc') {
      result.sort((a, b) => (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1);
    }

    this.filteredProducts = result;
    this.currentPage = 1;
  }

  toggleSort(column: string): void {
    if (column === 'name') {
      this.sortBy = this.sortBy === 'name-asc' ? 'name-desc' : 'name-asc';
    } else if (column === 'category') {
      this.sortBy = this.sortBy === 'category-asc' ? 'category-desc' : 'category-asc';
    } else if (column === 'brand') {
      this.sortBy = this.sortBy === 'brand-asc' ? 'brand-desc' : 'brand-asc';
    } else if (column === 'price') {
      this.sortBy = this.sortBy === 'price-asc' ? 'price-desc' : 'price-asc';
    } else if (column === 'discount') {
      this.sortBy = this.sortBy === 'discount-asc' ? 'discount-desc' : 'discount-asc';
    } else if (column === 'stock') {
      this.sortBy = this.sortBy === 'stock-asc' ? 'stock-desc' : 'stock-asc';
    } else if (column === 'status') {
      this.sortBy = this.sortBy === 'status-asc' ? 'status-desc' : 'status-asc';
    }
    this.filterProducts();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = { name: '', description: '', fullDescription: '', price: 0, discount: 0, stockQuantity: 0, imageUrl: '', imageUrls: [], categoryId: null, brandId: null, isActive: true };
    this.imagePreviewUrl = null;
    this.allImageUrls = [];
    this.showModal = true;
  }

  openEditModal(product: any): void {
    this.isEditMode = true;
    this.editingId = product.id;
    this.form = {
      name: product.name,
      description: product.description || '',
      fullDescription: product.fullDescription || '',
      price: product.price,
      discount: product.discount || 0,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      imageUrls: product.imageUrls ? [...product.imageUrls] : [],
      categoryId: product.category?.id || null,
      brandId: product.brand?.id || null,
      isActive: product.isActive
    };
    this.imagePreviewUrl = this.form.imageUrl || null;
    // Build allImageUrls from imageUrl + imageUrls
    this.allImageUrls = [];
    if (this.form.imageUrl) this.allImageUrls.push(this.form.imageUrl);
    if (this.form.imageUrls.length > 0) {
      this.form.imageUrls.forEach(url => {
        if (url && !this.allImageUrls.includes(url)) this.allImageUrls.push(url);
      });
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.imagePreviewUrl = null;
    this.allImageUrls = [];
  }

  triggerFileInput(): void {
    const input = document.querySelector('.file-input-hidden') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const remaining = 10 - this.allImageUrls.length;
    if (remaining <= 0) {
      this.showToast('Maksimum 10 ta rasm qo\'shish mumkin!', 'snack-warning');
      return;
    }

    const filesToUpload = Array.from(input.files).slice(0, remaining);

    filesToUpload.forEach(file => {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>('http://localhost:8080/api/upload/image', formData).subscribe({
        next: (res) => {
          this.allImageUrls.push(res.imageUrl);
          this.syncFormImages();
          this.isUploading = false;
          this.showToast('Rasm yuklandi!', 'snack-success');
        },
        error: () => {
          this.isUploading = false;
          this.showToast('Rasmni yuklashda xatolik!', 'snack-error');
        }
      });
    });
  }

  removeImage(index: number, event?: Event): void {
    if (event) event.stopPropagation();
    this.allImageUrls.splice(index, 1);
    this.syncFormImages();
  }

  syncFormImages(): void {
    if (this.allImageUrls.length > 0) {
      this.form.imageUrl = this.allImageUrls[0];
      this.form.imageUrls = this.allImageUrls.slice(1);
      this.imagePreviewUrl = this.allImageUrls[0];
    } else {
      this.form.imageUrl = '';
      this.form.imageUrls = [];
      this.imagePreviewUrl = null;
    }
  }

  // --- Drag & Drop ---
  dragIndex: number | null = null;
  dragOverIndex: number | null = null;

  onDragStart(index: number, event: DragEvent): void {
    this.dragIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  onDragOver(index: number, event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dragOverIndex = index;
  }

  onDragLeave(event: DragEvent): void {
    // Only clear if truly leaving the grid item (not entering a child)
    const related = event.relatedTarget as HTMLElement;
    if (!related || !(event.currentTarget as HTMLElement).contains(related)) {
      this.dragOverIndex = null;
    }
  }

  onDrop(targetIndex: number, event: DragEvent): void {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === targetIndex) {
      this.dragIndex = null;
      this.dragOverIndex = null;
      return;
    }

    // Reorder
    const moved = this.allImageUrls.splice(this.dragIndex, 1)[0];
    this.allImageUrls.splice(targetIndex, 0, moved);
    this.syncFormImages();

    this.dragIndex = null;
    this.dragOverIndex = null;

    if (targetIndex === 0) {
      this.showToast('Asosiy rasm o\'zgartirildi!', 'snack-success');
    }
  }

  onDragEnd(): void {
    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  saveProduct(): void {
    if (!this.form.name || !this.form.price || this.form.categoryId === null) {
      this.showToast('Iltimos, barcha majburiy maydonlarni to\'ldiring!', 'snack-warning');
      return;
    }

    this.isSaving = true;
    const payload = {
      name: this.form.name,
      description: this.form.description,
      fullDescription: this.form.fullDescription,
      price: this.form.price,
      discount: this.form.discount,
      stockQuantity: this.form.stockQuantity,
      imageUrl: this.form.imageUrl,
      imageUrls: this.form.imageUrls,
      isActive: this.form.isActive,
      category: { id: this.form.categoryId },
      brand: this.form.brandId ? { id: this.form.brandId } : null
    };

    const request$ = this.isEditMode && this.editingId
      ? this.productService.updateProduct(this.editingId, payload)
      : this.productService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadAll();
        this.showToast('Mahsulot muvaffaqiyatli saqlandi!', 'snack-success');
      },
      error: (err) => {
        this.isSaving = false;
        this.showToast(err.error?.message || 'Xatolik yuz berdi!', 'snack-error');
      }
    });
  }

  deleteProduct(id: number): void {
    this.productToDelete = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;
    this.productService.deleteProduct(this.productToDelete).subscribe({
      next: () => {
        this.loadAll();
        this.closeConfirmModal();
        this.showToast('Mahsulot muvaffaqiyatli o\'chirildi!', 'snack-success');
      },
      error: (err) => {
        this.showToast(err.error?.message || 'O\'chirishda xatolik!', 'snack-error');
        this.closeConfirmModal();
      }
    });
  }

  showToast(message: string, type: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.toastType = type;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }
}
