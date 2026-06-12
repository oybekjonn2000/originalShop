import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container fade-in-el">
      <div class="page-header">
        <h1>Foydalanuvchilar</h1>
        <p class="subtitle">Platformadagi barcha mijozlar va adminlarni boshqarish</p>
      </div>

      <div class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Ism / Familiya</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td><strong>#{{ user.id }}</strong></td>
              <td>{{ user.username }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" [ngClass]="user.role === 'ROLE_ADMIN' ? 'badge-delivered' : 'badge-processing'">
                  {{ user.role === 'ROLE_ADMIN' ? 'Admin' : 'Foydalanuvchi' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon" title="Rolni o'zgartirish" (click)="toggleRole(user)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button class="btn-icon delete" title="O'chirish" (click)="deleteUser(user.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="6" class="empty-row">Foydalanuvchilar topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Confirm Modal Overlay -->
      <div class="modal-overlay" *ngIf="showConfirmModal" (click)="closeConfirm()">
        <div class="modal-card glass-panel confirm-modal" (click)="$event.stopPropagation()">
          <div class="confirm-header">
            <div class="confirm-icon-wrap" [class.role-change]="confirmActionType === 'role'">
              <svg *ngIf="confirmActionType === 'delete'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              
              <svg *ngIf="confirmActionType === 'role'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <h2>{{ confirmTitle }}</h2>
          </div>
          <div class="confirm-body">
            <p>{{ confirmMessage }}</p>
          </div>
          <div class="confirm-actions">
            <button (click)="closeConfirm()" class="btn-secondary">Bekor qilish</button>
            <button (click)="executeConfirm()" class="btn-primary" [class.btn-danger]="confirmActionType === 'delete'" [class.btn-primary-gradient]="confirmActionType === 'role'">
              {{ confirmButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .page-header {
      margin-bottom: 2.5rem;
    }
    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.35rem;
    }
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: var(--transition-smooth);
    }
    .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }
    .btn-icon.delete:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    .empty-row {
      text-align: center;
      padding: 2rem !important;
      color: var(--text-secondary);
    }

    /* Custom Confirmation Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 100px 1rem 1rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      width: 90%;
      max-width: 450px;
      padding: 2.25rem 2.5rem;
      border-radius: var(--border-radius-lg);
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      box-shadow: var(--shadow-lg);
      backdrop-filter: none !important;
      animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host-context([data-theme="dark"]) .modal-card {
      background: #0b0e14 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: none !important;
    }

    .confirm-modal {
      text-align: center;
    }

    .confirm-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .confirm-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
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

    .confirm-icon-wrap.role-change {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .confirm-body p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .confirm-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
      border: none !important;
      color: white !important;
    }

    .btn-danger:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
      transform: translateY(-2px);
    }

    .btn-primary-gradient {
      background: var(--primary-gradient) !important;
      box-shadow: 0 4px 15px var(--primary-glow) !important;
      border: none !important;
      color: white !important;
    }

    .btn-primary-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px var(--primary-glow) !important;
      filter: brightness(1.08);
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  // Confirmation Modal State
  showConfirmModal = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmButtonText = '';
  confirmActionType: 'delete' | 'role' = 'delete';
  targetUserId: number | null = null;
  targetUserNewRole: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error fetching users', err)
    });
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    const actionText = newRole === 'ROLE_ADMIN' ? 'Admin qilish' : 'Oddiy foydalanuvchi qilish';
    
    this.confirmActionType = 'role';
    this.targetUserId = user.id;
    this.targetUserNewRole = newRole;
    this.confirmTitle = "Rolni o'zgartirish";
    this.confirmMessage = `Haqiqatan ham ushbu foydalanuvchini ${actionText}ni xohlaysizmi?`;
    this.confirmButtonText = "Tasdiqlash";
    this.showConfirmModal = true;
  }

  deleteUser(id: number): void {
    this.confirmActionType = 'delete';
    this.targetUserId = id;
    this.confirmTitle = "O'chirishni tasdiqlang";
    this.confirmMessage = "Rostdan ham bu foydalanuvchini tizimdan butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.";
    this.confirmButtonText = "O'chirish";
    this.showConfirmModal = true;
  }

  closeConfirm(): void {
    this.showConfirmModal = false;
    this.targetUserId = null;
    this.targetUserNewRole = null;
  }

  executeConfirm(): void {
    if (!this.targetUserId) return;

    if (this.confirmActionType === 'role' && this.targetUserNewRole) {
      this.userService.changeUserRole(this.targetUserId, this.targetUserNewRole).subscribe({
        next: (updatedUser) => {
          const user = this.users.find(u => u.id === this.targetUserId);
          if (user) {
            user.role = updatedUser.role;
          }
          this.closeConfirm();
        },
        error: (err) => {
          console.error('Error changing role', err);
          this.closeConfirm();
        }
      });
    } else if (this.confirmActionType === 'delete') {
      this.userService.deleteUser(this.targetUserId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== this.targetUserId);
          this.closeConfirm();
        },
        error: (err) => {
          console.error('Error deleting user', err);
          this.closeConfirm();
        }
      });
    }
  }
}
