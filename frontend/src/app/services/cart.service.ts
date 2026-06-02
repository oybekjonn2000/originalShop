import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Reload cart count when user changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      }
    });
  }

  loadCart(): void {
    if (!this.authService.isLoggedIn()) return;
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.cartItemsSubject.next(items);
        this.updateCartCount(items);
      },
      error: () => {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      }
    });
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<any>(`${this.apiUrl}/add`, null, { params }).pipe(
      tap(() => this.loadCart())
    );
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.put<any>(`${this.apiUrl}/update/${cartItemId}`, null, { params }).pipe(
      tap(() => this.loadCart())
    );
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      })
    );
  }

  private updateCartCount(items: any[]): void {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCountSubject.next(count);
  }
}
