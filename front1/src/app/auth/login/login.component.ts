// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.models';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful:', response);
          console.log('Role received:', response.role);
          
          // Navigate based on role
          if (response.role === Role.ADMIN) {
            this.router.navigate(['/dashboard/admin']);
          } else if (response.role === Role.MODERATEUR) {
            this.router.navigate(['/researcher']);
          } else if (response.role === Role.UTILISATEUR) {
            this.router.navigate(['/home']);
          } else {
            console.warn('Unknown role:', response.role);
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else if (error.status === 403) {
            this.errorMessage = 'Access denied. You do not have permission to log in.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again later.';
          }
        }
      });
  }
}