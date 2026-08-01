import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { EmbeddingSpaceApiStatus } from './embedding-space.types';

@Component({
  selector: 'app-embedding-space-api-panel',
  templateUrl: './embedding-space-api-panel.component.html',
  styleUrls: ['./embedding-space-api-panel.component.sass'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbeddingSpaceApiPanelComponent {
  readonly apiUrl = input('');
  readonly apiStatus = input<EmbeddingSpaceApiStatus>('idle');
  readonly apiError = input('');
  readonly sampleExpanded = input(false);
  readonly apiUrlChange = output<string>();
  readonly connectRequested = output<string>();
  readonly sampleExpandedChange = output<boolean>();
  readonly connectLabel = computed(() =>
    this.apiStatus() === 'loading' ? 'Loading…' : 'Connect',
  );
  readonly connectDisabled = computed(
    () => !this.apiUrl() || this.apiStatus() === 'loading',
  );

  updateApiUrl(value: string): void {
    this.apiUrlChange.emit(value);
  }

  requestConnect(): void {
    this.connectRequested.emit(this.apiUrl());
  }

  toggleSample(): void {
    this.sampleExpandedChange.emit(!this.sampleExpanded());
  }
}
