import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule, ButtonModule, FormModule, SpinnerModule, BreadcrumbModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    FormModule,
    SpinnerModule,
    BreadcrumbModule,
    IconModule,
  ],
  templateUrl: './event-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./event-detail.component.scss']
})
export class ResearcherEventDetailComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  isSidebarVisible = true;
    isViewMode = false;
  eventId: number | null = null;
  pageTitle = 'Créer un événement';
  
  // Event type options
  eventTypes = [
    { value: 'CONFERENCE', label: 'Conférence', icon: 'bi-megaphone' },
    { value: 'WEBINAR', label: 'Webinaire', icon: 'bi-laptop' },
    { value: 'WORKSHOP', label: 'Atelier', icon: 'bi-tools' },
    { value: 'NETWORKING', label: 'Réseautage', icon: 'bi-people' },
    { value: 'SEMINAR', label: 'Séminaire', icon: 'bi-journal-text' },
    { value: 'OTHER', label: 'Autre', icon: 'bi-calendar-event' }
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      startDate: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['17:00', Validators.required],
      location: ['', Validators.required],
      eventType: ['CONFERENCE', Validators.required],
      maxParticipants: [null],
      registrationDeadline: [''],
      
      isPublic: [true]
    }, { validators: [this.dateRangeValidator] });
  }
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
    // First, check the route data to determine the mode
    this.route.data.subscribe(data => {
      console.log('Route data:', data); // For debugging
      this.isViewMode = data['mode'] === 'view';
      this.isEditMode = data['mode'] === 'edit';
    });
  
    // Then check for an ID in the route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.eventId = +params['id'];
        
        if (this.isViewMode) {
          this.pageTitle = 'Détails de l\'événement';
        } else if (this.isEditMode) {
          this.pageTitle = 'Modifier l\'événement';
        }
        
        // Only load event data if we have an ID
        if (this.eventId !== null) {
          this.loadEventData(this.eventId);
          
          // If in view mode, disable the form after data is loaded
          if (this.isViewMode) {
            this.eventForm.disable();
          }
        }
      } else {
        // New event - set default dates
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        this.eventForm.patchValue({
          startDate: this.formatDateForInput(today),
          endDate: this.formatDateForInput(tomorrow)
        });
      }
    });
  }

getEventTypeIcon(eventTypeValue: string): string {
  const eventType = this.eventTypes.find(type => type.value === eventTypeValue);
  return eventType ? eventType.icon : 'bi-calendar-event';
}

getEventTypeLabel(eventTypeValue: string): string {
  const eventType = this.eventTypes.find(type => type.value === eventTypeValue);
  return eventType ? eventType.label : 'Autre';
}

getFormattedDate(dateStr: string, timeStr: string): string {
  if (!dateStr) return '';
  
  const date = new Date(`${dateStr}T${timeStr || '00:00'}`);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
  
  editEvent(): void {
    if (this.isViewMode && this.eventId) {
      this.router.navigate(['researcher/events/edit/', this.eventId]);
    }
  }
  
 

  loadEventData(eventId: number): void {
    this.loading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        // Format dates for the form
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          startDate: this.formatDateForInput(startDate),
          startTime: this.formatTimeForInput(startDate),
          endDate: this.formatDateForInput(endDate),
          endTime: this.formatTimeForInput(endDate),
          location: event.location,
          eventType: event.eventType,
          // Add other fields as needed based on your backend model
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading event data:', error);
        this.showNotification('error', 'Erreur lors du chargement des données de l\'événement.');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
      this.showNotification('error', 'Veuillez corriger les erreurs du formulaire.');
      return;
    }
    
    this.submitting = true;
    
    // Combine date and time fields into Date objects
    const formValues = this.eventForm.value;
    const startDateTime = this.combineDateTime(formValues.startDate, formValues.startTime);
    const endDateTime = this.combineDateTime(formValues.endDate, formValues.endTime);
    
    // Create the event data object
    const eventData = {
      title: formValues.title,
      description: formValues.description,
      startDate: startDateTime,
      endDate: endDateTime,
      location: formValues.location,
      eventType: formValues.eventType,
      maxParticipants: formValues.maxParticipants || null,
      registrationDeadline: formValues.registrationDeadline || null,
      isPublic: formValues.isPublic
    };
    
    if (this.isEditMode && this.eventId) {
      // Update existing event
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          this.submitting = false;
          this.showNotification('success', 'Événement mis à jour avec succès!');
          this.router.navigate(['/researcher/events']);
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.submitting = false;
          this.showNotification('error', 'Erreur lors de la mise à jour de l\'événement.');
        }
      });
    } else {
      // Create new event
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.submitting = false;
          this.showNotification('success', 'Événement créé avec succès!');
          this.router.navigate(['/researcher/events']);
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.submitting = false;
          this.showNotification('error', 'Erreur lors de la création de l\'événement.');
        }
      });
    }
  }

  // Utility method to show notifications
  showNotification(type: 'success' | 'error' | 'info', message: string): void {
    console.log(`[${type}]: ${message}`);
    
    const alertClass = type === 'success' ? 'alert-success' : 
                       type === 'error' ? 'alert-danger' : 
                       'alert-info';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show notification-toast`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add styling
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }

  // Utility methods for date handling
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTimeForInput(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  combineDateTime(dateStr: string, timeStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  // Custom validator for date range
  dateRangeValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;
    const startTime = formGroup.get('startTime')?.value;
    const endTime = formGroup.get('endTime')?.value;
    
    if (!startDate || !endDate || !startTime || !endTime) {
      return null;
    }
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    if (start >= end) {
      return { 'dateRange': true };
    }
    
    return null;
  }

  // Helper for form field validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Ce champ est requis.';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Minimum ${minLength} caractères requis.`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `Maximum ${maxLength} caractères autorisés.`;
    }
    
    return 'Champ non valide.';
  }

  hasDateRangeError(): boolean {
    return this.eventForm.hasError('dateRange');
  }

  cancel(): void {
    this.router.navigate(['/researcher/events']);
  }
}