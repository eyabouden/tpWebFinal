import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  createUser(userData: Partial<User>): Observable<User> {
    // Use the auth registration endpoint instead of users endpoint
    const registrationUrl = 'http://localhost:8080/api/auth/register';
    
    const headers = this.getAuthHeaders();
    
    // Prepare the data in the format expected by the registration endpoint
    const userRequest = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role, // Make sure this matches what the backend expects
      institution: userData.institution,
      grade: userData.grade,
      employmentDate: userData.employmentDate
      // Add any other fields required by your registration endpoint
    };
    
    console.log('Sending registration data:', userRequest);
    
    return this.http.post<User>(registrationUrl, userRequest, { headers }).pipe(
      map(response => {
        console.log('Registration successful:', response);
        return response as User;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }
  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { 
      headers: headers,
      observe: 'response' 
    }).pipe(
      map(response => {
        console.log('Delete response:', response);
        return response.body; 
      })
    );
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