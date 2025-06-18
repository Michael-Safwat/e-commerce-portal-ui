import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/User";

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
}
