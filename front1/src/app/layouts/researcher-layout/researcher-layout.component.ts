// researcher-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-researcher-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './researcher-layout.component.html',
  styleUrls: ['./researcher-layout.component.scss']
})
export class ResearcherLayoutComponent {
  isSidebarVisible = true;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('c-sidebar-show', this.isSidebarVisible);
    }
  }

  sidebarItems = [
    {
      title: 'Dashboard',
      icon: 'cil-speedometer',
      route: '/researcher/dashboard'
    },
    {
      title: 'My Publications',
      icon: 'cil-book',
      route: '/researcher/publications'
    },
    {
      title: 'Submit Article',
      icon: 'cil-note-add',
      route: '/researcher/submit'
    },
    {
      title: 'Research Domains',
      icon: 'cil-applications',
      route: '/researcher/domains'
    },
    {
      title: 'Collaborations',
      icon: 'cil-people',
      route: '/researcher/collaborations'
    },
    {
      title: 'Analytics',
      icon: 'cil-chart',
      route: '/researcher/analytics'
    },
    {
      title: 'Profile',
      icon: 'cil-user',
      route: '/researcher/profile'
    }
  ];
}