import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule, TableModule, BadgeModule, ButtonModule, SpinnerModule, FormModule, DropdownModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService, User } from './researchers.service';
import { IconSetService } from '@coreui/icons-angular';
import { cilTrash, cilPencil, cilCheck, cilX, cilUser } from '@coreui/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-researchers',
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
    FormModule,
    DropdownModule
  ],
  providers: [UserService, IconSetService],
  templateUrl: './researchers-management.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./researchers-management.component.scss']
})
export class ResearchersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  editingUserId: number | null = null;
  editForm: any = {};
  roleFilter: string | null = null;
  pageTitle = 'All Users';
  selectedUser: User | null = null;
  showUserDetails = false;
  currentPath: string = '';
  
  // Available roles for dropdown - only UTILISATEUR and MODERATEUR
  availableRoles: string[] = ['MODERATEUR', 'UTILISATEUR'];
  
  constructor(
    private userService: UserService,
    private iconSetService: IconSetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Register the icons
    iconSetService.icons = { cilTrash, cilPencil, cilCheck, cilX, cilUser };
    
    // Get the current URL path
    this.currentPath = this.router.url;
  }

  ngOnInit(): void {
    this.setupBasedOnRoute();
  }
  
  setupBasedOnRoute(): void {
    // Set filter based on current route
    if (this.currentPath.includes('/admin/searcher')) {
      // Researchers/Searcher route - show only MODERATEUR
      this.setRoleFilter('MODERATEUR');
      this.pageTitle = 'Chercheurs';
    } else if (this.currentPath.includes('/admin/users')) {
      // Users route - show only UTILISATEUR
      this.setRoleFilter('UTILISATEUR');
      this.pageTitle = 'Utilisateurs';
    } else {
      // Default: show all users
      this.setRoleFilter(null);
    }
  }
  
  setRoleFilter(role: string | null): void {
    this.roleFilter = role;
    
    // Update page title based on filter
    if (role === 'UTILISATEUR') {
      this.pageTitle = 'Utilisateurs';
    } else if (role === 'MODERATEUR') {
      this.pageTitle = 'Chercheurs';
    } else if (role === 'ADMIN') {
      this.pageTitle = 'Administrateurs';
    } else {
      this.pageTitle = 'Tous les Utilisateurs';
    }
    
    // Reload users with filter
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers()
      .subscribe({
        next: (data) => {
          // Apply role filter if set
          if (this.roleFilter) {
            this.users = data.filter(user => user.role === this.roleFilter);
          } else {
            this.users = data;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users. Please try again.';
          this.loading = false;
          console.error('Error loading users:', err);
        }
      });
  }

  viewUser(user: User): void {
    this.selectedUser = { ...user };
    this.showUserDetails = true;
  }

  isEditing(userId: number): boolean {
    return this.editingUserId === userId;
  }

  editUser(user: User): void {
    this.editingUserId = user.id;
    this.editForm = JSON.parse(JSON.stringify(user));
    
    if (this.editForm.employmentDate) {
      const date = new Date(this.editForm.employmentDate);
      this.editForm.employmentDate = date.toISOString().split('T')[0];
    }
    
    if (!this.editForm.role) {
      this.editForm.role = this.roleFilter || 'UTILISATEUR'; 
    }
    
    console.log('Editing user:', this.editForm);
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editForm = {};
  }

  saveUser(): void {
    if (!this.editingUserId) return;
    
    this.loading = true;
    
    // Check if role has changed
    const originalUser = this.users.find(u => u.id === this.editingUserId);
    const roleChanged = originalUser && originalUser.role !== this.editForm.role;
    const newRole = this.editForm.role;
    
    // Prepare userData based on role
    const userData: any = { ...this.editForm };
    
    // If switching to UTILISATEUR, remove moderator-specific fields
    if (newRole === 'UTILISATEUR') {
      // Remove moderator-specific fields if changing to regular user
      userData.institution = null;
      userData.grade = null;
      userData.employmentDate = null;
      // Add any other moderator-specific fields that should be cleared
    }
    
    // If changing role, handle it first
    if (roleChanged) {
      this.userService.changeUserRole(this.editingUserId, newRole)
        .subscribe({
          next: () => {
            // Then update user data with role-appropriate fields
            this.userService.updateUser(this.editingUserId!, userData)
              .subscribe({
                next: (updatedUser) => {
                  // Manually set the role since it might not be returned
                  updatedUser.role = newRole;
                  
                  // Update user in the list
                  const index = this.users.findIndex(u => u.id === this.editingUserId);
                  if (index !== -1) {
                    this.users[index] = updatedUser;
                  }
                  
                  this.editingUserId = null;
                  this.editForm = {};
                  this.loading = false;
                  
                  // If role changed, user will no longer be in this view
                  if (roleChanged && newRole !== this.roleFilter) {
                    // Remove the user from current view since they no longer match the filter
                    this.users = this.users.filter(u => u.id !== this.editingUserId);
                    
                    // Notify user about the change
                    alert(`User role changed to ${newRole}. This user will now appear in the ${newRole === 'MODERATEUR' ? 'Chercheurs' : 'Utilisateurs'} list.` );
                  } else {
                    // Just reload the current view
                    this.loadUsers();
                  }
                },
                error: (err) => {
                  console.error('Error updating user data after role change:', err);
                  alert('Role was updated but user data failed to update.');
                  this.loading = false;
                }
              });
          },
          error: (err) => {
            console.error('Error updating user role:', err);
            alert('Failed to update user role. Please try again.');
            this.loading = false;
          }
        });
    } else {
      // No role change, just update user data
      this.userService.updateUser(this.editingUserId, userData)
        .subscribe({
          next: (updatedUser) => {
            // Update user in the list
            const index = this.users.findIndex(u => u.id === this.editingUserId);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
            
            this.editingUserId = null;
            this.editForm = {};
            this.loading = false;
          },
          error: (err) => {
            console.error('Error updating user:', err);
            alert('Failed to update user. Please try again.');
            this.loading = false;
          }
        });
    }
  }
  
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id)
        .subscribe({
          next: () => {
            this.users = this.users.filter(user => user.id !== id);
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            alert('Failed to delete user. Please try again.');
          }
        });
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
  
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'MODERATEUR': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}