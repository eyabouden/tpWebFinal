import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';


import { Article } from './article.model';
import { AuthService } from '../../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred. Please try again later.'));
  }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        retry(1),
        tap(data => console.log('Fetched articles:', data)),
        catchError(this.handleError)
      );
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(article => console.log(`Fetched article ID ${id}:`, article)),
        catchError(this.handleError)
      );
  }

  getArticlesByStatus(status: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?status=${status}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(articles => console.log(`Fetched articles with status ${status}:`, articles)),
        catchError(this.handleError)
      );
  }
  uploadArticle(formData: FormData): Observable<Article> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return throwError(() => new Error('User not authenticated.'));
    }
  
    return this.http.post<Article>(
      `${this.apiUrl}/upload?userId=${currentUser.id}`,
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authService.getToken()}`
          // ⚠️ Don't set Content-Type manually — Angular will set the correct multipart/form-data boundary
        })
      }
    ).pipe(
      tap(created => console.log('Uploaded new article with file:', created)),
      catchError(this.handleError)
    );
  }
  
  createArticle(article: Article): Observable<Article> {
  const currentUser = this.authService.getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return throwError(() => new Error('User not authenticated.'));
  }

  return this.http.post<Article>(`${this.apiUrl}?userId=${currentUser.id}`, article, {
    headers: this.getAuthHeaders()
  }).pipe(
    tap(created => console.log('Created article:', created)),
    catchError(this.handleError)
  );
}

  

  updateArticle(id: number, article: Article, userId: number): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}?userId=${userId}`, article, { headers: this.getAuthHeaders() })
      .pipe(
        tap(updated => console.log(`Updated article ID ${id}:`, updated)),
        catchError(this.handleError)
      );
  }

  deleteArticle(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log(`Deleted article ID ${id}`)),
        catchError(this.handleError)
      );
  }

  validateArticle(id: number, status: string, adminId: number): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}/validate?adminId=${adminId}`, { status }, { headers: this.getAuthHeaders() })
      .pipe(
        tap(validated => console.log(`Validated article ID ${id} with status ${status}`)),
        catchError(this.handleError)
      );
  }

  assignDomainToArticle(articleId: number, domainId: number, userId: number): Observable<Article> {
    return this.http.post<Article>(
      `${this.apiUrl}/${articleId}/assign-domain/${domainId}?userId=${userId}`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(updated => console.log(`Assigned domain ${domainId} to article ${articleId}`)),
      catchError(this.handleError)
    );
  }

  uploadFile(articleId: number, file: File): Observable<Article> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Article>(`${this.apiUrl}/${articleId}/upload`, formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).pipe(
      tap(uploaded => console.log(`Uploaded file for article ${articleId}`)),
      catchError(this.handleError)
    );
  }

  downloadFile(articleId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${articleId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    }).pipe(
      tap(() => console.log(`Downloading file for article ${articleId}`)),
      catchError(this.handleError)
    );
  }

  addContributor(articleId: number, contributorId: number, userId: number, type: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${articleId}/assign-author/${contributorId}?userId=${userId}`,
      { type },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => console.log(`Added contributor ${contributorId} to article ${articleId}`)),
      catchError(this.handleError)
    );
  }

  removeContributor(articleId: number, contributorId: number, userId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${articleId}/contributors/${contributorId}?userId=${userId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => console.log(`Removed contributor ${contributorId} from article ${articleId}`)),
      catchError(this.handleError)
    );
  }
}