import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PretextTextComponent } from './pretext-text.component';
import { PretextHeroContent } from './pretext-page.data';

@Component({
  selector: 'app-pretext-hero',
  imports: [CommonModule, RouterLink, PretextTextComponent],
  templateUrl: './pretext-hero.component.html',
  styleUrls: ['./pretext-hero.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pretext-hero animate-panel-rise',
  },
})
export class PretextHeroComponent {
  readonly content = input.required<PretextHeroContent>();
}
