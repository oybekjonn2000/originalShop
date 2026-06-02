import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService, ContactMessage } from '../../../services/contact.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="messages-container fade-in-el">
      <div class="page-header">
        <h1>Xabarlar</h1>
        <p class="subtitle">Foydalanuvchilardan kelgan murojaatlar va xabarlar</p>
      </div>

      <div class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ism</th>
              <th>Aloqa (Tel/Email)</th>
              <th>Mavzu</th>
              <th>Sana</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let msg of messages" [class.unread-row]="!msg.read">
              <td><strong>#{{ msg.id }}</strong></td>
              <td>{{ msg.name }}</td>
              <td>{{ msg.contact }}</td>
              <td>{{ msg.subject }}</td>
              <td>{{ msg.createdAt | date:'dd.MM.yy HH:mm' }}</td>
              <td>
                <span class="badge" [ngClass]="msg.read ? 'badge-delivered' : 'badge-pending'">
                  {{ msg.read ? 'O\\'qilgan' : 'Yangi' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon" title="O'qish" (click)="viewMessage(msg)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
                <button class="btn-icon delete" title="O'chirish" (click)="deleteMessage(msg.id!)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="messages.length === 0">
              <td colspan="7" class="empty-row">Xabarlar mavjud emas</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Message Modal -->
      <div class="modal-overlay" *ngIf="selectedMessage" (click)="closeModal()">
        <div class="modal-content glass-panel" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Xabar Tafsiloti</h2>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="detail-row">
              <strong>Ism:</strong> {{ selectedMessage.name }}
            </div>
            <div class="detail-row">
              <strong>Aloqa:</strong> {{ selectedMessage.contact }}
            </div>
            <div class="detail-row">
              <strong>Mavzu:</strong> {{ selectedMessage.subject }}
            </div>
            <div class="detail-row">
              <strong>Sana:</strong> {{ selectedMessage.createdAt | date:'dd.MM.yyyy HH:mm:ss' }}
            </div>
            <div class="detail-row message-text">
              <strong>Matn:</strong>
              <p>{{ selectedMessage.message }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()">Yopish</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messages-container {
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
    .unread-row {
      background: rgba(168, 85, 247, 0.05);
      font-weight: 600;
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
    
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    .modal-content {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--glass-border);
    }
    .modal-header h2 {
      font-size: 1.5rem;
      margin: 0;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .close-btn:hover {
      color: var(--text-primary);
    }
    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .detail-row {
      font-size: 1rem;
    }
    .detail-row strong {
      color: var(--text-secondary);
      display: inline-block;
      width: 80px;
    }
    .message-text {
      margin-top: 1rem;
    }
    .message-text p {
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      margin-top: 0.5rem;
      white-space: pre-wrap;
    }
    .modal-footer {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class MessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => console.error('Error fetching messages', err)
    });
  }

  viewMessage(msg: ContactMessage): void {
    this.selectedMessage = msg;
    if (!msg.read && msg.id) {
      this.contactService.markAsRead(msg.id).subscribe({
        next: (updated) => {
          msg.read = true;
        },
        error: (err) => console.error('Error marking as read', err)
      });
    }
  }

  closeModal(): void {
    this.selectedMessage = null;
  }

  deleteMessage(id: number): void {
    if (confirm("Rostdan ham bu xabarni o'chirmoqchimisiz?")) {
      this.contactService.deleteMessage(id).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== id);
        },
        error: (err) => console.error('Error deleting message', err)
      });
    }
  }
}
