import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-embedding-space-fallback',
  templateUrl: './embedding-space-fallback.component.html',
  styleUrls: ['./embedding-space-fallback.component.sass'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbeddingSpaceFallbackComponent {}
