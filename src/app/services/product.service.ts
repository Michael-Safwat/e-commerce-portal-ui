import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/Product";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {
  }


  /**
   * Fetches a page of products from the backend.
   * @param page The page number (0-indexed, default is 0).
   * @param size The number of items per page (default is 10 or whatever backend defaults to).
   * @param sortBy The field to sort by (optional).
   * @param sortOrder The sort order ('asc' or 'desc', optional).
   * @returns An Observable of a Page object containing Product array and pagination metadata.
   */
  getAllProducts(
    page: number = 0,
    size: number = 10,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<Page<Product>> { // Changed return type to Page<Product>

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sortBy) {
      params = params.set('sort', sortBy + (sortOrder ? `,${sortOrder}` : ''));
    }

    return this.http.get<Page<Product>>(`${this.baseUrl}/products`, { params: params });
  }

  /**
   * Creates a new product (with optional image upload).
   * @param formData FormData containing 'product' (JSON string) and optional 'image' file
   */
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/portal/products`, formData);
  }

  /**
   * Updates an existing product by ID.
   * @param id Product ID
   * @param product Product object (ProductDTO)
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/portal/products/${id}`, product);
  }

  /**
   * Deletes a product by ID.
   * @param id Product ID
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/portal/products/${id}`);
  }
}
