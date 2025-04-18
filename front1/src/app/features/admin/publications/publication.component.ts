import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, FormModule, ModalModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash, cilPencil, cilCheck, cilX, cilPlus, cilNotes, cilCloudDownload, cilPeople } from '@coreui/icons';
import { RouterModule } from '@angular/router';

import { PublicationService, Article, Domain, ContributionDTO } from './publication.service';

@Component({
  selector: 'app-articles',
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
    FormModule,
    ModalModule
  ],
  providers: [IconSetService, PublicationService],
  templateUrl: './publication.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // Icons for direct access in template
  cilTrash = cilTrash;
  cilPencil = cilPencil;
  cilCheck = cilCheck;
  cilX = cilX;
  cilPlus = cilPlus;
  cilNotes = cilNotes;
  cilCloudDownload = cilCloudDownload;
  cilPeople = cilPeople;
  
  // Modal management
  showArticleModal: boolean = false;
  showDeleteModal: boolean = false;
  showContributionModal: boolean = false;
  currentArticle: Article | null = null;
  
  // New article form
  newArticle: Partial<Article> = {
    titre: '',
    doi: '',
    keyword: '',
    description: '',
    status: 'PENDING',
    domainId: null
  };
  
  // Contribution form
  newContribution: Partial<ContributionDTO> = {
    contributorId: null,
    type: 'AUTHOR' // Default type
  };
  
  // Filter options
  statusFilter: string = 'ALL';
  searchTerm: string = '';
  
  // Domains list for dropdown
  domains: Domain[] = [];
  
  // Users list for contributor assignment
  users: any[] = [];
  
  // Contribution types
  contributionTypes: string[] = ['AUTHOR', 'REVIEWER', 'EDITOR', 'CONTRIBUTOR'];
  
  // File upload
  selectedFile: File | null = null;
  
  constructor(
    private publicationService: PublicationService,
    private iconSetService: IconSetService
  ) { 
    // Register icons
    iconSetService.icons = { 
      cilTrash, cilPencil, cilCheck, cilX, cilPlus, cilNotes, cilCloudDownload, cilPeople 
    };
  }

  ngOnInit(): void {
    this.loadArticles();
    this.loadDomains();
    this.loadUsers();
  }

  loadArticles(): void {
    this.loading = true;
    this.publicationService.getAllArticles()
      .subscribe({
        next: (data) => {
          this.articles = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load articles';
          this.loading = false;
          console.error(err);
        }
      });
  }

  loadDomains(): void {
    this.publicationService.getAllDomains()
      .subscribe({
        next: (data) => {
          this.domains = data;
        },
        error: (err) => {
          console.error('Failed to load domains', err);
        }
      });
  }

  loadUsers(): void {
    this.publicationService.getAllUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Failed to load users', err);
        }
      });
  }

  // CRUD Operations
  createArticle(): void {
    // Create a clean article object with ONLY the properties the API expects
    const articleToCreate = {
      titre: this.newArticle.titre,
      doi: this.newArticle.doi,
      keyword: this.newArticle.keyword,
      description: this.newArticle.description,
      status: 'PENDING',
      domainId: this.newArticle.domainId
    };
    
    if (!articleToCreate.titre || !articleToCreate.doi || !articleToCreate.keyword || !articleToCreate.description) {
      this.error = 'Please fill in all required fields';
      return;
    }
    
    this.publicationService.createArticle(articleToCreate)
      .subscribe({
        next: (data) => {
          this.articles.push(data);
          this.applyFilters();
          this.showArticleModal = false;
          this.resetArticleForm();
          
          // Upload file if selected
          if (this.selectedFile) {
            this.uploadFile(data.id);
          }
        },
        error: (err) => {
          this.error = `Failed to create article: ${err.message || 'Unknown error'}`;
        }
      });
  }
  updateArticle(): void {
    if (!this.currentArticle) return;
    
    // Create a clean article object with ONLY the properties the API expects
    const articleToUpdate = {
      id: this.currentArticle.id,
      titre: this.currentArticle.titre,
      doi: this.currentArticle.doi,
      keyword: this.currentArticle.keyword,
      description: this.currentArticle.description,
      status: this.currentArticle.status,
      // Important: Always send domainId, not the domain object
      domainId: this.currentArticle.domain?.id || this.currentArticle.domainId
    };
    
    if (!articleToUpdate.titre || !articleToUpdate.doi || !articleToUpdate.keyword || !articleToUpdate.description) {
      this.error = 'Please fill in all required fields';
      return;
    }
    
    this.publicationService.updateArticle(this.currentArticle.id, articleToUpdate)
      .subscribe({
        next: (data) => {
          const index = this.articles.findIndex(a => a.id === data.id);
          if (index !== -1) {
            this.articles[index] = data;
            this.applyFilters();
          }
          this.showArticleModal = false;
          
          // Upload file if selected
          if (this.selectedFile) {
            this.uploadFile(data.id);
          }
        },
        error: (err) => {
          this.error = `Failed to update article: ${err.message || 'Unknown error'}`;
        }
      });
  }

