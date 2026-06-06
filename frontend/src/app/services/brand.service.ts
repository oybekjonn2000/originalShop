import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private baseApiUrl = 'http://localhost:8080/api/brands';

  constructor(private http: HttpClient) {}

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl);
  }

  getBrandById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/${id}`);
  }

  createBrand(brand: any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl, brand);
  }

  updateBrand(id: number, brand: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/${id}`, brand);
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/${id}`);
  }
}
