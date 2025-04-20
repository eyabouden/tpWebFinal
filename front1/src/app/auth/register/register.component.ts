// src/app/auth/register/register.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true, // ✅ Ensure standalone is enabled
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import forms module inside component
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error: Error) => {  // Type the error parameter
        this.isLoading = false;
        
        // Handle both Error objects and string error messages
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        this.errorMessage = errorMessage
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length)
          .join('\n');  // Rejoin with newlines if needed
      
        console.error('Registration error details:', error);
      }
    });
  }
}