// Add these properties to your PublicationComponent class
editingContribution: Partial<ContributionDTO> = {};
contributionToRemove: Partial<ContributionDTO> | null = null;
showEditContributionModal = false;
showConfirmRemoveModal = false;


isUserArticleCreator(userId: number): boolean {
  if (!this.currentArticle || !this.currentArticle.user) return false;
  return this.currentArticle.user.id === userId;
}





  // In publication.component.ts - Fix the addContribution method
  // addContribution(): void {
  //   if (!this.currentArticle) return;
    
  //   // Validate required fields
  //   if (!this.newContribution.contributorId || !this.newContribution.type) {
  //     this.error = 'Please select a contributor and a contribution type';
  //     return;
  //   }
    
  //   // Check if the contributor already exists for this article
  //   const isDuplicate = this.currentArticle.contributions?.some(
  //     c => c.contributorId === this.newContribution.contributorId && c.type === this.newContribution.type
  //   );
    
  //   if (isDuplicate) {
  //     this.error = 'This contributor already has this role for this article';
  //     return;
  //   }
    
  //   // Create a proper contribution object using ContributionDTO
  //   const contributionToAdd: Partial<ContributionDTO> = {
  //     contributorId: this.newContribution.contributorId,
  //     type: this.newContribution.type || 'AUTHOR'
  //   };
    
  //   this.publicationService.addContribution(this.currentArticle.id, contributionToAdd)
  //     .subscribe({
  //       next: (data) => {
  //         console.log('Contribution added successfully:', data);
          
  //         // After adding contribution, refresh the article to get updated data
  //         this.refreshArticleAfterContribution();
  //       },
  //       error: (err) => {
  //         console.error('Failed to add contribution', err);
  //         this.error = `Failed to add contribution: ${err.message || err.statusText || 'Unknown error'}`;
  //       }
  //     });
  // }
  // Add this method to publication.component.ts



   
  // removeContribution(contributionId: number): void {
  //   if (!this.currentArticle) return;
    
  //   console.log(`Removing contribution ${contributionId} from article ${this.currentArticle.id}`);
    
  //   this.publicationService.removeContribution(this.currentArticle.id, contributionId)
  //     .subscribe({
  //       next: (data) => {
  //         console.log('Contribution removed successfully');
          
  //         // Refresh the article to get updated contribution list
  //         this.publicationService.getArticleById(this.currentArticle!.id)
  //           .subscribe({
  //             next: (updatedArticle) => {
  //               // Update in articles list
  //               const index = this.articles.findIndex(a => a.id === updatedArticle.id);
  //               if (index !== -1) {
  //                 this.articles[index] = updatedArticle;
  //                 this.applyFilters();
  //               }
                
  //               // Update current article
  //               this.currentArticle = updatedArticle;
  //             },
  //             error: (err) => {
  //               console.error('Failed to refresh article after removing contribution', err);
  //             }
  //           });
  //       },
  //       error: (err) => {
  //         console.error('Failed to remove contribution', err);
  //         this.error = `Failed to remove contribution: ${err.message || err.statusText || 'Unknown error'}`;
  //       }
  //     });
  // }


