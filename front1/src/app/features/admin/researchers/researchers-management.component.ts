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
    
    const userId = this.editingUserId; // Store ID in local variable
    this.loading = true;
    
    // Check if role has changed
    const originalUser = this.users.find(u => u.id === userId);
    const roleChanged = originalUser && originalUser.role !== this.editForm.role;
    const newRole = this.editForm.role;
    
    // Prepare userData based on role
    const userData: any = { ...this.editForm };
    
    // If switching to UTILISATEUR, remove moderator-specific fields
    if (newRole === 'UTILISATEUR') {
      userData.institution = null;
      userData.grade = null;
      userData.employmentDate = null;
    }
    
    // If changing role, handle it first
    if (roleChanged) {
      this.userService.changeUserRole(userId, newRole)
        .subscribe({
          next: () => {
            // Then update user data with role-appropriate fields
            this.userService.updateUser(userId, userData)
              .subscribe({
                next: (updatedUser) => {
                  // Manually set the role since it might not be returned
                  updatedUser.role = newRole;
                  
                  // Update user in the list with correct ID
                  const index = this.users.findIndex(u => u.id === userId);
                  if (index !== -1) {
                    this.users[index] = updatedUser;
                  }
                  
                  this.editingUserId = null;
                  this.editForm = {};
                  this.loading = false;
                  
                  // Reload users to ensure we have the latest data
                  this.loadUsers();
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
      this.userService.updateUser(userId, userData)
        .subscribe({
          next: (updatedUser) => {
            // Update user in the list
            const index = this.users.findIndex(u => u.id === userId);
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
  showAddUserModal = false;
newUserForm: any = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
  employmentDate: '',
  institution: '',
  grade: ''
};

// Add these methods to the ResearchersComponent class
openAddUserModal(): void {
  // Set default role based on current filter
  this.newUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: this.roleFilter || 'UTILISATEUR',
    employmentDate: '',
    institution: '',
    grade: ''
  };
  this.showAddUserModal = true;
}

closeAddUserModal(): void {
  this.showAddUserModal = false;
  this.newUserForm = {};
}

createUser(): void {
  this.loading = true;
  
  // Clone form to avoid modifying original
  const userData = { ...this.newUserForm };
  
  // Validate required fields
  if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
    this.showNotification('Please fill in all required fields', 'error');
    this.loading = false;
    return;
  }
  
  console.log('Creating user with data:', userData);
  
  this.userService.createUser(userData)
    .subscribe({
      next: (newUser) => {
        // Add the new user to the list
        this.users.push(newUser);
        this.loading = false;
        this.closeAddUserModal();
        // Refresh the user list to ensure everything is up-to-date
        this.loadUsers();
        // Show success message
        this.showNotification('User created successfully', 'success');
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.loading = false;
        // Show error message
        this.showNotification('Failed to create user: ' + (err.error?.message || err.message || 'Unknown error'), 'error');
      }
    });
}

// Add this method to the ResearchersComponent class
onRoleChange(): void {
  // If switching away from MODERATEUR, clear moderator fields
  if (this.newUserForm.role !== 'MODERATEUR') {
    this.newUserForm.employmentDate = '';
    this.newUserForm.institution = '';
    this.newUserForm.grade = '';
  }
}

// Helper method for notifications
showNotification(message: string, type: 'success' | 'error' | 'info'): void {

  const notificationClass = type === 'success' ? 'success-notification' : 
                            type === 'error' ? 'error-notification' : 'info-notification';
                            
  const notification = document.createElement('div');
  notification.className = `notification ${notificationClass}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      // Print the ID to console for debugging
      console.log('Attempting to delete user with ID:', id);
      
      this.userService.deleteUser(id)
        .subscribe({
          next: () => {
            console.log('Delete successful for ID:', id);
            // Remove user from the array
            this.users = this.users.filter(user => user.id !== id);
          },
          error: (err) => {
            console.error(`Error deleting user with ID ${id}:`, err);
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