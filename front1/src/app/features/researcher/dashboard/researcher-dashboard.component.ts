import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Article, PublicationService } from '../publication/publication.service';
import { Event, EventService } from '../event/event.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeModule, ButtonModule, CardModule, FormModule, SpinnerModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-researcher-dashboard',
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
    IconModule,
    FormModule
  ],
  providers: [PublicationService],
  templateUrl: './researcher-dashboard.component.html',
  styleUrls: ['./researcher-dashboard.component.scss']
})
export class ResearcherDashboardComponent implements OnInit {
  // Statistics
  articleCount: number = 0;
  eventsOrganizedCount: number = 0;
  eventsParticipatedCount: number = 0;
  
  // Recent activity
  recentArticles: Article[] = [];
  organizedEvents: Event[] = [];
  participatedEvents: Event[] = [];
  
  isLoading: boolean = true;
  userId: number | null = null;
  activeTab: string = 'publications'; // To track active tab

  constructor(
    private publicationService: PublicationService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    if (!this.userId) return;
    this.isLoading = true;
    
    // Load article count
    this.publicationService.countArticlesByUser(this.userId).subscribe({
      next: (count) => this.articleCount = count,
      error: (err) => console.error('Failed to load article count', err)
    });

    // Load events count
    // First get all events to filter for organized and participated
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        // Filter events organized by user
        this.organizedEvents = events.filter(event => 
          event.createdBy && event.createdBy.id === this.userId
        ).sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        ).slice(0, 5);
        
        this.eventsOrganizedCount = this.organizedEvents.length;
        
        // Filter events user is participating in
        this.participatedEvents = events.filter(event => 
          event.participants && 
          event.participants.some(participant => participant.id === this.userId) &&
          // Exclude events the user organized to avoid duplication
          (!event.createdBy || event.createdBy.id !== this.userId)
        ).sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        ).slice(0, 5);
        
        this.eventsParticipatedCount = this.participatedEvents.length;
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load events', err);
        this.isLoading = false;
      }
    });

    // Load recent articles
    this.publicationService.getArticlesByUserId(this.userId).subscribe({
      next: (articles) => {
        this.recentArticles = articles.slice(0, 5);
      },
      error: (err) => console.error('Failed to load recent articles', err)
    });
  }

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getEventStatus(event: Event): string {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) return 'Upcoming';
    if (now >= startDate && now <= endDate) return 'Ongoing';
    return 'Completed';
  }
  
  editEvent(eventId: number): void {
    console.log(`Navigating to edit event ${eventId}`);
    // You could use Router to navigate to the edit page
    // this.router.navigate(['/events', eventId, 'edit']);
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}