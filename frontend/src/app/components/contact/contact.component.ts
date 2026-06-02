import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container fade-in-el">
      <div class="page-header text-center">
        <h1>Biz bilan Aloqa</h1>
        <p class="subtitle">Taklif yoki muammolar bo'lsa bizga xabar yuboring</p>
      </div>

      <div class="contact-grid">
        <!-- Contact Info -->
        <div class="contact-info">
          <div class="info-card glass-panel">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3>Telefon</h3>
            <p>+998 90 123 45 67</p>
            <p>Du - Juma: 09:00 - 18:00</p>
          </div>

          <div class="info-card glass-panel">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3>Email</h3>
            <p>support&#64;ecomerce.uz</p>
            <p>Barcha savollar uchun</p>
          </div>

          <div class="info-card glass-panel">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <h3>Manzil</h3>
            <p>Toshkent shahar, Yunusobod tumani</p>
            <p>Amir Temur ko'chasi 108</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-wrapper glass-panel">
          <h2>Xabar Yuborish</h2>
          <form (ngSubmit)="sendMessage()" class="contact-form" #form="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label class="glass-label">Ismingiz</label>
                <input type="text" name="name" [(ngModel)]="contactData.name" required class="glass-input" placeholder="Ismingizni kiriting">
              </div>
              <div class="form-group">
                <label class="glass-label">Telefon yoki Email</label>
                <input type="text" name="contact" [(ngModel)]="contactData.contact" required class="glass-input" placeholder="Bog'lanish uchun...">
              </div>
            </div>
            
            <div class="form-group">
              <label class="glass-label">Xabar mavzusi</label>
              <input type="text" name="subject" [(ngModel)]="contactData.subject" required class="glass-input" placeholder="Mavzuni kiriting">
            </div>

            <div class="form-group">
              <label class="glass-label">Xabar matni</label>
              <textarea name="message" [(ngModel)]="contactData.message" required class="glass-input" rows="5" placeholder="Sizni nima qiziqtiradi?"></textarea>
            </div>

            <button type="submit" [disabled]="!form.valid || isSending" class="btn-primary mt-2">
              {{ isSending ? 'Yuborilmoqda...' : 'Yuborish' }}
            </button>

            <div *ngIf="isSuccess" class="success-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Xabaringiz muvaffaqiyatli yuborildi. Biz tez orada bog'lanamiz!
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      margin-bottom: 4rem;
    }

    .page-header {
      margin-bottom: 4rem;
      margin-top: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 3rem;
      align-items: start;
    }

    /* Info Cards */
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-card {
      padding: 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .info-card:hover {
      transform: translateY(-5px);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .info-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a855f7;
      margin-bottom: 1rem;
    }

    .info-card h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .info-card p {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 0.2rem;
    }

    /* Contact Form */
    .contact-form-wrapper {
      padding: 3rem;
    }

    .contact-form-wrapper h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: var(--text-primary);
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mt-2 { margin-top: 1rem; }

    .success-message {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      animation: fadeIn 0.3s ease;
    }

    @media (max-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
      .contact-info {
        flex-direction: row;
        flex-wrap: wrap;
      }
      .info-card {
        flex: 1;
        min-width: 250px;
      }
    }
  `]
})
export class ContactComponent {
  contactData: ContactMessage = {
    name: '',
    contact: '',
    subject: '',
    message: ''
  };
  
  isSending = false;
  isSuccess = false;

  constructor(private contactService: ContactService) {}

  sendMessage() {
    this.isSending = true;
    
    this.contactService.sendMessage(this.contactData).subscribe({
      next: (res) => {
        this.isSending = false;
        this.isSuccess = true;
        this.contactData = { name: '', contact: '', subject: '', message: '' };
        
        setTimeout(() => {
          this.isSuccess = false;
        }, 5000);
      },
      error: (err) => {
        this.isSending = false;
        console.error('Error sending message', err);
        // Optionally show an error message
      }
    });
  }
}

