import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, BreadcrumbModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash, cilPencil, cilCheck, cilX, cilPeople, cilCalendar } from '@coreui/icons';
import { RouterModule } from '@angular/router';
import { EventService, Event, User } from './event.service';
import { UserService } from './user.service'; // You'll need to create this

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    SpinnerModule,
    BreadcrumbModule,
    IconModule,
  ],
  providers: [IconSetService, EventService],
  templateUrl: './event.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./evenr.component.scss']
})
export class ResearcherEventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  currentFilter: string = 'all';
  selectedEvent: Event | null = null;
  deleteModal: any;
  participantsModal: any;
  removeParticipantModal: any;
  selectedParticipant: User | null = null;
  
  // New properties for participant management
  showAddParticipantForm: boolean = false;
  userSearchTerm: string = '';
  filteredUsers: User[] = [];
  allUsers: User[] = [];
  searchingUsers: boolean = false;
  
  constructor(
    private eventService: EventService,
    private router: Router,
    private iconSetService: IconSetService,
    private userService: UserService // Add this service
  ) {
    // Register required icons
    iconSetService.icons = { cilTrash, cilPencil, cilCheck, cilX, cilPeople, cilCalendar };
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadAllUsers();
    
    // Initialize Bootstrap modals with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.initModals();
    }, 500);
  }
  
  initModals(): void {
    // Initialize all modals
    const deleteModalEl = document.getElementById('deleteModal');
    const participantsModalEl = document.getElementById('participantsModal');
    const removeParticipantModalEl = document.getElementById('removeParticipantModal');
    
    // Initialize delete modal
    if (deleteModalEl) {
      try {
        this.deleteModal = new bootstrap.Modal(deleteModalEl);
      } catch (error) {
        console.error('Error initializing delete modal:', error);
      }
    }
    
    // Initialize participants modal
    if (participantsModalEl) {
      try {
        this.participantsModal = new bootstrap.Modal(participantsModalEl);
      } catch (error) {
        console.error('Error initializing participants modal:', error);
      }
    }
    
    // Initialize remove participant confirmation modal
    if (removeParticipantModalEl) {
      try {
        this.removeParticipantModal = new bootstrap.Modal(removeParticipantModalEl);
      } catch (error) {
        console.error('Error initializing remove participant modal:', error);
      }
    }
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data.map(event => this.updateEventStatus(event));
        this.filteredEvents = [...this.events];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.loading = false;
        this.showNotification('error', 'Erreur lors du chargement des événements.');
      }
    });
  }
  
  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showNotification('error', 'Erreur lors du chargement des utilisateurs.');
      }
    });
  }


  // Keep the rest of the component methods as they are...
  // ...

  confirmDelete(event: Event): void {
    console.log('Confirming delete for event:', event);
    this.selectedEvent = event;
    
    if (this.deleteModal) {
      try {
        this.deleteModal.show();
      } catch (error) {
        console.error('Error showing delete modal:', error);
        
        // Re-initialize modal if showing fails
        const deleteModalEl = document.getElementById('deleteModal');
        if (deleteModalEl) {
          try {
            this.deleteModal = new bootstrap.Modal(deleteModalEl);
            this.deleteModal.show();
          } catch (innerError) {
            console.error('Failed to re-initialize delete modal:', innerError);
            // Fallback - ask for confirmation directly
            if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
              this.deleteEvent();
            }
          }
        } else {
          // Fallback - ask for confirmation directly
          if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
            this.deleteEvent();
          }
        }
      }
    } else {
      // Modal not initialized, try to initialize it
      const deleteModalEl = document.getElementById('deleteModal');
      if (deleteModalEl) {
        try {
          this.deleteModal = new bootstrap.Modal(deleteModalEl);
          this.deleteModal.show();
        } catch (error) {
          console.error('Error initializing modal on demand:', error);
          // Fallback - ask for confirmation directly
          if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
            this.deleteEvent();
          }
        }
      } else {
        console.error('Delete modal element not found');
        // Fallback - ask for confirmation directly
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
          this.deleteEvent();
        }
      }
    }
  }

  deleteEvent(): void {
    if (!this.selectedEvent) {
      console.error('No event selected for deletion');
      return;
    }
    
    const eventId = this.selectedEvent.id;
    const eventTitle = this.selectedEvent.title;
    
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        console.log(`Event ${eventId} deleted successfully`);
        
        // Remove event from arrays
        this.events = this.events.filter(e => e.id !== eventId);
        this.filteredEvents = this.filteredEvents.filter(e => e.id !== eventId);
        
        // Hide modal if it exists
        if (this.deleteModal) {
          try {
            this.deleteModal.hide();
          } catch (error) {
            console.error('Error hiding delete modal:', error);
          }
        }
        
        this.showNotification('success', `Événement "${eventTitle}" supprimé avec succès.`);
        this.selectedEvent = null;
      },
      error: (error) => {
        console.error(`Error deleting event ${eventId}:`, error);
        
        // Hide modal if it exists
        if (this.deleteModal) {
          try {
            this.deleteModal.hide();
          } catch (error) {
            console.error('Error hiding delete modal:', error);
          }
        }
        
        this.showNotification('error', `Erreur lors de la suppression de l'événement "${eventTitle}".`);
      }
    });
  }

  // Simple notification method (can be enhanced with a proper toast component if needed)
  showNotification(type: 'success' | 'error' | 'info', message: string): void {
    console.log(`[${type}]: ${message}`);
    
    // You could add temporary toast notifications here
    // For example, using a simple DOM-based approach:
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
    
    // Add some basic styling
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

  // Keep the remaining utility methods as they are...


  // Auto-update event status based on current date
  updateEventStatus(event: Event): Event {
    const updatedEvent = { ...event };
  
    try {
      // Normalize today to start of day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Convert startDate and endDate to valid Date objects
      const startDate = event.startDate ? new Date(event.startDate) : null;
      const endDate = event.endDate ? new Date(event.endDate) : null;
  
      if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        // Normalize dates to avoid timezone issues
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
  
        if (today < startDate) {
          updatedEvent.status = 'UPCOMING';
        } else if (today >= startDate && today <= endDate) {
          updatedEvent.status = 'ONGOING';
        } else if (today > endDate) {
          updatedEvent.status = 'COMPLETED';
        }
      } else {
        console.warn('Invalid start or end date for event:', event);
        updatedEvent.status = 'UNKNOWN';
      }
    } catch (error) {
      console.error('Error parsing event dates:', error);
      updatedEvent.status = 'UNKNOWN';
    }
  
    return updatedEvent;
  }
  

  searchEvents(): void {
    if (!this.searchTerm.trim()) {
      this.filterEvents(this.currentFilter);
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredEvents = this.events.filter(event => 
      event.title.toLowerCase().includes(term) || 
      event.description.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term) ||
      event.eventType.toLowerCase().includes(term)
    );
  }

  filterEvents(filter: string): void {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredEvents = [...this.events];
      return;
    }
    
    this.filteredEvents = this.events.filter(event => 
      event.status.toLowerCase() === filter.toLowerCase()
    );
  }

  openCreateEventModal(): void {
    this.router.navigate(['researcher/events/create']);
  }
  
  editEvent(event: Event): void {
    this.router.navigate([`researcher/events/edit/${event.id}`]);
  }
  
  viewEvent(event: Event): void {
    this.router.navigate([`researcher/events/view/${event.id}`]);
  }

 

  removeParticipant(participant: User): void {
    if (!this.selectedEvent) return;
  
    this.eventService.unregisterParticipant(this.selectedEvent.id, participant.id)
      .subscribe({
        next: (updatedEvent: Event) => {
          this.updateEventLists(updatedEvent);
          this.showNotification('success', `${participant.firstName} retiré avec succès.`);
        },
        error: (error) => {
          console.error('Erreur lors du retrait:', error);
          // Optional fallback
          if (this.selectedEvent && this.selectedEvent.participants) {
            this.selectedEvent.participants = this.selectedEvent.participants.filter(p => p.id !== participant.id);
            this.showNotification('info', `Participant retiré localement.`);
          }
        }
      });
  }
  
  // Helper
  private updateEventLists(updatedEvent: Event): void {
    const updateList = (list: Event[]) => {
      const idx = list.findIndex(e => e.id === updatedEvent.id);
      if (idx !== -1) list[idx] = updatedEvent;
    };
  
    updateList(this.events);
    updateList(this.filteredEvents);
    this.selectedEvent = updatedEvent;
  }
  



  getInitials(user: User): string {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getEventIconClass(eventType: string): string {
    const typeMap: {[key: string]: string} = {
      'CONFERENCE': 'bg-primary',
      'WEBINAR': 'bg-info',
      'WORKSHOP': 'bg-success',
      'SYMPOSIUM': 'bg-warning',
      'SEMINAR': 'bg-secondary'
    };
    
    return `event-type-icon ${typeMap[eventType] || 'bg-light'}`;
  }

  getEventTypeIcon(eventType: string): string {
    const iconMap: {[key: string]: string} = {
      'CONFERENCE': 'bi bi-people-fill',
      'WEBINAR': 'bi bi-laptop',
      'WORKSHOP': 'bi bi-tools',
      'SYMPOSIUM': 'bi bi-easel2',
      'SEMINAR': 'bi bi-book'
    };
    
    return iconMap[eventType] || 'bi bi-calendar-event';
  }

  getEventTypeBadgeClass(eventType: string): string {
    const classMap: {[key: string]: string} = {
      'CONFERENCE': 'bg-primary',
      'WEBINAR': 'bg-info',
      'WORKSHOP': 'bg-success',
      'SYMPOSIUM': 'bg-warning',
      'SEMINAR': 'bg-secondary'
    };
    
    return classMap[eventType] || 'bg-light text-dark';
  }

  getStatusBadgeClass(status: string): string {
    const classMap: {[key: string]: string} = {
      'UPCOMING': 'bg-info',
      'ONGOING': 'bg-success',
      'COMPLETED': 'bg-secondary',
      'CANCELLED': 'bg-danger'
    };
    
    return classMap[status] || 'bg-light text-dark';
  }

  getRoleBadgeClass(role: string): string {
    const classMap: {[key: string]: string} = {
      'ADMIN': 'bg-danger',
      'MODERATEUR': 'bg-warning',
      'CHERCHEUR': 'bg-primary',
      'ETUDIANT': 'bg-info'
    };
    
    return classMap[role] || 'bg-light text-dark';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  //view participants 
   // Participants modal methods
   viewParticipants(event: Event): void {
    this.selectedEvent = event;
    this.showAddParticipantForm = false;
    this.userSearchTerm = '';
    this.filteredUsers = [];
    
    if (this.participantsModal) {
      try {
        this.participantsModal.show();
      } catch (error) {
        console.error('Error showing participants modal:', error);
        this.recreateAndShowModal('participantsModal');
      }
    } else {
      this.recreateAndShowModal('participantsModal');
    }
  }
  
  // Helper method to recreate and show a modal if it fails
  recreateAndShowModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      try {
        if (modalId === 'participantsModal') {
          this.participantsModal = new bootstrap.Modal(modalEl);
          this.participantsModal.show();
        } else if (modalId === 'removeParticipantModal') {
          this.removeParticipantModal = new bootstrap.Modal(modalEl);
          this.removeParticipantModal.show();
        } else if (modalId === 'deleteModal') {
          this.deleteModal = new bootstrap.Modal(modalEl);
          this.deleteModal.show();
        }
      } catch (error) {
        console.error(`Error recreating ${modalId}:`, error);
      }
    }
  }

  openAddParticipantForm(): void {
    this.showAddParticipantForm = true;
    this.userSearchTerm = '';
    this.filteredUsers = [];
  }

  cancelAddParticipant(): void {
    this.showAddParticipantForm = false;
    this.userSearchTerm = '';
    this.filteredUsers = [];
  }

  searchUsers(): void {
    if (!this.userSearchTerm.trim()) {
      this.filteredUsers = [];
      return;
    }
    
    this.searchingUsers = true;
    const term = this.userSearchTerm.toLowerCase();

    // Normally you would call an API endpoint here
    // For now, we'll filter from allUsers we loaded earlier
    setTimeout(() => {
      this.filteredUsers = this.allUsers.filter(user => 
        user.firstName.toLowerCase().includes(term) || 
        user.lastName.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
      this.searchingUsers = false;
    }, 500); // Simulated delay
  }

  isUserAlreadyParticipant(user: User): boolean {
    if (!this.selectedEvent || !this.selectedEvent.participants) return false;
    return this.selectedEvent.participants.some(p => p.id === user.id);
  }

  // addParticipant(user: User): void {
  //   if (!this.selectedEvent) {
  //     console.error("No event selected");
  //     return;
  //   }
    
  //   this.eventService.addParticipant(this.selectedEvent.id, user.id)
  //     .subscribe({
  //       next: (updatedEvent) => {
  //         // Update the event in your list
  //         const index = this.events.findIndex(e => e.id === updatedEvent.id);
  //         if (index !== -1) {
  //           this.events[index] = updatedEvent;
  //         }
  //         this.selectedEvent = updatedEvent;
  //         this.showAddParticipantForm = false;
  //       },
  //       error: (error) => {
  //         console.error('Error adding participant:', error);
  //       }
  //     });
  // }
  addParticipant(user: User): void {
    if (!this.selectedEvent) return;
  
    this.eventService.addParticipant(this.selectedEvent.id, user.id)
      .subscribe({
        next: (updatedEvent: Event) => {
          this.updateEventLists(updatedEvent);
          this.showNotification('success', `${user.firstName} ajouté avec succès.`);
          this.showAddParticipantForm = false;
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout du participant:', error);
          this.showNotification('error', `Impossible d’ajouter ${user.firstName}.`);
        }
      });
  }
  

  confirmRemoveParticipant(participant: User): void {
    this.selectedParticipant = participant;
    
    if (this.removeParticipantModal) {
      try {
        this.removeParticipantModal.show();
      } catch (error) {
        console.error('Error showing remove participant modal:', error);
        this.recreateAndShowModal('removeParticipantModal');
      }
    } else {
      this.recreateAndShowModal('removeParticipantModal');
    }
  }

  // removeParticipant(participant: User | null): void {
  //   if (!participant || !this.selectedEvent) return;
    
  //   this.eventService.unregisterParticipant(this.selectedEvent.id, participant.id).subscribe({
  //     next: (updatedEvent: Event) => {
  //       // Update the event in arrays
  //       this.updateEventInArrays(updatedEvent);
        
  //       // Hide modal
  //       if (this.removeParticipantModal) {
  //         try {
  //           this.removeParticipantModal.hide();
  //         } catch (error) {
  //           console.error('Error hiding remove participant modal:', error);
  //         }
  //       }
        
  //       this.showNotification('success', `${participant.firstName} ${participant.lastName} retiré avec succès.`);
  //       this.selectedParticipant = null;
  //     },
  //     error: (error) => {
  //       console.error('Error removing participant:', error);
        
  //       // Hide modal
  //       if (this.removeParticipantModal) {
  //         try {
  //           this.removeParticipantModal.hide();
  //         } catch (error) {
  //           console.error('Error hiding remove participant modal:', error);
  //         }
  //       }
        
  //       this.showNotification('error', `Erreur lors de la suppression du participant.`);
  //     }
  //   });
  // }

  // Helper method to update event in all arrays
  updateEventInArrays(updatedEvent: Event): void {
    // Update the event in events array
    const eventIndex = this.events.findIndex(e => e.id === updatedEvent.id);
    if (eventIndex !== -1) {
      this.events[eventIndex] = updatedEvent;
    }
    
    // Update the event in filtered events array
    const filteredIndex = this.filteredEvents.findIndex(e => e.id === updatedEvent.id);
    if (filteredIndex !== -1) {
      this.filteredEvents[filteredIndex] = updatedEvent;
    }
    
    // Update selected event
    if (this.selectedEvent && this.selectedEvent.id === updatedEvent.id) {
      this.selectedEvent = updatedEvent;
    }
  }

  // Keep all other methods from your original component...
  // (Only adding the new methods above)
  
 
}