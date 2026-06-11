import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-reviews-container fade-in-el">
      <div class="page-header">
        <div>
          <h1>Sharhlar Boshqaruvi</h1>
          <p class="subtitle">Foydalanuvchilar tomonidan mahsulotlarga yozilgan sharhlar va baholarni boshqarish</p>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="filter-bar glass-panel">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterReviews()"
          placeholder="Foydalanuvchi ismi, mahsulot yoki sharh matni bo'yicha qidirish..."
          class="glass-input search-field"
        />
        <select [(ngModel)]="ratingFilter" (change)="filterReviews()" class="glass-input filter-select">
          <option [ngValue]="null">Barcha baholar</option>
          <option [ngValue]="5">5 yulduzli</option>
          <option [ngValue]="4">4 yulduzli</option>
          <option [ngValue]="3">3 yulduzli</option>
          <option [ngValue]="2">2 yulduzli</option>
          <option [ngValue]="1">1 yulduzli</option>
        </select>
      </div>

      <!-- Reviews Table -->
      <div class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mahsulot</th>
              <th>Foydalanuvchi</th>
              <th>Sharh</th>
              <th>Baholash</th>
              <th>Yozilgan sana</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let review of pagedReviews">
              <td><strong>#{{ review.id }}</strong></td>
              <td>
                <div class="product-cell">
                  <img *ngIf="review.product?.imageUrl" [src]="review.product.imageUrl" [alt]="review.product.name" class="product-thumb" />
                  <span class="product-name" [title]="review.product?.name">{{ review.product?.name }}</span>
                </div>
              </td>
              <td>
                <span class="username">{{ review.user?.username || review.user?.firstName || 'Mijoz' }}</span>
              </td>
              <td>
                <div class="comment-text" [title]="review.comment">{{ review.comment }}</div>
                <div *ngIf="review.replyText" class="reply-preview" style="margin-top: 4px; font-size: 0.8rem; color: #a855f7; display: flex; align-items: center; gap: 4px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span>Javob: {{ review.replyText }}</span>
                </div>
              </td>
              <td>
                <div class="stars">
                  <span *ngFor="let star of [1, 2, 3, 4, 5]" [class.filled]="review.rating >= star">★</span>
                </div>
              </td>
              <td class="time-col">
                {{ review.createdAt | date:'dd.MM.yyyy HH:mm' }}
              </td>
              <td class="actions-col">
                <button (click)="openReplyModal(review)" class="btn-icon" [style.color]="review.replyText ? '#a855f7' : 'var(--primary-color)'" [title]="review.replyText ? 'Javobni tahrirlash' : 'Javob yozish'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button *ngIf="review.replyText" (click)="deleteReply(review.id)" class="btn-icon" style="color: #fb7185;" title="Javobni o'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <button (click)="openConfirmDelete(review.id)" class="btn-icon btn-delete" title="Sharhni o'chirish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredReviews.length === 0">
              <td colspan="7" class="empty-row">Sharhlar topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mat-paginator" *ngIf="filteredReviews.length > pageSize">
        <div class="mat-paginator-container">
          <div class="mat-paginator-range-label">
            {{ (currentPage - 1) * pageSize + 1 }} – {{ Math.min(currentPage * pageSize, filteredReviews.length) }} / {{ filteredReviews.length }}
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

      <!-- Confirm Delete Modal -->
      <div class="modal-overlay" *ngIf="showConfirmModal" (click)="closeConfirmModal()">
        <div class="modal-card glass-panel confirm-modal" (click)="$event.stopPropagation()">
          <div class="modal-header confirm-header">
            <div class="confirm-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h2>Sharhni o'chirish</h2>
          </div>
          <div class="confirm-body">
            <p>Rostdan ham ushbu sharhni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>
          </div>
          <div class="modal-actions confirm-actions">
            <button (click)="closeConfirmModal()" class="btn-secondary">Bekor qilish</button>
            <button (click)="confirmDelete()" class="btn-primary btn-danger">O'chirish</button>
          </div>
        </div>
      </div>

      <!-- Reply Modal -->
      <div class="modal-overlay" *ngIf="showReplyModal" (click)="closeReplyModal()">
        <div class="modal-card glass-panel" (click)="$event.stopPropagation()" style="max-width: 500px; padding: 2rem;">
          <div class="modal-header">
            <h2>{{ selectedReview?.replyText ? 'Javobni tahrirlash' : 'Sharhga javob yozish' }}</h2>
            <button (click)="closeReplyModal()" class="btn-close" style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;">✕</button>
          </div>
          <div class="modal-body" style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
            <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:8px; border:1px solid var(--glass-border);">
              <span style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Mijoz sharhi:</span>
              <p style="margin: 0.5rem 0 0 0; font-size:0.92rem; color:var(--text-primary);">{{ selectedReview?.comment }}</p>
            </div>
            
            <div class="form-group">
              <label class="glass-label" style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.5rem; display:block;">Javob matni *</label>
              <textarea 
                [(ngModel)]="replyText" 
                name="replyText"
                class="glass-input" 
                rows="4" 
                placeholder="Foydalanuvchiga javobingizni yozing..."
                style="width: 100%; padding:0.75rem; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); color:var(--text-primary); resize:vertical;"
                required
              ></textarea>
            </div>
          </div>
          <div class="modal-actions" style="margin-top: 1.5rem; display:flex; gap:10px; justify-content:flex-end;">
            <button (click)="closeReplyModal()" class="btn-secondary">Bekor qilish</button>
            <button (click)="submitReply()" [disabled]="isSavingReply || !replyText.trim()" class="btn-primary">
              <span *ngIf="isSavingReply">Saqlanmoqda...</span>
              <span *ngIf="!isSavingReply">Javobni saqlash</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Snackbar Notification -->
      <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToastNotif">
        <div class="mat-snack-icon">
          <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <span class="mat-snack-text">{{ toastMsg }}</span>
      </div>
    </div>
  `,
  styles: [`
    .admin-reviews-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
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

    .product-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 280px;
    }

    .product-thumb {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(0,0,0,0.1);
      flex-shrink: 0;
    }

    .product-name {
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .username {
      font-weight: 500;
      color: var(--text-primary);
    }

    .comment-text {
      font-size: 0.9rem;
      color: var(--text-secondary);
      max-width: 380px;
      white-space: normal;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }

    .stars {
      color: #fbbf24;
      font-size: 1.05rem;
      white-space: nowrap;
    }

    .stars span {
      opacity: 0.22;
      margin-right: 2px;
    }

    .stars span.filled {
      opacity: 1;
    }

    .time-col {
      color: var(--text-secondary);
      font-size: 0.85rem;
      white-space: nowrap;
    }

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
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      width: 100%;
      border-radius: var(--border-radius-lg);
      overflow-y: auto;
    }

    .modal-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
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
      display: flex;
      align-items: center;
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
    
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.55rem 1.25rem;
      background: var(--primary-gradient);
      color: #fff;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 10px 0 var(--primary-glow);
      transition: var(--transition-smooth);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 15px 0 var(--primary-glow);
      filter: brightness(1.08);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.55rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
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

    @media (max-width: 768px) {
      .filter-bar { flex-direction: column; }
      .filter-select { width: 100%; }
      .comment-text { max-width: 200px; }
      .product-cell { max-width: 150px; }
    }
  `]
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  pagedReviews: any[] = [];

  // Filters
  searchTerm = '';
  ratingFilter: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  Math = Math;

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType = 'snack-success';

  // Modal confirm delete
  showConfirmModal = false;
  reviewToDeleteId: number | null = null;

  // Reply modal states
  showReplyModal = false;
  selectedReview: any = null;
  replyText = '';
  isSavingReply = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.filterReviews();
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.showToast("Sharhlarni yuklashda xatolik yuz berdi!", 'snack-error');
      }
    });
  }

  filterReviews(): void {
    this.filteredReviews = this.reviews.filter(r => {
      const matchesSearch = !this.searchTerm ||
        r.user?.username?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.user?.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.product?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRating = this.ratingFilter === null || r.rating === this.ratingFilter;

      return matchesSearch && matchesRating;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  openConfirmDelete(id: number): void {
    this.reviewToDeleteId = id;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.reviewToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.reviewToDeleteId !== null) {
      this.reviewService.deleteReview(this.reviewToDeleteId).subscribe({
        next: () => {
          this.showToast("Sharh muvaffaqiyatli o'chirildi!", 'snack-success');
          this.loadReviews();
          this.closeConfirmModal();
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          this.showToast("Sharhni o'chirishda xatolik yuz berdi!", 'snack-error');
          this.closeConfirmModal();
        }
      });
    }
  }

  showToast(msg: string, type: string = 'snack-success'): void {
    this.toastMsg = msg;
    this.toastType = type;
    this.showToastNotif = true;
    setTimeout(() => {
      this.showToastNotif = false;
    }, 3000);
  }

  openReplyModal(review: any): void {
    this.selectedReview = review;
    this.replyText = review.replyText || '';
    this.showReplyModal = true;
  }

  closeReplyModal(): void {
    this.showReplyModal = false;
    this.selectedReview = null;
    this.replyText = '';
  }

  submitReply(): void {
    if (!this.replyText.trim() || !this.selectedReview) return;
    this.isSavingReply = true;
    this.reviewService.replyToReview(this.selectedReview.id, this.replyText).subscribe({
      next: () => {
        this.isSavingReply = false;
        this.showToast("Javob muvaffaqiyatli saqlandi!", 'snack-success');
        this.loadReviews();
        this.closeReplyModal();
      },
      error: (err) => {
        console.error('Error saving reply:', err);
        this.isSavingReply = false;
        this.showToast("Javobni saqlashda xatolik yuz berdi!", 'snack-error');
      }
    });
  }

  deleteReply(reviewId: number): void {
    if (confirm("Rostdan ham ushbu javobni o'chirmoqchimisiz?")) {
      this.reviewService.deleteReply(reviewId).subscribe({
        next: () => {
          this.showToast("Javob muvaffaqiyatli o'chirildi!", 'snack-success');
          this.loadReviews();
        },
        error: (err) => {
          console.error('Error deleting reply:', err);
          this.showToast("Javobni o'chirishda xatolik yuz berdi!", 'snack-error');
        }
      });
    }
  }
}
