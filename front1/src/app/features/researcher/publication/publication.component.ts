// features/researcher/publications/publications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, FormModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';

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
  standalone: true,
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationsComponent implements OnInit {
  
  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    
  }

  filterPublications(): void {
    
  }

  deletePublication(id: string): void {
    
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'published': return 'badge-success';
      case 'submitted': return 'badge-info';
      case 'under_review': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}