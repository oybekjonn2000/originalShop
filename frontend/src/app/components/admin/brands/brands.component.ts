import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BrandService } from '../../../services/brand.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="brands-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Brandlar Boshqaruvi</h1>
          <p class="subtitle">Brandlarni yaratish, tahrirlash va o'chirish</p>
        </div>
        <div class="header-actions">
          <a routerLink="/admin" class="btn-secondary back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Orqaga
          </a>
          <button (click)="openAddModal()" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Yangi Brand
          </button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="stats-row">
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label">Jami Brandlar</span>
          <span class="stat-chip-value">{{ brands.length }}</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="filter-bar glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterBrands()"
          placeholder="Brand nomi bo'yicha qidiring..."
          class="glass-input search-field"
        />
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Brandlar yuklanmoqda...</p>
      </div>

      <!-- Brands Table -->
      <div *ngIf="!isLoading" class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>ID</th>
              <th>Brand Nomi</th>
              <th>Vaqt</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let brand of pagedBrands">
              <td>
                <img [src]="brand.imageUrl || 'assets/placeholder.png'" [alt]="brand.name" class="brand-thumb" />
              </td>
              <td>{{ brand.id }}</td>
              <td><strong>{{ brand.name }}</strong></td>
              <td class="time-col">
                <div class="time-container" *ngIf="brand.createdAt">
                  <div class="time-row" title="Yaratilgan vaqt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{{ brand.createdAt | date:'short' }}</span>
                  </div>
                  <div class="time-row" title="Oxirgi tahrir" *ngIf="brand.updatedAt && brand.updatedAt !== brand.createdAt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>{{ brand.updatedAt | date:'short' }}</span>
                  </div>
                </div>
              </td>
              <td class="actions-col">
                <button (click)="openEditModal(brand)" class="btn-icon btn-edit" title="Tahrirlash">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button (click)="deleteBrand(brand.id)" class="btn-icon btn-delete" title="O'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredBrands.length === 0">
              <td colspan="5" class="empty-row">Brandlar topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mat-paginator" *ngIf="filteredBrands.length > pageSize">
        <div class="mat-paginator-container">
          <div class="mat-paginator-range-label">
            {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, filteredBrands.length) }} / {{ filteredBrands.length }}
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
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ isEditMode ? 'Brandni tahrirlash' : "Yangi brand qo'shish" }}</h2>
            <button (click)="closeModal()" class="btn-close">✕</button>
          </div>

          <form (ngSubmit)="saveBrand()" class="modal-form">
            <div class="form-group">
              <label class="glass-label">Brand nomi *</label>
              <textarea
                *ngIf="!isEditMode"
                [(ngModel)]="form.name"
                name="name"
                class="glass-input"
                required
                rows="3"
                placeholder="Nomlarni vergul bilan ajratib kiriting (masalan: Apple, Samsung, Xiaomi...)"
                autofocus
              ></textarea>
              <input
                *ngIf="isEditMode"
                type="text"
                [(ngModel)]="form.name"
                name="name"
                class="glass-input"
                required
                placeholder="Masalan: Apple, Samsung..."
              />
            </div>

            <!-- Image Upload -->
            <div class="form-group">
              <label class="glass-label">Brand Rasmi</label>
              <div class="image-upload-area" (click)="triggerFileInput()" [class.has-image]="imagePreviewUrl">
                <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Brand rasmi" class="image-preview" />
                <div *ngIf="!imagePreviewUrl" class="upload-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <p>Rasmni tanlash uchun bosing</p>
                  <span>JPG, PNG, WEBP — maksimum 10MB</span>
                </div>
                <div *ngIf="imagePreviewUrl" class="image-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Rasmni almashtirish
                </div>
                <input #brandFileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="file-input-hidden" />
              </div>
              <div *ngIf="isUploading" class="upload-progress">
                <div class="upload-spinner"></div>
                <span>Rasm yuklanmoqda...</span>
              </div>
            </div>

            <div *ngIf="errorMsg" class="error-msg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ errorMsg }}
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="btn-secondary">Bekor qilish</button>
              <button type="submit" [disabled]="isSaving || isUploading" class="btn-primary">
                <span *ngIf="!isSaving">{{ isEditMode ? 'Saqlash' : "Qo'shish" }}</span>
                <span *ngIf="isSaving">Saqlanmoqda...</span>
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
            <p>Bu brandni o'chirmoqchimisiz? Undagi mahsulotlar ham ta'sirlanishi mumkin!</p>
          </div>
          <div class="modal-actions confirm-actions">
            <button (click)="closeConfirmModal()" class="btn-secondary">Bekor qilish</button>
            <button (click)="confirmDelete()" class="btn-primary btn-danger">O'chirish</button>
          </div>
        </div>
      </div>

      <!-- Material Snackbar Toast -->
      <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToast">
        <div class="mat-snack-icon">
          <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <span class="mat-snack-text">{{ toastMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .brands-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .brand-thumb {
      width: 52px;
      height: 52px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.05);
      padding: 4px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }

    .stats-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 2rem;
      gap: 0.25rem;
      min-width: 160px;
    }

    .stat-chip-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    .stat-chip-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
      line-height: 1;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      margin-bottom: 2rem;
    }

    .search-icon {
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .search-field {
      flex: 1;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      box-shadow: none !important;
    }

    .search-field:focus {
      border: none !important;
      box-shadow: none !important;
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
      border: 3px dashed #a855f7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .brand-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      text-align: center;
      transition: var(--transition-smooth);
    }

    .brand-card:hover {
      transform: translateY(-4px);
      border-color: rgba(168, 85, 247, 0.3);
      box-shadow: 0 12px 35px rgba(168, 85, 247, 0.15);
    }

    .brand-card-img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-color: #fff;
      border: 2px solid rgba(168, 85, 247, 0.2);
    }

    .brand-card-info h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }

    .brand-id {
      font-size: 0.75rem;
      color: var(--text-secondary);
      opacity: 0.5;
      font-weight: 600;
    }

    .brand-timestamps {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .timestamp-row {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.7rem;
      color: var(--text-secondary);
    }
    .timestamp-row svg {
      opacity: 0.7;
    }

    .brand-card-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      width: 100%;
      border-top: 1px solid var(--glass-border);
      padding-top: 1rem;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-edit { color: #a855f7; }
    .btn-edit:hover { background: rgba(168, 85, 247, 0.1); border-color: #a855f7; }

    .btn-delete { color: var(--danger-color); }
    .btn-delete:hover { background: rgba(239, 68, 68, 0.1); border-color: var(--danger-color); }

    .empty-state {
      grid-column: 1 / -1;
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--text-secondary);
    }

    .empty-state svg { opacity: 0.3; }

    .empty-state h3 {
      font-size: 1.3rem;
      color: var(--text-primary);
    }

    .empty-state p {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 50px 1rem 1rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      width: 90%;
      max-width: 550px;
      padding: 2.5rem;
      border-radius: var(--border-radius-lg);
      max-height: 90vh;
      overflow-y: auto;
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      backdrop-filter: none !important;
    }

    :host-context([data-theme="dark"]) .modal-card {
      background: #0b0e14 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: none !important;
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--danger-color);
      font-size: 0.875rem;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: 0.75rem 1rem;
      border-radius: 8px;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
    /* Material Snackbar Toast */
    .mat-snackbar {
      position: fixed;
      top: 1.5rem;
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
      animation: snackSlideDown 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .snack-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }
    .snack-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.4);  color: #f87171; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideDown {
      from { opacity: 0; transform: translate(-50%, -30px); }
      to   { opacity: 1; transform: translate(-50%, 0); }
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
      .header-actions { flex-direction: column; align-items: stretch; }
      .brands-grid { grid-template-columns: 1fr; }
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
      object-fit: contain;
      min-height: 160px;
      max-height: 200px;
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
      color: #a855f7;
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
export class BrandsComponent implements OnInit {
  @ViewChild('brandFileInput') brandFileInput!: ElementRef<HTMLInputElement>;
  
  brands: any[] = [];
  filteredBrands: any[] = [];
  searchTerm = '';
  isLoading = true;
  showModal = false;
  isEditMode = false;
  isSaving = false;
  editingId: number | null = null;
  errorMsg = '';
  showToast = false;
  
  showConfirmModal = false;
  brandToDelete: number | null = null;
  toastMessage = '';
  toastType: 'snack-success' | 'snack-error' = 'snack-success';
  private toastTimer: any;

  form = {
    name: '',
    imageUrl: ''
  };

  imagePreviewUrl: string | null = null;
  isUploading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  Math = Math;
  get totalPages(): number {
    return Math.ceil(this.filteredBrands.length / this.pageSize);
  }
  get pagedBrands(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBrands.slice(start, start + this.pageSize);
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

  constructor(private brandService: BrandService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.filteredBrands = brands;
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filterBrands(): void {
    this.currentPage = 1;
    if (!this.searchTerm) {
      this.filteredBrands = this.brands;
      return;
    }
    const q = this.searchTerm.toLowerCase();
    this.filteredBrands = this.brands.filter(b =>
      b.name.toLowerCase().includes(q)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = { name: '', imageUrl: '' };
    this.errorMsg = '';
    this.imagePreviewUrl = null;
    this.showModal = true;
  }

  openEditModal(brand: any): void {
    this.isEditMode = true;
    this.editingId = brand.id;
    this.form = { name: brand.name, imageUrl: brand.imageUrl || '' };
    this.errorMsg = '';
    this.imagePreviewUrl = brand.imageUrl || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.imagePreviewUrl = null;
  }

  triggerFileInput(): void {
    if (this.brandFileInput && this.brandFileInput.nativeElement) {
      this.brandFileInput.nativeElement.value = '';
      this.brandFileInput.nativeElement.click();
    } else {
      const input = document.querySelector('.file-input-hidden') as HTMLInputElement;
      if (input) {
        input.value = '';
        input.click();
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Upload to backend
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:8080/api/upload/image', formData).subscribe({
      next: (res) => {
        this.form.imageUrl = res.imageUrl;
        this.isUploading = false;
        this.triggerToast('Rasm yuklandi!', 'snack-success');
      },
      error: () => {
        this.isUploading = false;
        this.triggerToast('Rasmni yuklashda xatolik!', 'snack-error');
      }
    });
  }

  saveBrand(): void {
    if (!this.form.name.trim()) {
      this.errorMsg = 'Brand nomi bo\'sh bo\'lishi mumkin emas!';
      return;
    }

    this.isSaving = true;
    this.errorMsg = '';

    if (this.isEditMode && this.editingId) {
      const payload = { name: this.form.name.trim(), imageUrl: this.form.imageUrl.trim() };
      this.brandService.updateBrand(this.editingId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadBrands();
          this.triggerToast('Brand muvaffaqiyatli yangilandi!', 'snack-success');
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMsg = err.error?.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
        }
      });
    } else {
      // Add mode - split by comma to allow bulk addition
      const names = this.form.name.split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0);

      if (names.length === 0) {
        this.isSaving = false;
        this.errorMsg = 'Brand nomlari noto\'g\'ri formatda!';
        return;
      }

      const requests = names.map(name => {
        const payload = {
          name: name,
          imageUrl: this.form.imageUrl.trim()
        };
        return this.brandService.createBrand(payload);
      });

      forkJoin(requests).subscribe({
        next: (results) => {
          this.isSaving = false;
          this.closeModal();
          this.loadBrands();
          const message = names.length > 1 
            ? `${names.length} ta yangi brand muvaffaqiyatli qo'shildi!` 
            : "Yangi brand qo'shildi!";
          this.triggerToast(message, 'snack-success');
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMsg = err.error?.message || "Brandlarni qo'shishda xatolik yuz berdi. Qayta urinib ko'ring.";
        }
      });
    }
  }

  deleteBrand(id: number): void {
    this.brandToDelete = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.brandToDelete = null;
  }

  confirmDelete(): void {
    if (!this.brandToDelete) return;
    this.brandService.deleteBrand(this.brandToDelete).subscribe({
      next: () => {
        this.loadBrands();
        this.triggerToast('Brand muvaffaqiyatli o\'chirildi!', 'snack-success');
        this.closeConfirmModal();
      },
      error: (err) => {
        this.triggerToast(err.error?.message || 'O\'chirishda xatolik!', 'snack-error');
        this.closeConfirmModal();
      }
    });
  }

  triggerToast(message: string, type: 'snack-success' | 'snack-error' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    this.toastTimer = setTimeout(() => this.showToast = false, 3000);
  }

  deleteAllBrands(): void {
    if (confirm("Rostdan ham BARCHA brandlarni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!")) {
      this.brandService.deleteAllBrands().subscribe({
        next: () => {
          this.loadBrands();
          this.triggerToast("Barcha brandlar muvaffaqiyatli o'chirildi!", "snack-success");
        },
        error: (err) => {
          this.triggerToast(err.error?.message || "O'chirishda xatolik yuz berdi! (Avval mahsulotlarni o'chirib ko'ring)", "snack-error");
        }
      });
    }
  }
}
