import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Domain {
  id: number;
  nomDomaine: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private apiUrl = 'http://localhost:8080/api/domains'; // Change to match your backend URL

  constructor(private http: HttpClient) {}

  getAllDomains(): Observable<Domain[]> {
    return this.http.get<Domain[]>(`${this.apiUrl}`);
  }

  getDomainById(id: number): Observable<Domain> {
    return this.http.get<Domain>(`${this.apiUrl}/${id}`);
  }

  createDomain(domain: Domain): Observable<Domain> {
    return this.http.post<Domain>(`${this.apiUrl}`, domain);
  }

  updateDomain(id: number, domain: Domain): Observable<Domain> {
    return this.http.put<Domain>(`${this.apiUrl}/${id}`, domain);
  }

  deleteDomain(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}