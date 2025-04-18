import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, FormModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DomainService } from './domaine.service';
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash, cilPencil, cilCheck, cilX } from '@coreui/icons';

import { RouterModule } from '@angular/router';
interface Domain {
  id: number;
  nomDomaine: string;
  articles?: any[];
}

@Component({
  selector: 'app-domains',
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
  providers: [DomainService, IconSetService],
  templateUrl: './domaine.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./domaine.component.scss']
})
export class DomainComponent implements OnInit {
  domains: Domain[] = [];
  loading = true;
  error: string | null = null;
  editingDomainId: number | null = null;
  editForm: any = {};
  
  selectedDomain: Domain | null = null;
  showDomainDetails = false;
  
  newDomain: { nomDomaine: string } = { nomDomaine: '' };
  isAddingDomain = false;

  constructor(
    private domainService: DomainService,
    private iconSetService: IconSetService,
    private router: Router
  ) {
    // Register the icons
    iconSetService.icons = { cilTrash, cilPencil, cilCheck, cilX };
  }

  ngOnInit(): void {
    this.loadDomains();
  }

  loadDomains(): void {
    this.loading = true;
    this.domainService.getAllDomains()
      .subscribe({
        next: (data) => {
          this.domains = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load domains. Please try again.';
          this.loading = false;
          console.error('Error loading domains:', err);
        }
      });
  }

  viewDomain(domain: Domain): void {
    // Load domain with its articles
    this.domainService.getDomainWithArticles(domain.id)
      .subscribe({
        next: (domainWithArticles) => {
          this.selectedDomain = domainWithArticles;
          this.showDomainDetails = true;
        },
        error: (err) => {
          console.error('Error loading domain details:', err);
          alert('Failed to load domain details. Please try again.');
        }
      });
  }

  isEditing(domainId: number): boolean {
    return this.editingDomainId === domainId;
  }

  editDomain(domain: Domain): void {
    this.editingDomainId = domain.id;
    // Create a copy of the domain object to edit
    this.editForm = { ...domain };
  }

  cancelEdit(): void {
    this.editingDomainId = null;
    this.editForm = {};
  }

  saveDomain(): void {
    if (!this.editingDomainId) return;
    
    this.domainService.updateDomain(this.editingDomainId, this.editForm)
      .subscribe({
        next: (updatedDomain) => {
          // Update the domain in the list
          const index = this.domains.findIndex(d => d.id === this.editingDomainId);
          if (index !== -1) {
            this.domains[index] = updatedDomain;
          }
          this.editingDomainId = null;
          this.editForm = {};
        },
        error: (err) => {
          console.error('Error updating domain:', err);
          alert('Failed to update domain. Please try again.');
        }
      });
  }

  showAddDomainForm(): void {
    this.isAddingDomain = true;
    this.newDomain = { nomDomaine: '' };
  }

  cancelAddDomain(): void {
    this.isAddingDomain = false;
  }

  addDomain(): void {
    if (!this.newDomain.nomDomaine.trim()) {
      alert('Le nom du domaine est obligatoire');
      return;
    }

    this.domainService.createDomain(this.newDomain)
      .subscribe({
        next: (domain) => {
          this.domains.push(domain);
          this.isAddingDomain = false;
          this.newDomain = { nomDomaine: '' };
        },
        error: (err) => {
          console.error('Error creating domain:', err);
          alert('Failed to create domain. Please try again.');
        }
      });
  }

  deleteDomain(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce domaine?')) {
      this.domainService.deleteDomain(id)
        .subscribe({
          next: () => {
            this.domains = this.domains.filter(domain => domain.id !== id);
          },
          error: (err) => {
            console.error('Error deleting domain:', err);
            alert('Failed to delete domain. Please try again.');
          }
        });
    }
  }

  getArticleCount(domain: Domain): number {
    return domain.articles?.length || 0;
  }
}