// Reset the editing contribution form
resetEditContributionForm(): void {
  this.editingContribution = {};
  this.showEditContributionModal = false;
}

// Define the UpdateContributionDTO interface in your publication.service.ts
// export interface UpdateContributionDTO {
//   type?: string;
//   lieu?: string;
// }
  deleteArticle(id: number): void {
    this.publicationService.deleteArticle(id)
      .subscribe({
        next: () => {
          this.articles = this.articles.filter(a => a.id !== id);
          this.applyFilters();
          this.showDeleteModal = false;
        },
        error: (err) => {
          console.error('Failed to delete article', err);
        }
      });
  }
  
  validateArticle(id: number, status: string): void {
    this.publicationService.validateArticle(id, status)
      .subscribe({
        next: (data) => {
          const index = this.articles.findIndex(a => a.id === data.id);
          if (index !== -1) {
            this.articles[index] = data;
            this.applyFilters();
          }
        },
        error: (err) => {
          console.error('Failed to validate article', err);
        }
      });
  }
  
  // File handling


onFileSelected(event: any): void {
  if (event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile?.name);
  }
}

uploadFile(articleId: number): void {
  if (!this.selectedFile) {
    console.log('No file selected, skipping upload');
    return;
  }
  
  console.log(`Uploading file for article ID ${articleId}:`, this.selectedFile.name);
  
  this.publicationService.uploadFile(articleId, this.selectedFile)
    .subscribe({
      next: (data) => {
        console.log('File uploaded successfully:', data);
        // Update the article in the list with the new file info
        const index = this.articles.findIndex(a => a.id === data.id);
        if (index !== -1) {
          this.articles[index] = data;
          this.applyFilters();
        }
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Failed to upload file', err);
        this.error = `Failed to upload file: ${err.message || 'Unknown error'}`;
      }
    });
}
  
