import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8080/api/statistics';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    });
  }

  getOverallStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/overall`, { headers: this.getAuthHeaders() });
  }

  getArticlesByDomain(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/articles-by-domain`, { headers: this.getAuthHeaders() });
  }

  getDownloadsByDomain(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/downloads-by-domain`, { headers: this.getAuthHeaders() });
  }

  getArticleStatistics(articleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/article/${articleId}`, { headers: this.getAuthHeaders() });
  }
  getArticleCountByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/articles-count`, { headers: this.getAuthHeaders() });
  }
  
  getEventCountByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/events-count`, { headers: this.getAuthHeaders() });
  }
  
  getEventsAttendedByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/events-attended`, { headers: this.getAuthHeaders() });
  }
  getUserStatistics(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() });
  }
  
  // Method to get stats for the current logged-in user
  getCurrentUserStatistics(): Observable<any> {
    const currentUserId = this.authService.getCurrentUserId();
    return this.getUserStatistics(currentUserId);
  }
}