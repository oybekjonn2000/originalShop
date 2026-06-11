import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-child-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="categories-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Child Kategoriyalar Boshqaruvi</h1>
          <p class="subtitle">Mahsulot child kategoriyalarini yaratish, tahrirlash va o'chirish</p>
        </div>
        <div class="header-actions">
          <a routerLink="/admin" class="btn-secondary back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Orqaga
          </a>
          <button (click)="openAddModal()" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Yangi Child Kategoriya
          </button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="stats-row">
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label">Jami Child Kategoriyalar</span>
          <span class="stat-chip-value">{{ childCategories.length }}</span>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="filter-bar glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterChildCategories()"
          placeholder="Child kategoriya nomi bo'yicha qidiring..."
          class="glass-input search-field"
        />
        <select [(ngModel)]="filterCategoryId" (change)="onFilterCategoryChange()" class="glass-input filter-select">
          <option [ngValue]="null">Barcha kategoriyalar</option>
          <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
        </select>
        <select [(ngModel)]="filterSubcategoryId" (change)="filterChildCategories()" class="glass-input filter-select" [disabled]="filterCategoryId === null">
          <option [ngValue]="null">Barcha subkategoriyalar</option>
          <option *ngFor="let sub of filteredFilterSubcategories" [ngValue]="sub.id">{{ sub.name }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Child kategoriyalar yuklanmoqda...</p>
      </div>

      <!-- Child Categories Table -->
      <div *ngIf="!isLoading" class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Child Kategoriya Nomi</th>
              <th>Kategoriya & Subkategoriya</th>
              <th>Tavsif</th>
              <th>Vaqt</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let child of pagedChildCategories">
              <td>{{ child.id }}</td>
              <td><strong>{{ child.name }}</strong></td>
              <td>
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <span style="font-size:0.75rem;color:var(--text-secondary);">
                    {{ child.subcategory?.category?.name || '—' }}
                  </span>
                  <span>{{ child.subcategory?.name || '—' }}</span>
                </div>
              </td>
              <td>
                <span *ngIf="child.description; else noDesc">{{ child.description }}</span>
                <ng-template #noDesc><span class="no-desc">Tavsif kiritilmagan</span></ng-template>
              </td>
              <td class="time-col">
                <div class="time-container" *ngIf="child.createdAt">
                  <div class="time-row" title="Yaratilgan vaqt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{{ child.createdAt | date:'short' }}</span>
                  </div>
                  <div class="time-row" title="Oxirgi tahrir" *ngIf="child.updatedAt && child.updatedAt !== child.createdAt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span>{{ child.updatedAt | date:'short' }}</span>
                  </div>
                </div>
              </td>
              <td class="actions-col">
                <button (click)="openEditModal(child)" class="btn-icon btn-edit" title="Tahrirlash">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button (click)="deleteChildCategory(child.id)" class="btn-icon btn-delete" title="O'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredChildCategories.length === 0">
              <td colspan="6" class="empty-row">Child kategoriyalar topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mat-paginator" *ngIf="filteredChildCategories.length > pageSize">
        <div class="mat-paginator-container">
          <div class="mat-paginator-range-label">
            {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, filteredChildCategories.length) }} / {{ filteredChildCategories.length }}
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
            <h2>{{ isEditMode ? 'Child kategoriyani tahrirlash' : "Yangi child kategoriya qo'shish" }}</h2>
            <button (click)="closeModal()" class="btn-close">✕</button>
          </div>

          <form (ngSubmit)="saveChildCategory()" class="modal-form">
            <div class="form-group">
              <label class="glass-label">Asosiy Kategoriya *</label>
              <select [(ngModel)]="form.categoryId" name="categoryId" class="glass-input" required (change)="onModalCategoryChange()">
                <option [ngValue]="null" disabled>Kategoriyani tanlang</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="glass-label">Subkategoriya *</label>
              <select [(ngModel)]="form.subcategoryId" name="subcategoryId" class="glass-input" required [disabled]="!form.categoryId">
                <option [ngValue]="null" disabled>{{ form.categoryId ? 'Subkategoriyani tanlang' : 'Avval kategoriya tanlang' }}</option>
                <option *ngFor="let sub of filteredModalSubcategories" [ngValue]="sub.id">{{ sub.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="glass-label">Child Kategoriya nomi *</label>
              <input
                type="text"
                [(ngModel)]="form.name"
                name="name"
                class="glass-input"
                required
                placeholder="Masalan: Apple smartfonlar, O'yin noutbuklari..."
              />
            </div>

            <div class="form-group">
              <label class="glass-label">Tavsif (ixtiyoriy)</label>
              <textarea
                [(ngModel)]="form.description"
                name="description"
                class="glass-input"
                rows="3"
                placeholder="Child kategoriya haqida qisqacha ma'lumot..."
              ></textarea>
            </div>

            <div *ngIf="errorMsg" class="error-msg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ errorMsg }}
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="btn-secondary">Bekor qilish</button>
              <button type="submit" [disabled]="isSaving" class="btn-primary">
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
            <p>Bu child kategoriyani o'chirmoqchimisiz? Undagi mahsulotlar ham ta'sirlanishi mumkin!</p>
          </div>
          <div class="modal-actions confirm-actions">
            <button (click)="closeConfirmModal()" class="btn-secondary">Bekor qilish</button>
            <button (click)="confirmDelete()" class="btn-primary btn-danger">O'chirish</button>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToast">
        <div class="mat-snack-icon">
          <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <span class="mat-snack-text">{{ toastMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .categories-container { max-width: 1400px; margin: 0 auto; padding: 0 1rem; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .page-header h1 { font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.25rem; }
    .subtitle { color: var(--text-secondary); font-size: 0.95rem; }
    .header-actions { display: flex; gap: 0.75rem; align-items: center; }
    .back-btn { display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; padding: 0.6rem 1rem; font-size: 0.9rem; }
    .stats-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat-chip { display: flex; flex-direction: column; align-items: center; padding: 1rem 2rem; gap: 0.25rem; min-width: 160px; }
    .stat-chip-label { font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
    .stat-chip-value { font-size: 2rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-heading); line-height: 1; }
    .filter-bar { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.25rem; margin-bottom: 2rem; }
    .search-icon { color: var(--text-secondary); flex-shrink: 0; }
    .search-field { flex: 1; border: none !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; }
    .search-field:focus { border: none !important; box-shadow: none !important; }
    .filter-select { width: 200px; border-radius: 8px; padding: 0.5rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 0; color: var(--text-secondary); }
    .spinner { width: 40px; height: 40px; border: 3px dashed #a855f7; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .category-card { padding: 1.75rem; display: flex; flex-direction: column; gap: 1rem; position: relative; transition: var(--transition-smooth); }
    .category-card:hover { transform: translateY(-4px); border-color: rgba(168, 85, 247, 0.3); box-shadow: 0 12px 35px rgba(168, 85, 247, 0.15); }
    .category-card-icon { width: 54px; height: 54px; border-radius: 14px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.1)); border: 1px solid rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: center; color: #a855f7; }
    .category-card-info { flex: 1; }
    .category-card-info h3 { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem; }
    .parent-category { font-size: 0.85rem; color: var(--primary-color); margin-bottom: 0.2rem; display: block;}
    .category-card-info p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.5rem; }
    .no-desc { font-style: italic; opacity: 0.6; }
    .category-id { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.5; font-weight: 600; }
    
    .category-timestamps {
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

    .category-card-actions { display: flex; gap: 0.5rem; justify-content: flex-end; border-top: 1px solid var(--glass-border); padding-top: 1rem; }
    .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition-smooth); }
    .btn-edit { color: #a855f7; } .btn-edit:hover { background: rgba(168, 85, 247, 0.1); border-color: #a855f7; }
    .btn-delete { color: var(--danger-color); } .btn-delete:hover { background: rgba(239, 68, 68, 0.1); border-color: var(--danger-color); }
    .empty-state { grid-column: 1 / -1; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary); }
    .empty-state svg { opacity: 0.3; } .empty-state h3 { font-size: 1.3rem; color: var(--text-primary); } .empty-state p { font-size: 0.95rem; margin-bottom: 0.5rem; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 50px 1rem 1rem; animation: fadeIn 0.2s ease; }
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
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
    .modal-header h2 { font-size: 1.4rem; font-weight: 700; }
    .btn-close { background: none; border: none; color: var(--text-secondary); font-size: 1.2rem; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition-smooth); }
    .btn-close:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
    .modal-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .error-msg { display: flex; align-items: center; gap: 0.5rem; color: var(--danger-color); font-size: 0.875rem; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.75rem 1rem; border-radius: 8px; }
    
    .mat-snackbar { position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%); min-width: 300px; max-width: 480px; padding: 0.9rem 1.4rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; font-size: 0.9rem; backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0,0,0,0.35); z-index: 99999; animation: snackSlideDown 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
    .snack-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }
    .snack-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.4);  color: #f87171; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; } .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideDown { from { opacity: 0; transform: translate(-50%, -30px); } to { opacity: 1; transform: translate(-50%, 0); } }

    .confirm-modal { max-width: 400px; padding: 2rem; text-align: center; }
    .confirm-header { flex-direction: column; border-bottom: none; padding-bottom: 0; margin-bottom: 1rem; gap: 1rem; }
    .confirm-icon-wrap { width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; color: var(--danger-color); margin: 0 auto; }
    .confirm-body p { color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5; }
    .confirm-actions { justify-content: center; gap: 1rem; }
    .btn-danger { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important; border: none !important; }
    .btn-danger:hover { background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important; box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important; transform: translateY(-2px); }
    @media (max-width: 640px) { .header-actions { flex-direction: column; align-items: stretch; } .categories-grid { grid-template-columns: 1fr; } }
  `]
})
export class ChildCategoriesComponent implements OnInit {
  categories: any[] = [];
  subcategories: any[] = [];
  childCategories: any[] = [];
  filteredChildCategories: any[] = [];
  filteredFilterSubcategories: any[] = [];
  filteredModalSubcategories: any[] = [];

  searchTerm = '';
  filterCategoryId: number | null = null;
  filterSubcategoryId: number | null = null;
  isLoading = true;
  showModal = false;
  isEditMode = false;
  isSaving = false;
  editingId: number | null = null;
  errorMsg = '';
  showToast = false;
  
  showConfirmModal = false;
  itemToDelete: number | null = null;
  toastMessage = '';
  toastType: 'snack-success' | 'snack-error' = 'snack-success';
  private toastTimer: any;

  form = {
    name: '',
    description: '',
    categoryId: null as number | null,
    subcategoryId: null as number | null
  };

  // Pagination
  currentPage = 1;
  pageSize = 10;
  Math = Math;
  get totalPages(): number {
    return Math.ceil(this.filteredChildCategories.length / this.pageSize);
  }
  get pagedChildCategories(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredChildCategories.slice(start, start + this.pageSize);
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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.productService.getSubcategories().subscribe(subs => {
        this.subcategories = subs;
        this.productService.getChildCategories().subscribe({
          next: (children) => {
            this.childCategories = children;
            this.filterChildCategories();
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      });
    });
  }

  onFilterCategoryChange(): void {
    this.filterSubcategoryId = null;
    this.filteredFilterSubcategories = [];
    if (this.filterCategoryId !== null) {
      this.productService.getSubcategoriesByCategory(this.filterCategoryId).subscribe({
        next: (data) => {
          this.filteredFilterSubcategories = data;
          this.filterChildCategories();
        }
      });
    } else {
      this.filterChildCategories();
    }
  }

  filterChildCategories(): void {
    this.currentPage = 1;
    const q = this.searchTerm.toLowerCase();
    this.filteredChildCategories = this.childCategories.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q));
      const matchCat = this.filterCategoryId === null || c.subcategory?.category?.id === this.filterCategoryId;
      const matchSub = this.filterSubcategoryId === null || c.subcategory?.id === this.filterSubcategoryId;
      return matchSearch && matchCat && matchSub;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = { name: '', description: '', categoryId: null, subcategoryId: null };
    this.filteredModalSubcategories = [];
    this.errorMsg = '';
    this.showModal = true;
  }

  openEditModal(child: any): void {
    this.isEditMode = true;
    this.editingId = child.id;
    this.form = {
      name: child.name,
      description: child.description || '',
      categoryId: child.subcategory?.category?.id || null,
      subcategoryId: child.subcategory?.id || null
    };
    this.filteredModalSubcategories = [];
    if (this.form.categoryId) {
      this.productService.getSubcategoriesByCategory(this.form.categoryId).subscribe({
        next: (data) => {
          this.filteredModalSubcategories = data;
        }
      });
    }
    this.errorMsg = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onModalCategoryChange(): void {
    this.form.subcategoryId = null;
    this.filteredModalSubcategories = [];
    if (this.form.categoryId) {
      this.productService.getSubcategoriesByCategory(this.form.categoryId).subscribe({
        next: (data) => {
          this.filteredModalSubcategories = data;
        }
      });
    }
  }

  saveChildCategory(): void {
    if (!this.form.name.trim() || !this.form.subcategoryId) {
      this.errorMsg = 'Nomi va Subkategoriya tanlanishi majburiy!';
      return;
    }

    this.isSaving = true;
    this.errorMsg = '';

    const payload = { 
      name: this.form.name.trim(), 
      description: this.form.description.trim(),
      subcategory: { id: this.form.subcategoryId }
    };

    const request$ = this.isEditMode && this.editingId
      ? this.productService.updateChildCategory(this.editingId, payload)
      : this.productService.createChildCategory(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadAll();
        this.triggerToast(this.isEditMode ? 'Child kategoriya muvaffaqiyatli yangilandi!' : "Yangi child kategoriya qo'shildi!", 'snack-success');
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || "Xatolik yuz berdi. Qayta urinib ko'ring.";
      }
    });
  }

  deleteChildCategory(id: number): void {
    this.itemToDelete = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;
    this.productService.deleteChildCategory(this.itemToDelete).subscribe({
      next: () => {
        this.loadAll();
        this.triggerToast("Child kategoriya muvaffaqiyatli o'chirildi!", 'snack-success');
        this.closeConfirmModal();
      },
      error: (err) => {
        this.triggerToast(err.error?.message || "O'chirishda xatolik!", 'snack-error');
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
}
