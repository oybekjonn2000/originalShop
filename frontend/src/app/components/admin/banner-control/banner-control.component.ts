import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryBannerService, CategoryBanner } from '../../../services/category-banner.service';
import { ProductService } from '../../../services/product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-banner-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel fade-in-el">
      <div class="admin-header">
        <h2 class="admin-title">Kategoriya Bannerlarini Boshqarish</h2>
        <button *ngIf="!showForm" (click)="openAddMode()" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Yangi Banner Qo'shish
        </button>
      </div>
      
      <!-- Banner Form Card (Collapsible) -->
      <div class="admin-card" *ngIf="showForm">
        <h3>{{ isEditMode ? 'Bannerni Tahrirlash' : 'Yangi Banner Qo\'shish' }}</h3>
        <form (ngSubmit)="onSubmit()" #bannerForm="ngForm" class="banner-form">
          
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="glass-label">Kategoriya</label>
              <select name="categoryId" [(ngModel)]="newBanner.categoryId" class="glass-input" required>
                <option value="" disabled selected>Kategoriyani tanlang...</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div class="form-group flex-1">
              <label class="glass-label">Ko'rsatish tartibi (Display Order)</label>
              <input type="number" name="displayOrder" [(ngModel)]="newBanner.displayOrder" class="glass-input" required min="1" />
            </div>
          </div>

          <div class="form-group">
            <label class="glass-label">Collage Rasmlar (Kamida 2 ta rasm tavsiya etiladi)</label>
            
            <!-- Multi-Image Upload Grid (Same as Products component) -->
            <div class="multi-image-grid">
              <div *ngFor="let imgUrl of allImageUrls; let idx = index" 
                   class="multi-image-item"
                   draggable="true"
                   (dragstart)="onDragStart(idx, $event)"
                   (dragover)="onDragOver(idx, $event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop(idx, $event)"
                   (dragend)="onDragEnd()"
                   [class.dragging]="dragIndex === idx"
                   [class.drag-over]="dragOverIndex === idx">
                <img [src]="imgUrl" alt="Banner Image" />
                <span *ngIf="idx === 0" class="main-badge">Asosiy</span>
                <button type="button" class="remove-img-btn" (click)="removeImage(idx, $event)" title="Rasmni o'chirish">
                  ✕
                </button>
                <div class="drag-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
                </div>
              </div>

              <div *ngIf="allImageUrls.length < 10" class="add-image-btn" (click)="triggerFileInput()">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Rasm qo'shish</span>
              </div>
            </div>

            <!-- Hidden input file -->
            <input type="file" class="file-input-hidden" (change)="onFilesSelected($event)" accept="image/*" multiple style="display: none;" />

            <div *ngIf="uploading" class="upload-progress">
              <div class="upload-spinner"></div>
              <span>Yuklanmoqda... ({{ uploadedCount }} / {{ totalFiles }})</span>
            </div>
            
            <p class="image-count-hint">Qo'shilgan rasmlar: {{ allImageUrls.length }} ta. Rasmlarni sudrab (Drag & Drop) tartibini o'zgartirishingiz mumkin.</p>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="!bannerForm.form.valid || (!allImageUrls.length) || uploading" class="btn-primary">
              {{ isEditMode ? 'Yangilash' : 'Saqlash' }}
            </button>
            <button type="button" (click)="cancelEdit()" class="btn-secondary">
              Bekor qilish
            </button>
          </div>
        </form>
      </div>

      <!-- Banners Table Card -->
      <div class="admin-card mt-4">
        <h3>Mavjud Bannerlar</h3>
        <div class="glass-table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th style="width: 100px;">Tartib</th>
                <th>Kategoriya</th>
                <th>Kollaj Rasmlari</th>
                <th style="width: 200px; text-align: center;">Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let banner of banners" class="banner-row">
                <td class="display-order-cell">
                  <span class="order-badge">{{ banner.displayOrder }}</span>
                </td>
                <td class="category-name-cell">{{ banner.categoryName }}</td>
                <td>
                  <div class="banner-collage-preview">
                    <div class="collage-preview-item" *ngFor="let url of banner.imageUrls?.slice(0, 4)">
                      <img [src]="url" alt="Banner preview" />
                    </div>
                    <div class="collage-preview-item" *ngIf="(!banner.imageUrls || banner.imageUrls.length === 0) && banner.imageUrl">
                      <img [src]="banner.imageUrl" alt="Banner preview" />
                    </div>
                    <span class="more-images-badge" *ngIf="banner.imageUrls && banner.imageUrls.length > 4">
                      +{{ banner.imageUrls.length - 4 }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="actions-cell">
                    <button (click)="editBanner(banner)" class="btn-action edit" title="Tahrirlash">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>
                      Tahrirlash
                    </button>
                    <button (click)="deleteBanner(banner.id!)" class="btn-action delete" title="O'chirish">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      O'chirish
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="banners.length === 0">
                <td colspan="4" class="empty-table-cell">Hozircha kategoriya bannerlari qo'shilmagan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel {
      padding: 1.5rem;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .admin-title {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
    }
    .admin-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius-md);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .mt-4 {
      margin-top: 1.5rem;
    }
    .banner-form {
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
      gap: 0.5rem;
    }
    .flex-1 { flex: 1; }
    
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 0.5rem;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }

    /* Multi-Image Upload Grid */
    .multi-image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
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
      cursor: grab;
      transition: transform 0.18s ease, border-color 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
    }

    .multi-image-item:active { cursor: grabbing; }

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
      z-index: 2;
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
      z-index: 2;
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

    /* Table Preview Styles */
    .banner-row:hover {
      background: rgba(255, 255, 255, 0.01);
    }
    .order-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(79, 172, 254, 0.15);
      color: var(--primary-color);
      font-weight: 700;
      font-size: 0.9rem;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(79, 172, 254, 0.25);
    }
    .category-name-cell {
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-primary);
    }
    .banner-collage-preview {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .collage-preview-item {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.02);
    }
    .collage-preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .more-images-badge {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--glass-border);
    }
    .actions-cell {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0.45rem 0.85rem;
      font-size: 0.82rem;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .btn-action.edit {
      background: rgba(79, 172, 254, 0.12);
      color: var(--primary-color);
      border: 1px solid rgba(79, 172, 254, 0.2);
    }
    .btn-action.edit:hover {
      background: var(--primary-gradient);
      color: #04080f;
      box-shadow: 0 0 10px var(--primary-glow);
      border-color: transparent;
      transform: translateY(-1px);
    }
    .btn-action.delete {
      background: rgba(239, 68, 68, 0.12);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-action.delete:hover {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.35);
      border-color: transparent;
      transform: translateY(-1px);
    }
    .empty-table-cell {
      text-align: center;
      padding: 2.5rem !important;
      color: var(--text-secondary);
      font-style: italic;
    }
    @media (max-width: 640px) {
      .form-row { flex-direction: column; gap: 1.25rem; }
    }
  `]
})
export class BannerControlComponent implements OnInit {
  banners: CategoryBanner[] = [];
  categories: any[] = [];

  newBanner: Partial<CategoryBanner> = {
    categoryId: undefined,
    imageUrl: '',
    imageUrls: [],
    displayOrder: 1
  };

  allImageUrls: string[] = [];

  showForm = false;
  uploading = false;
  uploadedCount = 0;
  totalFiles = 0;

  isEditMode = false;
  editingBannerId: number | null = null;

  // Drag & Drop
  dragIndex: number | null = null;
  dragOverIndex: number | null = null;

  constructor(
    private bannerService: CategoryBannerService,
    private productService: ProductService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadBanners();
    this.loadCategories();
  }

  loadBanners(): void {
    this.bannerService.getAllBanners().subscribe(res => {
      this.banners = res;
      if (!this.isEditMode) {
        this.newBanner.displayOrder = res.length > 0 ? Math.max(...res.map(b => b.displayOrder)) + 1 : 1;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  openAddMode(): void {
    this.isEditMode = false;
    this.editingBannerId = null;
    this.allImageUrls = [];
    this.newBanner = {
      categoryId: undefined,
      imageUrl: '',
      imageUrls: [],
      displayOrder: this.banners.length > 0 ? Math.max(...this.banners.map(b => b.displayOrder)) + 1 : 1
    };
    this.showForm = true;
  }

  triggerFileInput(): void {
    const input = document.querySelector('.file-input-hidden') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  onFilesSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const remaining = 10 - this.allImageUrls.length;
    if (remaining <= 0) {
      alert("Maksimum 10 ta rasm qo'shish mumkin!");
      return;
    }

    const filesToUpload = Array.from(input.files).slice(0, remaining);
    this.uploading = true;
    this.totalFiles = filesToUpload.length;
    this.uploadedCount = 0;

    const uploadPromises = filesToUpload.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      return new Promise<string>((resolve, reject) => {
        this.http.post<any>(`http://localhost:8080/api/upload/image`, formData)
          .subscribe({
            next: (res: any) => {
              this.uploadedCount++;
              resolve(res.imageUrl);
            },
            error: (err) => reject(err)
          });
      });
    });

    Promise.all(uploadPromises)
      .then(urls => {
        this.allImageUrls = [...this.allImageUrls, ...urls];
        this.syncFormImages();
        this.uploading = false;
      })
      .catch(err => {
        console.error('Upload failed', err);
        this.uploading = false;
        alert('Rasmlarni yuklashda xatolik yuz berdi.');
      });
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation();
    this.allImageUrls.splice(index, 1);
    this.syncFormImages();
  }

  syncFormImages(): void {
    if (this.allImageUrls.length > 0) {
      this.newBanner.imageUrl = this.allImageUrls[0];
      this.newBanner.imageUrls = [...this.allImageUrls];
    } else {
      this.newBanner.imageUrl = '';
      this.newBanner.imageUrls = [];
    }
  }

  // --- Drag & Drop ---
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

    const moved = this.allImageUrls.splice(this.dragIndex, 1)[0];
    this.allImageUrls.splice(targetIndex, 0, moved);
    this.syncFormImages();

    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  onDragEnd(): void {
    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  editBanner(banner: CategoryBanner): void {
    this.isEditMode = true;
    this.editingBannerId = banner.id!;
    this.allImageUrls = banner.imageUrls ? [...banner.imageUrls] : (banner.imageUrl ? [banner.imageUrl] : []);
    this.newBanner = {
      categoryId: banner.categoryId,
      imageUrl: banner.imageUrl,
      imageUrls: [...this.allImageUrls],
      displayOrder: banner.displayOrder
    };
    this.showForm = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingBannerId = null;
    this.allImageUrls = [];
    this.newBanner = {
      categoryId: undefined,
      imageUrl: '',
      imageUrls: [],
      displayOrder: this.banners.length > 0 ? Math.max(...this.banners.map(b => b.displayOrder)) + 1 : 1
    };
    this.showForm = false;
  }

  onSubmit(): void {
    if (!this.newBanner.categoryId || !this.newBanner.imageUrl) return;

    const request$ = this.isEditMode && this.editingBannerId
      ? this.bannerService.updateBanner(this.editingBannerId, this.newBanner)
      : this.bannerService.createBanner(this.newBanner);

    request$.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Banner yangilandi!' : 'Banner saqlandi!');
        this.isEditMode = false;
        this.editingBannerId = null;
        this.allImageUrls = [];
        this.showForm = false;
        this.loadBanners();
      },
      error: (err) => {
        alert(err.error?.message || 'Banner saqlashda xatolik yuz berdi!');
      }
    });
  }

  deleteBanner(id: number): void {
    if (confirm('Rostdan ham ushbu bannerni ochirmoqchimisiz?')) {
      this.bannerService.deleteBanner(id).subscribe({
        next: () => this.loadBanners(),
        error: () => alert('Ochirishda xatolik!')
      });
    }
  }
}
