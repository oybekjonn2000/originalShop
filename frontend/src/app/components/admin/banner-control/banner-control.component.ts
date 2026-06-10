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
    <div class="admin-panel">
      <h2 class="admin-title">Kategoriya Bannerlarini Boshqarish</h2>
      
      <div class="admin-card">
        <h3>Yangi Banner Qo'shish</h3>
        <form (ngSubmit)="onSubmit()" #bannerForm="ngForm" class="banner-form">
          
          <div class="form-group">
            <label class="glass-label">Kategoriya</label>
            <select name="categoryId" [(ngModel)]="newBanner.categoryId" class="glass-input" required>
              <option value="" disabled selected>Kategoriyani tanlang...</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="glass-label">Collage Rasmlar (Kamida 2 ta rasm tanlang)</label>
            <input type="file" (change)="onFilesSelected($event)" class="glass-input" accept="image/*" multiple required />
            <div *ngIf="uploading" style="color: var(--primary-color); margin-top: 5px;">Rasmlar yuklanmoqda... ({{ uploadedCount }} / {{ totalFiles }})</div>
            <div *ngIf="newBanner.imageUrls && newBanner.imageUrls.length > 0" style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
              <img *ngFor="let url of newBanner.imageUrls" [src]="url" alt="Preview" style="height: 80px; border-radius: 8px; object-fit: cover;" />
            </div>
          </div>

          <div class="form-group">
            <label class="glass-label">Ko'rsatish tartibi (Display Order)</label>
            <input type="number" name="displayOrder" [(ngModel)]="newBanner.displayOrder" class="glass-input" required min="1" />
          </div>

          <button type="submit" [disabled]="!bannerForm.form.valid || (!newBanner.imageUrls?.length) || uploading" class="btn-primary">
            Saqlash
          </button>
        </form>
      </div>

      <div class="admin-card mt-4">
        <h3>Mavjud Bannerlar</h3>
        <div class="glass-table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Tartib</th>
                <th>Kategoriya</th>
                <th>Rasm</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let banner of banners">
                <td>{{ banner.displayOrder }}</td>
                <td>{{ banner.categoryName }}</td>
                <td>
                  <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <img *ngFor="let url of banner.imageUrls" [src]="url" alt="Banner" style="height: 40px; border-radius: 4px; object-fit: cover;" />
                    <img *ngIf="!banner.imageUrls?.length && banner.imageUrl" [src]="banner.imageUrl" alt="Banner" style="height: 40px; border-radius: 4px; object-fit: cover;" />
                  </div>
                </td>
                <td>
                  <button (click)="deleteBanner(banner.id!)" class="btn-danger" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">
                    O'chirish
                  </button>
                </td>
              </tr>
              <tr *ngIf="banners.length === 0">
                <td colspan="4" style="text-align: center;">Hozircha bannerlar qo'shilmagan.</td>
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
    .admin-title {
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
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
      max-width: 600px;
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

  uploading = false;
  uploadedCount = 0;
  totalFiles = 0;

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
      this.newBanner.displayOrder = res.length > 0 ? Math.max(...res.map(b => b.displayOrder)) + 1 : 1;
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploading = true;
      this.totalFiles = files.length;
      this.uploadedCount = 0;
      this.newBanner.imageUrls = [];
      this.newBanner.imageUrl = '';

      const uploadPromises = Array.from(files).map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return new Promise<string>((resolve, reject) => {
          this.http.post<{ url: string }>(`http://localhost:8080/api/upload`, formData, { responseType: 'text' as 'json' })
            .subscribe({
              next: (res: any) => {
                const url = typeof res === 'string' ? res : res.url;
                this.uploadedCount++;
                resolve(url);
              },
              error: (err) => reject(err)
            });
        });
      });

      Promise.all(uploadPromises)
        .then(urls => {
          this.newBanner.imageUrls = urls;
          this.newBanner.imageUrl = urls[0]; // fallback
          this.uploading = false;
        })
        .catch(err => {
          console.error('Upload failed', err);
          this.uploading = false;
          alert('Rasmlarni yuklashda xatolik yuz berdi.');
        });
    }
  }

  onSubmit(): void {
    if (!this.newBanner.categoryId || !this.newBanner.imageUrl) return;

    this.bannerService.createBanner(this.newBanner).subscribe({
      next: () => {
        alert('Banner saqlandi!');
        this.loadBanners();
        this.newBanner.imageUrl = '';
        this.newBanner.imageUrls = [];
        this.newBanner.categoryId = undefined;
        // input fayllarni tozalash (majburiy emas lekin UI uchun yaxshi)
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
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
