import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, FormModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';


import { cilPlus, cilMagnifyingGlass, cilStar, cilCloudDownload, cilTrash, cilFile, cilTag } from '@coreui/icons';

import { AuthService } from '../../../auth/services/auth.service';
import { Article, PublicationService } from './publication.service';
 // Import AuthService to get current user

@Component({
  selector: 'app-researcher-publications',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    SpinnerModule,
    IconModule,
    FormModule
  ],
  providers: [IconSetService, PublicationService],
  standalone: true,
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationsComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  currentUserId: number = 0;
  
  constructor(
    private publicationService: PublicationService,
    private iconSetService: IconSetService,
    private authService: AuthService // Inject AuthService
  ) {
    // Register required icons
    this.iconSetService.icons = { 
      cilPlus, 
      cilMagnifyingGlass, 
      cilStar, 
      cilCloudDownload, 
      cilTrash,
      cilFile,
      cilTag
    };
    
    // Get current user ID from auth service
    this.currentUserId = this.authService.getCurrentUser()?.id || 0;
  }
  
  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    this.loading = true;
    
    // First try to get articles by current user ID
    console.log('Fetching articles for user ID:', this.currentUserId);
    
    this.publicationService.getAllArticles().subscribe({
      next: (allArticles) => {
        console.log('All articles retrieved:', allArticles.length);
        
        // Filter articles on the client side to make sure we get the current user's articles
        this.articles = allArticles.filter(article => 
          article.user && article.user.id === this.currentUserId
        );
        
        console.log('Filtered articles for current user:', this.articles.length);
        
        // If no articles were found, check if any articles exist at all
        if (this.articles.length === 0 && allArticles.length > 0) {
          console.warn('No articles found for user ID:', this.currentUserId);
          
        }
        
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.articles];
    
    // Apply status filter if any
    if (this.statusFilter) {
      filtered = filtered.filter(article => article.status === this.statusFilter);
    }
    
    // Apply search term filter if any
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.titre.toLowerCase().includes(term) || 
        article.doi?.toLowerCase().includes(term) ||
        article.keyword?.toLowerCase().includes(term)
      );
    }
    
    this.filteredArticles = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter = select.value;
    this.applyFilters();
  }

  deleteArticle(id: number): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.publicationService.deleteArticle(id).subscribe({
        next: () => {
          this.loadPublications();
        },
        error: (error) => {
          console.error('Error deleting article:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'PENDING':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  downloadArticle(article: Article): void {
    if (!article.filePath) {
      alert('No file available for download');
      return;
    }
    
    this.publicationService.downloadFile(article.id).subscribe({
      next: (response) => {
        // Create a blob from the response
        const blob = new Blob([response], { type: 'application/octet-stream' });
        
        // Create a link element and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = article.filePath || 'article-document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        alert('Error downloading file');
      }
    });
  }
}