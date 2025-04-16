import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../../admin/users/user.service';
import { Article } from './article.model';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  getArticlesByStatus(status: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?status=${status}`);
  }

  createArticle(article: Article, userId: number): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}?userId=${userId}`, article);
  }

  updateArticle(id: number, article: Article, userId: number): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}?userId=${userId}`, article);
  }

  deleteArticle(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
  }

  validateArticle(id: number, status: string, adminId: number): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}/validate?adminId=${adminId}`, { status });
  }

  assignDomainToArticle(articleId: number, domainId: number, userId: number): Observable<Article> {
    return this.http.post<Article>(
      `${this.apiUrl}/${articleId}/assign-domain/${domainId}?userId=${userId}`, 
      {}
    );
  }

  uploadFile(articleId: number, file: File): Observable<Article> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Article>(`${this.apiUrl}/${articleId}/upload`, formData);
  }

  downloadFile(articleId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${articleId}/download`, {
      responseType: 'blob'
    });
  }

  // Method to add a contributor to an article
  addContributor(articleId: number, contributorId: number, userId: number, type: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${articleId}/assign-author/${contributorId}?userId=${userId}`,
      { type }
    );
  }

  // Method to remove a contributor from an article
  removeContributor(articleId: number, contributorId: number, userId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${articleId}/contributors/${contributorId}?userId=${userId}`
    );
  }
}