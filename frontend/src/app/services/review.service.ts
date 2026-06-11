import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/${productId}`);
  }

  addReview(productId: number, comment: string, rating: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { productId, comment, rating });
  }

  canReview(productId: number): Observable<{ canReview: boolean }> {
    return this.http.get<{ canReview: boolean }>(`${this.apiUrl}/product/${productId}/can-review`);
  }

  getReviewedProductIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/user/reviewed-products`);
  }

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMyReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }

  replyToReview(reviewId: number, replyText: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${reviewId}/reply`, { replyText });
  }

  deleteReply(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${reviewId}/reply`);
  }
}

