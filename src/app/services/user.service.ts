import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/portal/${userId}`);
  }

  getAllAdmins(page: number = 0, size: number = 10) : Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.baseUrl}/portal`, {
      params: { page, size }
    });
  }

  registerAdmin(admin: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/portal/register`, admin);
  }

  updateAdmin(id: string, user: { name: string; email: string }): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/portal/${id}`, user);
  }

  deleteAdmin(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/portal/${id}`);
  }
}
