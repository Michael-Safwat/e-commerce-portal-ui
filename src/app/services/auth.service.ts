import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/User";
import {Observable} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {
  }

  registerUser(registerRequest: User) {
    return this.http.post(`${this.baseUrl}/register`, registerRequest);
  }

  login(username: string, password: string): Observable<any> {

    const credentials = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    });

    const body = {};

    return this.http.post<any>(`${this.baseUrl}/login`, body, { headers: headers })
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (Error) {
        console.error('Error decoding token:', Error);
        return null;
      }
    }
    return null;
  }

  getUserIdFromToken(): string | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.userId) {
      return decodedToken.userId;
    }
    return null;
  }

  getUserRolesFromToken(): string[] {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && typeof decodedToken.authorities === 'string') {
      // Split the space-delimited string into an array of roles
      return decodedToken.authorities.split(' ');
    }
    return []; // Return an empty array if no roles or invalid format
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.exp) {
      return true; // No token or no expiration claim
    }
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime;
  }

  logout() {
    localStorage.clear();
  }
}
