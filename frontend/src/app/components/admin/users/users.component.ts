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
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];

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
    const action = newRole === 'ROLE_ADMIN' ? 'Admin qilishni' : 'Oddiy foydalanuvchi qilishni';
    
    if (confirm(`Haqiqatan ham ushbu foydalanuvchini ${action} xohlaysizmi?`)) {
      this.userService.changeUserRole(user.id, newRole).subscribe({
        next: (updatedUser) => {
          user.role = updatedUser.role;
        },
        error: (err) => console.error('Error changing role', err)
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm("Rostdan ham bu foydalanuvchini tizimdan butunlay o'chirmoqchimisiz?")) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }
}
