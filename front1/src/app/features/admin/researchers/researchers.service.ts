import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employmentDate: Date;
  grade: string;
  role: string;
  institution?: string;
  position?: string;
  department?: string;
}

@Injectable()
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  changeUserRole(id: number, newRole: string): Observable<User> {
   
    return this.http.put<User>(
      `${this.apiUrl}/${id}/role`, 
      { "newRole": newRole }, 
      { headers: this.getAuthHeaders() }
    );
  }

  getResearchers(): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === 'RESEARCHER'))
    );
  }
  
  getModerateurs(): Observable<User[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.role === 'MODERATEUR'))
    );
  }
}