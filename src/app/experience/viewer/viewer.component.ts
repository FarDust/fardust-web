import { Component } from '@angular/core';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.sass']
})
export class ViewerComponent {

  pdfSrc = "https://storage.googleapis.com/landing-artifacts/curriculum/cv-gabriel-faundez.pdf";

  page = 1;
  totalPages?: number;
  zoom = 1;

  constructor() { }

  onPdfLoad(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
  }

  nextPage(): void {
    if (this.totalPages && this.page >= this.totalPages) { return; }
    this.page += 1;
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page -= 1;
    }
  }

  zoomIn(): void {
    this.zoom += 0.1;
  }

  zoomOut(): void {
    if (this.zoom > 0.5) {
      this.zoom -= 0.1;
    }
  }

}
