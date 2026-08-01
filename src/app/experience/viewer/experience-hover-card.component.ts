import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ExperienceHoverCard } from './experience-viewer.types';

@Component({
  selector: 'app-experience-hover-card',
  templateUrl: './experience-hover-card.component.html',
  styleUrls: ['./experience-hover-card.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ExperienceHoverCardComponent {
  readonly card = input<ExperienceHoverCard | null>(null);

  readonly closeRequested = output<void>();
}
