import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelSService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllproducts`);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addproduct`, productData);
  }

  updateProduct(id: string, productData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}