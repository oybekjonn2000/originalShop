import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-subcategories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="categories-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Subkategoriyalar Boshqaruvi</h1>
          <p class="subtitle">Mahsulot subkategoriyalarini yaratish, tahrirlash va o'chirish</p>
        </div>
        <div class="header-actions">
          <a routerLink="/admin" class="btn-secondary back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Orqaga
          </a>
          <button (click)="openAddModal()" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Yangi Subkategoriya
          </button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="stats-row">
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label">Jami Subkategoriyalar</span>
          <span class="stat-chip-value">{{ subcategories.length }}</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="filter-bar glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterSubcategories()"
          placeholder="Subkategoriya nomi bo'yicha qidiring..."
          class="glass-input search-field"
        />
        <select [(ngModel)]="filterCategoryId" (change)="filterSubcategories()" class="glass-input filter-select">
          <option [ngValue]="null">Barcha kategoriyalar</option>
          <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Subkategoriyalar yuklanmoqda...</p>
      </div>

      <!-- Subcategories Grid -->
      <div *ngIf="!isLoading" class="categories-grid">
        <div
          *ngFor="let sub of filteredSubcategories"
          class="category-card glass-panel"
        >
          <div class="category-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <div class="category-card-info">
            <h3>{{ sub.name }}</h3>
            <p class="parent-category">Kategoriya: <strong>{{ sub.category?.name }}</strong></p>
            <p *ngIf="sub.description; else noDesc">{{ sub.description }}</p>
            <ng-template #noDesc><p class="no-desc">Tavsif kiritilmagan</p></ng-template>
            <span class="category-id">ID: {{ sub.id }}</span>
          </div>
          <div class="category-card-actions">
            <button (click)="openEditModal(sub)" class="btn-icon btn-edit" title="Tahrirlash">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button (click)="deleteSubcategory(sub.id)" class="btn-icon btn-delete" title="O'chirish">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredSubcategories.length === 0" class="empty-state glass-panel">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <h3>Subkategoriyalar topilmadi</h3>
          <p>Yangi subkategoriya qo'shish uchun tugmani bosing.</p>
          <button (click)="openAddModal()" class="btn-primary">Yangi Subkategoriya</button>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ isEditMode ? 'Subkategoriyani tahrirlash' : "Yangi subkategoriya qo'shish" }}</h2>
            <button (click)="closeModal()" class="btn-close">✕</button>
          </div>

          <form (ngSubmit)="saveSubcategory()" class="modal-form">
            
            <div class="form-group">
              <label class="glass-label">Asosiy Kategoriya *</label>
              <select [(ngModel)]="form.categoryId" name="categoryId" class="glass-input" required>
                <option [ngValue]="null" disabled>Kategoriyani tanlang</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="glass-label">Subkategoriya nomi *</label>
              <input
                type="text"
                [(ngModel)]="form.name"
                name="name"
                class="glass-input"
                required
                placeholder="Masalan: Apple iPhone, Smart soatlar..."
              />
            </div>

            <div class="form-group">
              <label class="glass-label">Tavsif (ixtiyoriy)</label>
              <textarea
                [(ngModel)]="form.description"
                name="description"
                class="glass-input"
                rows="3"
                placeholder="Subkategoriya haqida qisqacha ma'lumot..."
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
            <p>Bu subkategoriyani o'chirmoqchimisiz? Undagi mahsulotlar ham ta'sirlanishi mumkin!</p>
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
    .parent-category { font-size: 0.85rem; color: var(--primary-color); margin-bottom: 0.5rem; display: block;}
    .category-card-info p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.5rem; }
    .no-desc { font-style: italic; opacity: 0.6; }
    .category-id { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.5; font-weight: 500; }
    .category-card-actions { display: flex; gap: 0.5rem; justify-content: flex-end; border-top: 1px solid var(--glass-border); padding-top: 1rem; }
    .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition-smooth); }
    .btn-edit { color: #a855f7; } .btn-edit:hover { background: rgba(168, 85, 247, 0.1); border-color: #a855f7; }
    .btn-delete { color: var(--danger-color); } .btn-delete:hover { background: rgba(239, 68, 68, 0.1); border-color: var(--danger-color); }
    .empty-state { grid-column: 1 / -1; padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary); }
    .empty-state svg { opacity: 0.3; } .empty-state h3 { font-size: 1.3rem; color: var(--text-primary); } .empty-state p { font-size: 0.95rem; margin-bottom: 0.5rem; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease; }
    .modal-card { width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 2.5rem; border-radius: var(--border-radius-lg); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
    .modal-header h2 { font-size: 1.4rem; font-weight: 700; }
    .btn-close { background: none; border: none; color: var(--text-secondary); font-size: 1.2rem; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition-smooth); }
    .btn-close:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
    .modal-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .error-msg { display: flex; align-items: center; gap: 0.5rem; color: var(--danger-color); font-size: 0.875rem; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.75rem 1rem; border-radius: 8px; }
    .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 0.5rem; }
    .mat-snackbar { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); min-width: 300px; max-width: 480px; padding: 0.9rem 1.4rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; font-size: 0.9rem; backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0,0,0,0.35); z-index: 99999; animation: snackSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
    .snack-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }
    .snack-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.4);  color: #f87171; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; } .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
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
export class SubcategoriesComponent implements OnInit {
  categories: any[] = [];
  subcategories: any[] = [];
  filteredSubcategories: any[] = [];
  searchTerm = '';
  filterCategoryId: number | null = null;
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
    categoryId: null as number | null
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.productService.getSubcategories().subscribe({
        next: (subs) => {
          this.subcategories = subs;
          this.filteredSubcategories = subs;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    });
  }

