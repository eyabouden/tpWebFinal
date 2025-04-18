import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, FormModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { Article } from './uploadArticle/article.model';
import { ArticleService } from './uploadArticle/article.service';
import { cilPlus, cilMagnifyingGlass, cilStar, cilCloudDownload, cilTrash } from '@coreui/icons';

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
  providers: [IconSetService, ArticleService],
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
  
  constructor(
    private articleService: ArticleService,
    private iconSetService: IconSetService
  ) {
    // Register required icons
    this.iconSetService.icons = { 
      cilPlus, 
      cilMagnifyingGlass, 
      cilStar, 
      cilCloudDownload, 
      cilTrash
    };
  }
  
  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    this.loading = true;
    // Get articles for the current user (you'd normally filter by user ID)
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        this.articles = data;
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
      // Assuming you have current user ID available - usually from auth service
      const currentUserId = 1; // Replace with actual user ID from auth
      
      this.articleService.deleteArticle(id, currentUserId).subscribe({
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
    
    this.articleService.downloadFile(article.id).subscribe({
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