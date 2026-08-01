import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { EmbeddingSpaceApiStatus } from './embedding-space.types';

type LegendItem = {
  color: string;
  label: string;
};

@Component({
  selector: 'app-embedding-space-hud',
  templateUrl: './embedding-space-hud.component.html',
  styleUrls: ['./embedding-space-hud.component.sass'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbeddingSpaceHudComponent {
  readonly apiStatus = input<EmbeddingSpaceApiStatus>('idle');
  readonly tryItOpen = input(false);
  readonly toggleTryIt = output<void>();
  readonly legendItems: ReadonlyArray<LegendItem> = [
    {
      color: '#6eeeff',
      label: 'Messages from the Family',
    },
    {
      color: '#adc6ff',
      label: 'Non Urgent',
    },
    {
      color: '#ff7c4b',
      label: 'Missed Sales call from 800 numbers',
    },
  ];

  requestToggle(): void {
    this.toggleTryIt.emit();
  }
}
