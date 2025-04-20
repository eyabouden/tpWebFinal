import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
 // Adjust path as needed
import { AuthService } from '../../../auth/services/auth.service'; // Adjust path as needed
import { UserService } from '../../admin/researchers/researchers.service';
import { User } from './user.model';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  providers: [UserService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;
  showEditModal = false;
  editUserForm: Partial<User> = {};
  isSaving = false;
  saveSuccess = false;
  
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('ProfileComponent initialized');
    this.fetchUserProfile();
  }
  
  fetchUserProfile(): void {
    console.log('Fetching user profile');
    
    const userId = this.authService.getUserId();
    console.log('User ID from authService:', userId);
    
    if (!userId) {
      this.errorMessage = 'No user ID available. You may need to log in again.';
      console.error(this.errorMessage);
      return;
    }
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        console.log('User data received:', user);
        this.user = user;
      },
      error: (err) => {
        this.errorMessage = `Failed to load profile: ${err.status} ${err.statusText}`;
        console.error('Error details:', err);
      }
    });
  }

  editProfile(): void {
    if (this.user) {
      // Create a copy of user data for editing
      this.editUserForm = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        institution: this.user.institution || '',
        position: this.user.position || '',
        department: this.user.department || '',
        grade: this.user.grade || ''
      };
      
      // Open the edit modal
      this.showEditModal = true;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.saveSuccess = false;
  }

  saveUserProfile(): void {
    if (!this.user || !this.user.id) return;
    
    this.isSaving = true;
    
    this.userService.updateUser(this.user.id, this.editUserForm).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isSaving = false;
        this.saveSuccess = true;
        
        // Close modal after 2 seconds to show success message
        setTimeout(() => {
          this.closeEditModal();
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = `Failed to update profile: ${err.status} ${err.statusText}`;
        console.error('Error updating profile:', err);
        this.isSaving = false;
      }
    });
  }

  changePassword(): void {
    alert('Change Password clicked (connect to backend later)');
  }
}