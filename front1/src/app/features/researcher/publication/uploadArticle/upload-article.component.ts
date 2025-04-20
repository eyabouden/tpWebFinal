import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
// CoreUI imports
import { 
  CardModule, 
  TableModule, 
  BadgeModule, 
  ButtonModule, 
  SpinnerModule, 
  BreadcrumbModule,
} from '@coreui/angular';

// Icons
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash, cilPencil, cilCheck, cilX, cilPeople, cilCalendar, cilFile, cilCloudDownload } from '@coreui/icons';


import { User, UserService } from '../../../admin/users/user.service';
import { DomainService } from '../../../admin/domaine/domaine.service';
import { Domain, PublicationService } from '../publication.service';


@Component({
  selector: 'app-upload-article',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    SpinnerModule,
    BreadcrumbModule,
  ],
  providers: [IconSetService, PublicationService, DomainService],
  templateUrl: './upload-article.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./upload-article.component.scss']
})
export class UploadArticleComponent implements OnInit {
  articleForm!: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';
  domains: Domain[] = [];
  isSidebarVisible = true;
  constructor(
    private articleService: PublicationService,
    private router: Router,
    private domainService: DomainService,
    private fb: FormBuilder 
  ) {}
  

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('c-sidebar-show', this.isSidebarVisible);
    }
  }

  sidebarItems = [
    {
      title: 'Dashboard',
      icon: 'cil-speedometer',
      route: '/researcher/dashboard'
    },
    {
      title: 'My Publications',
      icon: 'cil-book',
      route: '/researcher/publications'
    },
    {
      title: 'Submit Article',
      icon: 'cil-note-add',
      route: '/researcher/submit'
    },
    {
      title: 'Research Domains',
      icon: 'cil-applications',
      route: '/researcher/domains'
    },
    {
      title: 'Events',
      icon: 'cil-calendar',
      route: '/researcher/events'
    },
    {
      title: 'Profile',
      icon: 'cil-user',
      route: '/researcher/profile'
    }
  ];

  ngOnInit(): void {
    this.loadDomains();
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.articleForm = this.fb.group({
      titre: ['', Validators.required],
      doi: ['', Validators.required],
      keyword: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      domainId: [null]
    });
  }

  loadDomains(): void {
    this.domainService.getAllDomains().subscribe({
      next: (domains) => {
        this.domains = domains;
      },
      error: (error) => {
        console.error('Error loading domains:', error);
        this.errorMessage = 'Failed to load research domains. Please try again later.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    const articleData = this.articleForm.value;
  
    this.articleService.createArticle(articleData).subscribe({
      next: (createdArticle) => {
        console.log('Article created:', createdArticle);
  
        if (this.selectedFile && createdArticle.id) {
          this.uploadFile(createdArticle.id);
        } else {
          this.handleSuccessfulSubmission();
        }
      },
      error: (error) => {
        console.error('Error creating article:', error);
        this.errorMessage = 'Failed to create article. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
  
  
  uploadFile(articleId: number): void {
    if (!this.selectedFile) {
      this.handleSuccessfulSubmission();
      return;
    }

    this.articleService.uploadFile(articleId, this.selectedFile).subscribe({
      next: () => {
        this.handleSuccessfulSubmission();
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        this.errorMessage = 'Article was created but file upload failed. You can upload it later.';
        this.isSubmitting = false;
      }
    });
  }

  handleSuccessfulSubmission(): void {
    this.successMessage = 'Article submitted successfully!';
    this.isSubmitting = false;
    
    // Reset the form
    this.articleForm.reset();
    this.selectedFile = null;
    
    // Navigate back to publications list after a delay
    setTimeout(() => {
      this.router.navigate(['/researcher/publications']);
    }, 2000);
  }

  cancel(): void {
    this.articleForm.reset();
    this.selectedFile = null;
    this.router.navigate(['/researcher/publications']);
  }
}