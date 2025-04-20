import { Component } from '@angular/core';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent {

  // Static sample data
  bookmarks = [
    {
      id: 1,
      title: 'Deep Learning for NLP',
      authors: ['Alice Johnson', 'Mark Smith'],
      journal: 'AI Journal',
      publicationDate: new Date('2022-05-10'),
      status: 'published'
    },
    {
      id: 2,
      title: 'Quantum Computing Basics',
      authors: ['Emma Brown'],
      journal: 'Quantum Science',
      publicationDate: new Date('2023-01-20'),
      status: 'under_review'
    }
  ];

  constructor() {}

  removeBookmark(id: number): void {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  }

  getStatusClass(status: string): string {
    return {
      'published': 'badge published',
      'submitted': 'badge submitted',
      'under_review': 'badge under-review',
      'rejected': 'badge rejected'
    }[status] || 'badge';
  }
}