downloadFile(articleId: number): void {
  this.publicationService.downloadFile(articleId)
    .subscribe({
      next: (data: Blob) => {
        const article = this.articles.find(a => a.id === articleId);
        if (!article || !article.filePath) {
          console.error('No file path found');
          this.error = 'No file associated with this article';
          return;
        }
        
        // Extract filename from filepath
        const fileName = article.filePath.split('/').pop() || 'download';
        
        // Create a download link and trigger the download
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Failed to download file', err);
        this.error = `Failed to download file: ${err.message || 'Unknown error'}`;
      }
    });
}
  
  // Domain assignment
  assignDomain(articleId: number, domainId: number): void {
    this.publicationService.assignDomain(articleId, domainId)
      .subscribe({
        next: (data) => {
          const index = this.articles.findIndex(a => a.id === data.id);
          if (index !== -1) {
            this.articles[index] = data;
            this.applyFilters();
          }
        },
        error: (err) => {
          console.error('Failed to assign domain', err);
        }
      });
  }
  
  // UI helper methods
  openCreateModal(): void {
    this.currentArticle = null;
    this.resetArticleForm();
    this.showArticleModal = true;
  }
  
  openEditModal(article: Article): void {
    this.currentArticle = { ...article };
    this.showArticleModal = true;
  }
  
  openDeleteModal(article: Article): void {
    this.currentArticle = article;
    this.showDeleteModal = true;
  }
  
  openContributionModal(article: Article): void {
    this.currentArticle = article;
    this.resetContributionForm();
    this.showContributionModal = true;
  }
  
  resetArticleForm(): void {
    this.newArticle = {
      titre: '',
      doi: '',
      keyword: '',
      description: '',
      status: 'PENDING',
      domainId: null
    };
    this.selectedFile = null;
  }
  
 
  
  // Filtering
  applyFilters(): void {
    this.filteredArticles = this.articles.filter(article => {
      // Status filter
      if (this.statusFilter !== 'ALL' && article.status !== this.statusFilter) {
        return false;
      }
      
      // Search term filter
      if (this.searchTerm && !article.titre.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
  
  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'secondary';
    }
  }
  
  // Getters and setters for form binding
  get articleTitle(): string {
    return this.currentArticle ? this.currentArticle.titre : this.newArticle.titre || '';
  }

  set articleTitle(value: string) {
    if (this.currentArticle) {
      this.currentArticle.titre = value;
    } else {
      this.newArticle.titre = value;
    }
  }

  get articleDoi(): string {
    return this.currentArticle ? this.currentArticle.doi : this.newArticle.doi || '';
  }

  set articleDoi(value: string) {
    if (this.currentArticle) {
      this.currentArticle.doi = value;
    } else {
      this.newArticle.doi = value;
    }
  }

  get articleKeyword(): string {
    return this.currentArticle ? this.currentArticle.keyword : this.newArticle.keyword || '';
  }

  set articleKeyword(value: string) {
    if (this.currentArticle) {
      this.currentArticle.keyword = value;
    } else {
      this.newArticle.keyword = value;
    }
  }

  get articleDescription(): string {
    return this.currentArticle ? this.currentArticle.description : this.newArticle.description || '';
  }

  set articleDescription(value: string) {
    if (this.currentArticle) {
      this.currentArticle.description = value;
    } else {
      this.newArticle.description = value;
    }
  }
  
  get selectedDomainId(): number | null {
    if (this.currentArticle) {
      // First check if domain object exists and has an id
      if (this.currentArticle.domain && this.currentArticle.domain.id) {
        return this.currentArticle.domain.id;
      }
      // Fall back to domainId if set
      return this.currentArticle.domainId || null;
    }
    return this.newArticle.domainId || null;
  }
  
  set selectedDomainId(value: number | null) {
    if (this.currentArticle) {
      this.currentArticle.domainId = value;
      // Also update the domain object if it exists
      if (!this.currentArticle.domain) {
        this.currentArticle.domain = { id: value } as Domain;
      } else {
        this.currentArticle.domain.id = value;
      }
    } else {
      this.newArticle.domainId = value;
    }
  }

getContributorName(id: number | null | undefined): string {
  if (id === null || id === undefined) {
    return 'Unknown User';
  }
  const user = this.users.find(u => u.id === id);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
}
  
    getDomainName(article: Article): string {
      if (article.domain && article.domain.id) {
        const domain = this.domains.find(d => d.id === article.domain?.id);
        return domain?.nomDomaine ?? 'Uncategorized';
      } else if (article.domainId) {
        const domain = this.domains.find(d => d.id === article.domainId);
        return domain?.nomDomaine ?? 'Uncategorized';
      }
      return 'Uncategorized';
    }
   
    











    // Important methods that need to be present in your PublicationComponent class

    addContribution(): void {
      if (!this.currentArticle) return;
      
      // Validate required fields
      if (!this.newContribution.contributorId || !this.newContribution.type) {
        this.error = 'Please select a contributor and a contribution type';
        return;
      }
      
      // Check if the contributor is the article creator
      if (this.isUserArticleCreator(this.newContribution.contributorId)) {
        this.error = 'The article creator cannot be added as a contributor';
        return;
      }
      
      // Check if the contributor already exists for this article
      const existingContribution = this.currentArticle.contributions?.find(
        c => c.contributorId === this.newContribution.contributorId
      );
      
      if (existingContribution) {
        // If contributor exists, show error
        this.error = 'This contributor is already associated with this article. Please edit their existing contribution.';
        return;
      }
      
      // Create contribution object
      const contributionToAdd: Partial<ContributionDTO> = {
        contributorId: this.newContribution.contributorId,
        type: this.newContribution.type || 'AUTHOR',
        lieu: this.newContribution.lieu
      };
      
      this.publicationService.addContribution(this.currentArticle.id, contributionToAdd)
        .subscribe({
          next: (data) => {
            console.log('Contribution added successfully:', data);
            this.refreshArticleAfterContribution();
          },
          error: (err) => {
            console.error('Failed to add contribution', err);
            this.error = `Failed to add contribution: ${err.message || err.statusText || 'Unknown error'}`;
          }
        });
    }
// Check if user is already a contributor to the current article
isUserAlreadyContributor(userId: number): boolean {
  if (!this.currentArticle || !this.currentArticle.contributions) return false;
  
  return this.currentArticle.contributions.some(c => c.contributorId === userId);
}

// Helper method to get initials
getInitials(name: string): string {
  if (!name || name === 'Unknown User') return 'UN';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Open edit modal for contributor
openEditContributionModal(contribution: ContributionDTO): void {
  this.editingContribution = {...contribution};
  this.showEditContributionModal = true;
}

// Update contribution
updateContribution(): void {
  if (!this.currentArticle || !this.editingContribution.id) return;
  
  this.publicationService.updateContribution(
    this.currentArticle.id, 
    this.editingContribution.id, 
    this.editingContribution
  ).subscribe({
    next: (data) => {
      console.log('Contribution updated successfully:', data);
      // After updating contribution, refresh the article
      this.refreshArticleAfterContribution();
      this.showEditContributionModal = false;
    },
    error: (err) => {
      console.error('Failed to update contribution', err);
      this.error = `Failed to update contribution: ${err.message || err.statusText || 'Unknown error'}`;
    }
  });
}

// Show confirmation before deleting
confirmRemoveContribution(contribution: ContributionDTO): void {
  this.contributionToRemove = contribution;
  this.showConfirmRemoveModal = true;
}

// Remove contribution
removeContribution(contributionId: number | undefined): void {
  if (!this.currentArticle || !contributionId) return;
  
  this.publicationService.removeContribution(this.currentArticle.id, contributionId)
    .subscribe({
      next: (data) => {
        console.log('Contribution removed successfully');
        this.refreshArticleAfterContribution();
        this.showConfirmRemoveModal = false;
        this.contributionToRemove = null;
      },
      error: (err) => {
        console.error('Failed to remove contribution', err);
        this.error = `Failed to remove contribution: ${err.message || err.statusText || 'Unknown error'}`;
      }
    });
}

// Add this helper method to reduce duplicate code
private refreshArticleAfterContribution(): void {
  if (!this.currentArticle) return;
  
  this.publicationService.getArticleById(this.currentArticle.id)
    .subscribe({
      next: (updatedArticle) => {
        // Update in articles list
        const index = this.articles.findIndex(a => a.id === updatedArticle.id);
        if (index !== -1) {
          this.articles[index] = updatedArticle;
          this.applyFilters();
        }
        
        // Update current article
        this.currentArticle = updatedArticle;
        
        // Reset form and handle modal (don't close the modal yet)
        this.resetContributionForm();
      },
      error: (err) => {
        console.error('Failed to refresh article after adding contribution', err);
      }
    });
}

// Reset the contribution form with all fields
resetContributionForm(): void {
  this.newContribution = {
    contributorId: null,
    type: 'AUTHOR',
    lieu: ''
  };
}

// For the status badge colors
getContributionTypeColor(type: string): string {
  switch (type) {
    case 'AUTHOR': return 'primary';
    case 'REVIEWER': return 'info';
    case 'EDITOR': return 'success';
    case 'CONTRIBUTOR': return 'warning';
    default: return 'secondary';
  }
}
}