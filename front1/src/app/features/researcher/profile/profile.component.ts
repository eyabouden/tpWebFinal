// profile.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  constructor() { }

  // Placeholder methods
  editProfile() {
    alert('Edit Profile clicked (connect to form later)');
  }

  changePassword() {
    alert('Change Password clicked (connect to backend later)');
  }
}
