import { Component } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.sass']
})
export class ViewerComponent {

  pdfSrc = "https://storage.googleapis.com/landing-artifacts/curriculum/cv-gabriel-faundez.pdf";

  constructor() { }

}
