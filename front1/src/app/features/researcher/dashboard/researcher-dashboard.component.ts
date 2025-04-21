// researcher-dashboard.component.ts additions

import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../admin/dashboard/statistics.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeModule, BreadcrumbModule, ButtonModule, CardModule, SpinnerModule, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { PublicationService, User } from '../publication/publication.service';
import { finalize, forkJoin } from 'rxjs';
import { EventService } from '../event/event.service';
// Interface for the LoginResponse
interface LoginResponse {
  id: number;
  // other properties like email, username, etc.
}

// Define interfaces for the data types
interface Article {
  id: number;
  titre: string;
  status: string;
  domain?: {
    id: number;
    nomDomaine: string;
  };
}

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  participants: any[];
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
}
interface NewsFeedEvent {
  id: number;
  title: string;
  startDate: string; // Ensure this is a string to match our NewsFeedItem
  endDate: string;
  location: string;
  status: string;
  participants: any[];
  createdBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

// Make a compatible Article interface
interface NewsFeedArticle {
  id: number;
  titre: string;
  status: string;
   createdAt?: any; // Optional created date
  domain?: {
    id: number;
    nomDomaine: string;
  };
}

interface NewsFeedItem {
  type: 'article' | 'event';
  data: any; // Using 'any' to avoid complex type matching
  date: string; // String date for sorting
}

@Component({
  selector: 'app-researcher-dashboard',
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
  templateUrl: './researcher-dashboard.component.html',
  styleUrls: ['./researcher-dashboard.component.scss']
})
export class ResearcherDashboardComponent implements OnInit {
  isLoading = true;
  activeTab = 'publications';
  isLoadingFeed = true;
  newsFeed: NewsFeedItem[] = [];
  
  
  // User statistics
  articleCount = 0;
  eventsOrganizedCount = 0;
  eventsParticipatedCount = 0;
  articles: Article[] = [];
  filteredArticles: Article[] = [];
   
  
  // Recent data - properly typed arrays
  recentArticles: Article[] = [];
  organizedEvents: Event[] = [];
  participatedEvents: Event[] = [];
   // Modal properties
   showModal = false;
   selectedItem: NewsFeedItem | null = null;

  constructor(
    private router: Router,
    private statisticsService: StatisticsService,
    private authService: AuthService,
    private publicationService : PublicationService,
    private eventService : EventService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Get current user ID
    const userId = this.getUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }
    
    // Load user statistics
     // Add loading the news feed after loading other stats
     this.statisticsService.getUserStatistics(userId).subscribe(
      data => {
        this.articleCount = data.articlesCreated || 0;
        this.eventsOrganizedCount = data.eventsCreated || 0;
        this.eventsParticipatedCount = data.eventsAttended || 0;
        
        // After loading stats, load the detailed data
        this.loadDetailedData(userId);
        
        // Load the news feed
        this.loadNewsFeed();
      },
      error => {
        console.error('Error loading user statistics:', error);
        this.isLoading = false;
      }
    );
  }
  // Add this method to load and build the news feed
  
  loadNewsFeed(): void {
    this.isLoadingFeed = true;
    
    forkJoin({
      articles: this.publicationService.getAllArticles(),
      events: this.eventService.getAllEvents()
    }).pipe(
      finalize(() => {
        this.isLoadingFeed = false;
      })
    ).subscribe({
      next: (results) => {
        // Filter articles to only include approved ones
        const approvedArticles = results.articles.filter(article => 
          article.status.toLowerCase() === 'approved');
        
        // Create article items using date from the current timestamp
        const articleItems = approvedArticles.map(article => ({
          type: 'article' as const,
          data: article,
          date: new Date().toISOString() // Just use current date if createdAt is not available
        }));
        
        // Create event items
        const eventItems = results.events.map(event => {
          // Get date string safely
          const dateStr = typeof event.startDate === 'string' 
            ? event.startDate 
            : new Date().toISOString();
            
          return {
            type: 'event' as const,
            data: event,
            date: dateStr
          };
        });
        
        // Combine and sort by date
        this.newsFeed = [...articleItems, ...eventItems].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      },
      error: (error) => {
        console.error('Error loading news feed:', error);
        this.isLoadingFeed = false;
      }
    });
  }
  
  private getUserId(): number | null {
    // Extract the user ID from the LoginResponse
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && 'id' in currentUser) {
      return currentUser.id;
    }
    
    console.error('No valid user ID found');
    return null;
  }
  openItemDetails(item: NewsFeedItem, event: MouseEvent): void {
    event.preventDefault();
    this.selectedItem = item;
    this.showModal = true;
    // Optional: prevent page scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }
  
  closeModal(event: MouseEvent): void {
    event.preventDefault();
    this.showModal = false;
    this.selectedItem = null;
    // Re-enable page scrolling
    document.body.style.overflow = 'auto';
  }
  
  // Helper methods for the event details
  canJoinOrLeaveEvent(): boolean {
    // Logic to determine if current user can join/leave the event
    // Example implementation - you'll need to customize this
    if (!this.selectedItem || this.selectedItem.type !== 'event') {
      return false;
    }
    
    const event = this.selectedItem.data;
    const now = new Date();
    const startDate = new Date(event.startDate);
    
    // Can only join/leave upcoming events
    return now < startDate;
  }
  
  // Fix the implicit any type for the parameter
isParticipatingInEvent(): boolean {
  // Logic to check if user is already participating in the event
  if (!this.selectedItem || this.selectedItem.type !== 'event' || !this.selectedItem.data.participants) {
    return false;
  }
  
  const userId = this.getUserId();
  return this.selectedItem.data.participants.some((p: any) => p.id === userId);
}
  
  loadDetailedData(userId: number): void {
    // Initialize loading state
    this.isLoading = true;
    
    // Use forkJoin to combine multiple observables and wait for all to complete
    forkJoin({
      articlesCount: this.statisticsService.getArticleCountByUser(userId),
      eventsCount: this.statisticsService.getEventCountByUser(userId),
      eventsAttended: this.statisticsService.getEventsAttendedByUser(userId),
      userStats: this.statisticsService.getUserStatistics(userId)
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (results) => {
        // Update the individual statistics properties
        this.articleCount = results.articlesCount;
        this.eventsOrganizedCount = results.eventsCount;
        this.eventsParticipatedCount = results.eventsAttended;
        
        // Call methods to load the actual content
        this.loadArticles();
        this.loadEvents();
        this.loadParticipatedEvents();
      },
      error: (error) => {
        console.error('Error loading user statistics:', error);
        // Handle error appropriately (show message, etc.)
        this.isLoading = false;
      }
    });
  }

  loadArticles(): void {
   
  }

  loadEvents(): void {
    // This would be a separate service call to get events organized by the user
    // For example:
    // this.eventService.getEventsByCreator(this.authService.getCurrentUserId()).subscribe(...)
  }

  loadParticipatedEvents(): void {
    // This would be a separate service call to get events where user is a participant
    // For example:
    // this.eventService.getEventsParticipatedByUser(this.authService.getCurrentUserId()).subscribe(...)
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getEventStatus(event: any): string {
    // Logic to determine event status based on dates
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) {
      return 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
      return 'Ongoing';
    } else {
      return 'Completed';
    }
  }

  editEvent(eventId: number): void {
    // Handle edit event
    // For example: this.router.navigate(['/events/edit', eventId]);
  }
}