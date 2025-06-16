import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/User";
import {Observable} from "rxjs";

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

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  logout() {
    localStorage.clear();
  }
}