  filterSubcategories(): void {
    const q = this.searchTerm.toLowerCase();
    this.filteredSubcategories = this.subcategories.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
      const matchCat = this.filterCategoryId === null || s.category?.id === this.filterCategoryId;
      return matchSearch && matchCat;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.form = { name: '', description: '', categoryId: null };
    this.errorMsg = '';
    this.showModal = true;
  }

  openEditModal(sub: any): void {
    this.isEditMode = true;
    this.editingId = sub.id;
    this.form = { name: sub.name, description: sub.description || '', categoryId: sub.category?.id || null };
    this.errorMsg = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveSubcategory(): void {
    if (!this.form.name.trim() || !this.form.categoryId) {
      this.errorMsg = 'Nomi va Kategoriya tanlanishi majburiy!';
      return;
    }

    this.isSaving = true;
    this.errorMsg = '';

    const payload = { 
      name: this.form.name.trim(), 
      description: this.form.description.trim(),
      category: { id: this.form.categoryId }
    };

    const request$ = this.isEditMode && this.editingId
      ? this.productService.updateSubcategory(this.editingId, payload)
      : this.productService.createSubcategory(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadAll();
        this.triggerToast(this.isEditMode ? 'Subkategoriya muvaffaqiyatli yangilandi!' : "Yangi subkategoriya qo'shildi!", 'snack-success');
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMsg = err.error?.message || "Xatolik yuz berdi. Qayta urinib ko'ring.";
      }
    });
  }

  deleteSubcategory(id: number): void {
    this.itemToDelete = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;
    this.productService.deleteSubcategory(this.itemToDelete).subscribe({
      next: () => {
        this.loadAll();
        this.triggerToast("Subkategoriya muvaffaqiyatli o'chirildi!", 'snack-success');
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

  deleteAllSubcategories(): void {
    if (confirm("Rostdan ham BARCHA subkategoriyalarni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!")) {
      this.productService.deleteAllSubcategories().subscribe({
        next: () => {
          this.loadAll();
          this.triggerToast("Barcha subkategoriyalar muvaffaqiyatli o'chirildi!", "snack-success");
        },
        error: (err) => {
          this.triggerToast(err.error?.message || "O'chirishda xatolik yuz berdi! (Avval mahsulotlarni o'chirib ko'ring)", "snack-error");
        }
      });
    }
  }
}
