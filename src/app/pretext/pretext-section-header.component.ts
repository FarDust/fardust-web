import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PretextTextComponent } from './pretext-text.component';

@Component({
  selector: 'app-pretext-section-header',
  imports: [CommonModule, PretextTextComponent],
  templateUrl: './pretext-section-header.component.html',
  styleUrls: ['./pretext-section-header.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pretext-section-header',
  },
})
export class PretextSectionHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
}
