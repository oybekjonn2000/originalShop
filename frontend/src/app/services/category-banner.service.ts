import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryBanner {
  id?: number;
  categoryId: number;
  categoryName?: string;
  imageUrl: string;
  imageUrls?: string[];
  displayOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryBannerService {
  private apiUrl = 'http://localhost:8080/api/category-banners';

  constructor(private http: HttpClient) { }

  getAllBanners(): Observable<CategoryBanner[]> {
    return this.http.get<CategoryBanner[]>(this.apiUrl);
  }

  createBanner(banner: Partial<CategoryBanner>): Observable<CategoryBanner> {
    return this.http.post<CategoryBanner>(this.apiUrl, banner);
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
