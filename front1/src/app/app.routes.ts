import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
// import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';

import { UtilisateurDashboardComponent } from './dashboard/utilisateur-dashboard/utilisateur-dashboard.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './features/home/home.component';
import { UsersComponent } from './features/admin/users/users.component';
import { EventComponent } from './features/admin/event/event.component';
import { EventDetailComponent } from './features/admin/event/event-detail/event-detail.component';
import { PublicationComponent } from './features/admin/publications/publication.component';
import { ResearchersComponent } from './features/admin/researchers/researchers-management.component';

import { ResearcherDashboardComponent } from './features/researcher/dashboard/researcher-dashboard.component';
import { ResearcherLayoutComponent } from './layouts/researcher-layout/researcher-layout.component';
export const appRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },
     
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      ]
  },
  {
    path: 'researcher',
    component: ResearcherLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ResearcherDashboardComponent },
      {
        path: 'publications',
        loadComponent: () =>
          import('./features/researcher/publication/publication.component').then(m => m.PublicationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/researcher/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'submit',
        loadComponent: () =>
          import('./features/researcher/uploadArticle/upload-article.component').then(m => m.UploadArticleComponent)
      },{
        path: 'bookmarks',
        loadComponent: () =>
          import('./features/researcher/bookmark/bookmark.component').then(m => m.BookmarkComponent)
      },
     
      // Add other researcher routes as needed
    ]
  },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: 'dashboard/event', component: EventComponent },
  { path: 'dashboard/event/detail', component: EventDetailComponent },
  { path: 'dashboard/admin/users', component: UsersComponent },
  { path: 'dashboard/admin/searcher', component: ResearchersComponent },
  { path: 'dashboard/admin/searcher/publication', component: PublicationComponent },
  { path: 'dashboard/utilisateur', component: UtilisateurDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
