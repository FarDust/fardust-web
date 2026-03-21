import { Component } from '@angular/core';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import {
  CONSOLE_CURRENT_FOCUS,
  CONSOLE_PROFILE_DETAILS,
  CONSOLE_RAIL_UTILITY_ITEMS,
  createConsoleRailPrimaryItems,
} from 'src/app/home/info/console-shell.data';
import { ConsoleSpecField } from 'src/app/home/info/console.models';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.sass'],
  standalone: false,
})
export class ViewerComponent {
  pdfSrc =
    'https://storage.googleapis.com/landing-artifacts/curriculum/cv-gabriel-faundez.pdf';

  readonly currentFocus = CONSOLE_CURRENT_FOCUS;
  readonly railPrimaryItems = createConsoleRailPrimaryItems('Experience');
  readonly railUtilityItems = CONSOLE_RAIL_UTILITY_ITEMS;
  readonly profileDetails: ReadonlyArray<ConsoleSpecField> =
    CONSOLE_PROFILE_DETAILS;
  readonly documentFacts: ReadonlyArray<ConsoleSpecField> = [
    { label: 'Artifact', value: 'Curriculum Vitae' },
    { label: 'Updated', value: 'January 2026' },
    { label: 'Format', value: 'PDF' },
    { label: 'Access', value: 'Public' },
  ];

  page = 1;
  totalPages?: number;
  zoom = 1;

  constructor() {}

  onPdfLoad(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
  }

  nextPage(): void {
    if (this.totalPages && this.page >= this.totalPages) {
      return;
    }
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
