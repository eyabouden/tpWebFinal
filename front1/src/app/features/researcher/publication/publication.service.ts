import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  employmentDate?: Date; 
  grade?: string;
  role?: string;
  institution?: string;
  position?: string;
  department?: string;
}

export interface Article {
  id: number;
  titre: string;
  doi: string;
  keyword: string;
  description: string;
  status: string;
  domainId?: number | null;
  domain?: Domain;
  filePath?: string;
  contributions?: ContributionDTO[];
  user?: User;
}

export interface Domain {
  id: number | null;
  nomDomaine?: string;
}

export interface CreateContributionDTO {
  userId?: number | null;
  contributorId?: number | null;
  type: string;
}

export interface ContributionDTO {
  id?: number;
  articleId?: number;
  contributorId?: number | null;
  type?: string;
  user?: User;
  date?: Date;
  lieu?: string;
}

@Injectable({
  providedIn: 'root' // This makes it available app-wide
})
export class PublicationService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  
    });
  }

  // Articles API methods
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`, { headers: this.getAuthHeaders() });
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`, { headers: this.getAuthHeaders() });
  }

  // In publication.service.ts
  // publication.service.ts - createArticle method fix
createArticle(article: Partial<Article>): Observable<Article> {
  const userId = this.authService.getUserId();
  
  // Create a clean object with only the properties needed for creation
  const cleanArticle = {
    titre: article.titre,
    doi: article.doi,
    keyword: article.keyword,
    description: article.description,
    status: article.status || 'PENDING',
    domainId: article.domainId ? article.domainId : (article.domain?.id || null)
  };
  
  return this.http.post<Article>(
    `${this.apiUrl}/articles?userId=${userId}`, 
    cleanArticle, 
    { headers: this.getAuthHeaders() }
  );
}
  updateArticle(id: number, article: Partial<Article>): Observable<Article> {
    const userId = this.authService.getUserId();
    
    // Only include the needed properties for API communication
    const articleDto = {
      id: article.id,
      titre: article.titre,
      doi: article.doi,
      keyword: article.keyword,
      description: article.description,
      status: article.status,
      domainId: article.domainId
    };
    
    return this.http.put<Article>(
      `${this.apiUrl}/articles/${id}?userId=${userId}`, 
      articleDto, 
      { headers: this.getAuthHeaders() }
    );
  }
  deleteArticle(id: number): Observable<void> {
    const userId = this.authService.getUserId();
    return this.http.delete<void>(
      `${this.apiUrl}/articles/${id}?userId=${userId}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  validateArticle(id: number, status: string): Observable<Article> {
    const adminId = this.authService.getUserId();
    return this.http.put<Article>(
      `${this.apiUrl}/articles/${id}/validate?adminId=${adminId}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }


  // Add this to your PublicationService class

// Update a contribution
updateContribution(articleId: number, contributionId: number, contribution: Partial<ContributionDTO>): Observable<ContributionDTO> {
  const userId = this.authService.getUserId();
  
  // Only include the needed properties for API communication
  const updateData = {
    type: contribution.type,
    lieu: contribution.lieu
  };
  
  return this.http.put<ContributionDTO>(
    `${this.apiUrl}/articles/${articleId}/contributions/${contributionId}?userId=${userId}`,
    updateData,
    { headers: this.getAuthHeaders() }
  );
}
// Method to count articles by user
countArticlesByUser(userId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/articles/countByUser/${userId}`, { headers: this.getAuthHeaders() });
}

// Method to count contributors by user
countContributorsByUser(userId: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/contributions/countByUser/${userId}`, { headers: this.getAuthHeaders() });
}




// Make sure your newContribution in the PublicationComponent class includes lieu:
// newContribution: Partial<ContributionDTO> = {
//   contributorId: null,
//   type: 'AUTHOR',
//   lieu: ''
// };

  // Domain methods
  
  getAllDomains(): Observable<Domain[]> {
    return this.http.get<Domain[]>(`${this.apiUrl}/domains`, { headers: this.getAuthHeaders() });
  }

  assignDomain(articleId: number, domainId: number): Observable<Article> {
    const userId = this.authService.getUserId();
    return this.http.post<Article>(
      `${this.apiUrl}/articles/${articleId}/assign-domain/${domainId}?userId=${userId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Contribution methods
  addContribution(articleId: number, contribution: Partial<ContributionDTO>): Observable<ContributionDTO> {
    const userId = this.authService.getUserId();
    
    // Create a proper CreateContributionDTO for API communication
    const createContributionDTO: CreateContributionDTO = {
      userId: userId,
      contributorId: contribution.contributorId,
      type: contribution.type || 'AUTHOR'
    };
    
    return this.http.post<ContributionDTO>(
      `${this.apiUrl}/articles/${articleId}/contributions?userId=${userId}`,
      createContributionDTO,
      { headers: this.getAuthHeaders() }
    );
  }

  removeContribution(articleId: number, contributionId: number): Observable<Article> {
    const userId = this.authService.getUserId();
    return this.http.delete<Article>(
      `${this.apiUrl}/articles/${articleId}/contributions/${contributionId}?userId=${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // User methods
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }
   // Get articles by user ID (for researcher to see only their own articles)
   getArticlesByUserId(userId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/user/${userId}`,{ headers: this.getAuthHeaders() });
  }
  // File handling methods
  uploadFile(articleId: number, file: File): Observable<Article> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Create headers without content-type to let the browser set it properly for file upload
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post<Article>(
      `${this.apiUrl}/articles/${articleId}/upload`,
      formData,
      { headers: headers }
    ).pipe(
      catchError(error => {
        console.error('File upload error:', error);
        // Extract message from error if possible
        let errorMessage = 'File upload failed';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  downloadFile(articleId: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(
      `${this.apiUrl}/articles/${articleId}/download`,
      { headers: headers, responseType: 'blob' }
    );
  }
}