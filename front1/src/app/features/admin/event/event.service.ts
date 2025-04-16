import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  eventType: string;
  status: string;
  createdBy: User;
  participants: User[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    if (error.status === 0) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, body was:`, 
        error.error
      );
    }
    
    // Return an observable with a user-facing error message
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

  getAllEvents(): Observable<Event[]> {
    console.log('Fetching all events...');
    return this.http.get<Event[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        retry(1), // Retry once before failing
        tap(events => console.log(`Fetched ${events.length} events`)),
        catchError(error => {
          console.error('Error fetching events:', error);
          // Fall back to mock data in development
          console.log('Falling back to mock data');
          return this.getMockEvents();
        })
      );
  }

  getEventById(id: number): Observable<Event> {
    console.log(`Fetching event with ID: ${id}`);
    return this.http.get<Event>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(event => console.log('Fetched event:', event)),
        catchError(this.handleError)
      );
  }

 // In event.service.ts
createEvent(eventData: Partial<Event>): Observable<Event> {
  console.log('Creating new event:', eventData);
  
  
  return this.http.post<Event>(this.apiUrl, eventData, { 
    headers: this.getAuthHeaders(),
    
  }).pipe(
    tap(event => console.log('Created event:', event)),
    catchError(this.handleError)
  );
}
  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    console.log(`Updating event ${id}:`, eventData);
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData, { headers: this.getAuthHeaders() })
      .pipe(
        tap(event => console.log('Updated event:', event)),
        catchError(this.handleError)
      );
  }

  deleteEvent(id: number): Observable<void> {
    console.log(`Deleting event with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders(),
      // Ensure consistent handling of the response
      observe: 'body' as const
    }).pipe(
      tap(() => console.log(`Deleted event with ID: ${id}`)),
      catchError(this.handleError)
    );
  }

  registerParticipant(eventId: number, userId: number): Observable<Event> {
    console.log(`Registering user ${userId} for event ${eventId}`);
    return this.http.post<Event>(
      `${this.apiUrl}/${eventId}/register/${userId}`, 
      {}, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(event => console.log('Updated event participants:', event)),
      catchError(this.handleError)
    );
  }
// In event.service.ts
// Register user
addParticipant(eventId: number, userId: number): Observable<Event> {
  return this.http.post<Event>(
    `${this.apiUrl}/${eventId}/register/${userId}`, 
    {}, 
    { headers: this.getAuthHeaders() }
  ).pipe(
    tap(event => console.log('Registered to event:', event)),
    catchError(this.handleError)
  );
}

// Unregister user
unregisterParticipant(eventId: number, userId: number): Observable<Event> {
  console.log(`Unregistering user ${userId} from event ${eventId}`);
  return this.http.delete<Event>(
    `${this.apiUrl}/${eventId}/unregister/${userId}`, 
    { headers: this.getAuthHeaders() }
  ).pipe(
    tap(event => console.log('Unregistered from event:', event)),
    catchError(this.handleError)
  );
}


  getEventParticipants(eventId: number): Observable<User[]> {
    console.log(`Fetching participants for event ${eventId}`);
    return this.http.get<User[]>(
      `${this.apiUrl}/${eventId}/participants`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(users => console.log(`Fetched ${users.length} participants`)),
      catchError(this.handleError)
    );
  }

  // Mock data for development/testing
  private getMockEvents(): Observable<Event[]> {
    const mockEvents: Event[] = [
      {
        id: 1,
        title: "Conférence sur l'IA Générative",
        description: "Une conférence axée sur les dernières avancées en matière d'intelligence artificielle générative.",
        startDate: new Date(2025, 4, 15, 9, 0),
        endDate: new Date(2025, 4, 15, 17, 0),
        location: "Campus Universitaire, Salle A-101",
        eventType: "CONFERENCE",
        status: "UPCOMING",
        createdBy: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          role: "ADMIN"
        },
        participants: [
          {
            id: 2,
            firstName: "Marie",
            lastName: "Dupont",
            email: "marie.dupont@example.com",
            role: "CHERCHEUR"
          },
          {
            id: 3,
            firstName: "Jean",
            lastName: "Martin",
            email: "jean.martin@example.com",
            role: "CHERCHEUR"
          },
          {
            id: 4,
            firstName: "Sophie",
            lastName: "Lefebvre",
            email: "sophie.lefebvre@example.com",
            role: "ETUDIANT"
          },
          {
            id: 5,
            firstName: "Thomas",
            lastName: "Dubois",
            email: "thomas.dubois@example.com",
            role: "ETUDIANT"
          }
        ]
      },
      {
        id: 2,
        title: "Webinaire: Introduction au Deep Learning",
        description: "Un webinaire d'introduction aux concepts fondamentaux du deep learning pour les débutants.",
        startDate: new Date(2025, 4, 20, 14, 0),
        endDate: new Date(2025, 4, 20, 16, 0),
        location: "En ligne (Zoom)",
        eventType: "WEBINAR",
        status: "UPCOMING",
        createdBy: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          role: "ADMIN"
        },
        participants: [
          {
            id: 3,
            firstName: "Jean",
            lastName: "Martin",
            email: "jean.martin@example.com",
            role: "CHERCHEUR"
          },
          {
            id: 6,
            firstName: "Pierre",
            lastName: "Moreau",
            email: "pierre.moreau@example.com",
            role: "ETUDIANT"
          }
        ]
      },
     
      
      
    ];
    
    return of(mockEvents);
  }
}