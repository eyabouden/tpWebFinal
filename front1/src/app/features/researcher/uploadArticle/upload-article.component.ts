import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-article',
  templateUrl: './upload-article.component.html',
  styleUrls: ['./upload-article.component.scss']
})
export class UploadArticleComponent {
  constructor() {}

  // You can implement the logic here once backend is ready
  onSubmit() {
    alert('Submit button clicked. Backend integration coming soon!');
  }
}
