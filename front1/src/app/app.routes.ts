import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
// import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { ModerateurDashboardComponent } from './dashboard/moderateur-dashboard/moderateur-dashboard.component';
import { UtilisateurDashboardComponent } from './dashboard/utilisateur-dashboard/utilisateur-dashboard.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './features/home/home.component';
import { UsersComponent } from './features/admin/users/users.component';
import { EventComponent } from './features/admin/event/event.component';
import { EventDetailComponent } from './features/admin/event/event-detail/event-detail.component';
import { PublicationComponent } from './features/admin/publications/publication.component';
import { ResearchersComponent } from './features/admin/researchers/researchers-management.component';
export const appRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
     
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
  { path: 'dashboard/moderateur', component: ModerateurDashboardComponent },
  { path: 'dashboard/utilisateur', component: UtilisateurDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
