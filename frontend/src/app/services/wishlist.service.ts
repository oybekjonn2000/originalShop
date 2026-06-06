import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:8080/api/wishlist';
  private wishlistItemsSubject = new BehaviorSubject<any[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  private wishlistProductIdsSubject = new BehaviorSubject<Set<number>>(new Set());
  public wishlistProductIds$ = this.wishlistProductIdsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadWishlist();
      } else {
        this.wishlistItemsSubject.next([]);
        this.wishlistCountSubject.next(0);
        this.wishlistProductIdsSubject.next(new Set());
      }
    });
  }

  loadWishlist(): void {
    if (!this.authService.isLoggedIn()) return;

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.wishlistItemsSubject.next(items);
        this.wishlistCountSubject.next(items.length);
        const ids = new Set<number>(items.map(item => item.product.id));
        this.wishlistProductIdsSubject.next(ids);
      },
      error: () => {
        this.wishlistItemsSubject.next([]);
        this.wishlistCountSubject.next(0);
        this.wishlistProductIdsSubject.next(new Set());
      }
    });
  }

  addToWishlist(productId: number): Observable<any> {
    const params = new HttpParams().set('productId', productId.toString());
    return this.http.post<any>(`${this.apiUrl}/add`, null, { params }).pipe(
      tap(() => this.loadWishlist())
    );
  }

  removeFromWishlistByProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/product/${productId}`).pipe(
      tap(() => this.loadWishlist())
    );
  }

  removeFromWishlist(wishlistItemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/remove/${wishlistItemId}`).pipe(
      tap(() => this.loadWishlist())
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistProductIdsSubject.getValue().has(productId);
  }

  toggleWishlist(productId: number): Observable<any> {
    if (this.isInWishlist(productId)) {
      return this.removeFromWishlistByProduct(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  clearWishlist(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.wishlistItemsSubject.next([]);
        this.wishlistCountSubject.next(0);
        this.wishlistProductIdsSubject.next(new Set());
      })
    );
  }
}
