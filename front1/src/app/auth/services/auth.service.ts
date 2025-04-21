import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, LoginResponse, Role } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUserId(): number {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'authToken';  // Consistent key for token storage
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔹 Load user from localStorage (called once at service initialization)
  private loadUserFromStorage(): LoginResponse | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => this.storeUser(response))
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerRequest);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.tokenKey);  // Also remove token
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  getUserId(): number | null {
    return this.getCurrentUser()?.id || null;
  }
  
  private storeUser(user: LoginResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem(this.tokenKey, user.token);  // Store token separately
    this.currentUserSubject.next(user);
  }
}
