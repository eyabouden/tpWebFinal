// researcher-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './researcher-dashboard.component.html',
  styleUrls: ['./researcher-dashboard.component.scss']
})
export class ResearcherDashboardComponent implements OnInit {
  userName: string = 'Researcher';
  researchStats = {
    totalPublications: 12,
    citations: 87,
    collaborators: 8,
    hIndex: 12,
    downloads: 1250
  };

  recentActivities = [
    {
      date: 'Today, 09:45 AM',
      title: 'Article Published',
      description: 'Your article "Quantum Machine Learning Applications" has been published',
      type: 'publication'
    },
    {
      date: 'Yesterday, 2:30 PM',
      title: 'New Citation',
      description: 'Your paper was cited in "Neural Networks in Healthcare"',
      type: 'citation'
    },
    {
      date: 'Apr 12, 2025, 11:20 AM',
      title: 'Collaboration Request',
      description: 'Dr. James Wilson invited you to collaborate on "AI Ethics Framework"',
      type: 'collaboration'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadResearchData();
  }

  private loadResearchData(): void {
    // In a real app, you would fetch this from a service
    // this.researchService.getDashboardData().subscribe(data => {
    //   this.researchStats = data.stats;
    //   this.recentActivities = data.activities;
    // });
  }
}