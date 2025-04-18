import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../event/event.service';

@Injectable({
  providedIn: 'root'
})

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
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap(users => console.log(`Fetched ${users.length} users`)),
        catchError(error => {
          console.error('Error fetching users:', error);
          // Fall back to mock data in development
          return this.getMockUsers();
        })
      );
  }
  // user.service.ts
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(user => console.log('Fetched user:', user)),
        catchError(error => {
          console.error(`Error fetching user with ID ${id}:`, error);
          // For development, you could fall back to a mock user from your mock data
          if (error.status === 403) {
            console.error('Permission denied accessing user profile');
          }
          return throwError(() => error);
        })
      );
  }
  
  
  
  

  searchUsers(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?term=${term}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(users => console.log(`Found ${users.length} users matching "${term}"`)),
        catchError(error => {
          console.error('Error searching users:', error);
          // Fall back to mock filtering in development
          return this.getMockUsers().pipe(
            tap(users => {
              const filtered = users.filter(user => 
                user.firstName.toLowerCase().includes(term.toLowerCase()) || 
                user.lastName.toLowerCase().includes(term.toLowerCase()) || 
                user.email.toLowerCase().includes(term.toLowerCase())
              );
              return of(filtered);
            })
          );
        })
      );
  }

  // Mock user data for development/testing
  private getMockUsers(): Observable<User[]> {
    const mockUsers: User[] = [
      {
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        role: "ADMIN"
      },
      {
        id: 2,
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie.dupont@example.com",
        role: "CHERCHEUR"
      },
      {
        id: 3,
        firstName: "Jean",
        lastName: "Martin",
        email: "jean.martin@example.com",
        role: "CHERCHEUR"
      },
      {
        id: 4,
        firstName: "Sophie",
        lastName: "Lefebvre",
        email: "sophie.lefebvre@example.com",
        role: "ETUDIANT"
      },
      {
        id: 5,
        firstName: "Thomas",
        lastName: "Dubois",
        email: "thomas.dubois@example.com",
        role: "ETUDIANT"
      },
      {
        id: 6,
        firstName: "Pierre",
        lastName: "Moreau",
        email: "pierre.moreau@example.com",
        role: "ETUDIANT"
      },
      {
        id: 7,
        firstName: "Claire",
        lastName: "Bernard",
        email: "claire.bernard@example.com",
        role: "CHERCHEUR"
      },
      {
        id: 8,
        firstName: "Michel",
        lastName: "Robert",
        email: "michel.robert@example.com",
        role: "MODERATEUR"
      },
      {
        id: 9,
        firstName: "Amélie",
        lastName: "Petit",
        email: "amelie.petit@example.com",
        role: "ETUDIANT"
      },
      {
        id: 10,
        firstName: "François",
        lastName: "Legrand",
        email: "francois.legrand@example.com",
        role: "MODERATEUR"
      }
    ];
    
    return of(mockUsers);
  }
}