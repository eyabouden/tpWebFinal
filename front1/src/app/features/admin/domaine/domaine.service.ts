import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { tap, map } from 'rxjs/operators';

export interface Domain {
  id: number;
  nomDomaine: string;
  articles?: any[];
}

export interface CreateDomainDTO {
  nomDomaine: string;
}

export interface UpdateDomainDTO {
  nomDomaine: string;
}

@Injectable()
export class DomainService {
  private apiUrl = 'http://localhost:8080/api/domains';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllDomains(): Observable<Domain[]> {
    console.log('Fetching all domains with auth...');
    return this.http.get<Domain[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getDomainById(id: number): Observable<Domain> {
    return this.http.get<Domain>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getDomainWithArticles(id: number): Observable<Domain> {
    return this.http.get<Domain>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(domain => {
          // Load articles for this domain if they aren't already included
          if (!domain.articles) {
            this.getArticlesByDomain(id).subscribe(articles => {
              domain.articles = articles;
            });
          }
        })
      );
  }

  createDomain(domainData: CreateDomainDTO): Observable<Domain> {
    return this.http.post<Domain>(this.apiUrl, domainData, { headers: this.getAuthHeaders() });
  }

  updateDomain(id: number, domainData: UpdateDomainDTO): Observable<Domain> {
    return this.http.put<Domain>(`${this.apiUrl}/${id}`, domainData, { headers: this.getAuthHeaders() });
  }

  deleteDomain(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getArticlesByDomain(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/articles`, { headers: this.getAuthHeaders() });
  }

  searchDomains(keyword: string): Observable<Domain[]> {
    return this.http.get<Domain[]>(`${this.apiUrl}/search?keyword=${keyword}`, { headers: this.getAuthHeaders() });
  }
}