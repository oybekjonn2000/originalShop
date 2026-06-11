import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseApiUrl = 'http://localhost:8080/api';
  public isCatalogOpen$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // --- Categories ---
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/categories`);
  }

  // --- Brands ---
  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/brands`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/categories/${id}`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/categories`, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/categories/${id}`);
  }

  // --- Products ---
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/products/${id}`);
  }

  searchProducts(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(`${this.baseApiUrl}/products/search`, { params });
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/products/category/${categoryId}`);
  }

  getProductsBySubcategory(subcategoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/products/subcategory/${subcategoryId}`);
  }

  getProductsByChildCategory(childCategoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/products/child-category/${childCategoryId}`);
  }

  getChildCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/child-categories`);
  }

  getChildCategoriesBySubcategory(subcategoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/child-categories/subcategory/${subcategoryId}`);
  }

  createChildCategory(child: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/child-categories`, child);
  }

  updateChildCategory(id: number, child: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/child-categories/${id}`, child);
  }

  deleteChildCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/child-categories/${id}`);
  }

  // --- Subcategories ---
  getSubcategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/subcategories`);
  }

  getSubcategoriesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/subcategories/category/${categoryId}`);
  }

  createSubcategory(sub: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/subcategories`, sub);
  }

  updateSubcategory(id: number, sub: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/subcategories/${id}`, sub);
  }

  deleteSubcategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/subcategories/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/products/${id}`);
  }

  deleteAllProducts(): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/products`);
  }

  deleteAllCategories(): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/categories`);
  }

  deleteAllSubcategories(): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/subcategories`);
  }
}
