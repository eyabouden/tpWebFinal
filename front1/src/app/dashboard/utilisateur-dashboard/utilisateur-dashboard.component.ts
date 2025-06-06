// src/app/dashboard/admin-dashboard/admin-dashboard.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utilisateur-dashboard',
  templateUrl: './utilisateur-dashboard.component.html',
})
export class UtilisateurDashboardComponent {
  userName: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.email;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}