import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';

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
      </div>

      <!-- Products Table -->
      <div class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Mahsulot nomi</th>
              <th>Kategoriya</th>
              <th>Narxi</th>
              <th>Chegirma</th>
              <th>Omborda</th>
              <th>Status</th>
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
              <td><strong>{{ product.price | number:'1.2-2' }} so'm</strong></td>
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
              <td colspan="8" class="empty-row">Mahsulotlar topilmadi</td>
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
            </div>

            <div class="form-group">
              <label class="glass-label">Tavsif</label>
              <textarea [(ngModel)]="form.description" name="description" class="glass-input" rows="3" placeholder="Mahsulot haqida batafsil ma'lumot..."></textarea>
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

            <!-- Rasm Yuklash Qismi -->
            <div class="form-group">
              <label class="glass-label">Mahsulot Rasmi</label>
              <div class="image-upload-area" (click)="triggerFileInput()" [class.has-image]="imagePreviewUrl">
                <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Rasm preview" class="image-preview" />
                <div *ngIf="!imagePreviewUrl" class="upload-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <p>Rasmni tanlash uchun bosing</p>
                  <span>JPG, PNG, WEBP — maksimum 10MB</span>
                </div>
                <div *ngIf="imagePreviewUrl" class="image-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Rasmni almashtirish
                </div>
                <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="file-input-hidden" />
              </div>
              <div *ngIf="isUploading" class="upload-progress">
                <div class="upload-spinner"></div>
                <span>Rasm yuklanmoqda...</span>
              </div>
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

    /* Image Upload Area */
    .image-upload-area {
      position: relative;
      border: 2px dashed var(--glass-border);
      border-radius: 12px;
      min-height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.02);
    }

    .image-upload-area:hover {
      border-color: rgba(168, 85, 247, 0.5);
      background: rgba(168, 85, 247, 0.05);
    }

    .image-upload-area.has-image {
      border-style: solid;
      border-color: rgba(168, 85, 247, 0.4);
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      padding: 2rem;
      text-align: center;
    }

    .upload-placeholder p {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin: 0;
    }

    .upload-placeholder span {
      font-size: 0.8rem;
      opacity: 0.6;
    }

    .image-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 160px;
      max-height: 220px;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .image-upload-area:hover .image-overlay {
      opacity: 1;
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
      border: 2px solid rgba(168, 85, 247, 0.3);
      border-top-color: #a855f7;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

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
  `]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  searchTerm = '';
  selectedCategoryFilter: number | null = null;

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

  form = {
    name: '',
    description: '',
    price: 0,
    discount: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: null as number | null,
    isActive: true
  };

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.productService.getCategories().subscribe(c => this.categories = c);
    this.productService.getProducts().subscribe(p => {
      this.products = p;
      this.filteredProducts = p;
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchSearch = !this.searchTerm ||
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchCat = !this.selectedCategoryFilter || p.category?.id === this.selectedCategoryFilter;
      return matchSearch && matchCat;
    });
    this.currentPage = 1;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = { name: '', description: '', price: 0, discount: 0, stockQuantity: 0, imageUrl: '', categoryId: null, isActive: true };
    this.imagePreviewUrl = null;
    this.showModal = true;
  }

  openEditModal(product: any): void {
    this.isEditMode = true;
    this.editingId = product.id;
    this.form = {
      name: product.name,
      description: product.description || '',
      price: product.price,
      discount: product.discount || 0,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || null,
      isActive: product.isActive
    };
    this.imagePreviewUrl = this.form.imageUrl || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.imagePreviewUrl = null;
  }

  triggerFileInput(): void {
    const input = document.querySelector('.file-input-hidden') as HTMLInputElement;
    if (input) input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Lokal preview uchun
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Backend'ga yuklash
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:8080/api/upload/image', formData).subscribe({
      next: (res) => {
        this.form.imageUrl = res.imageUrl;
        this.isUploading = false;
        this.showToast('Rasm yuklandi!', 'snack-success');
      },
      error: () => {
        this.isUploading = false;
        this.showToast('Rasmni yuklashda xatolik! Iltimos qayta urinib ko\'ring.', 'snack-error');
      }
    });
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
      price: this.form.price,
      discount: this.form.discount,
      stockQuantity: this.form.stockQuantity,
      imageUrl: this.form.imageUrl,
      isActive: this.form.isActive,
      category: { id: this.form.categoryId }
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
