import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  PRETEXT_EDITORIAL_CONTENT,
  PRETEXT_HERO_CONTENT,
  PRETEXT_SHRINKWRAP_CONTENT,
  PRETEXT_VALIDATION_CONTENT,
} from './pretext-page.data';
import { PretextEditorialEngineComponent } from './pretext-editorial-engine.component';
import { PretextHeroComponent } from './pretext-hero.component';
import { PretextShrinkwrapShowdownComponent } from './pretext-shrinkwrap-showdown.component';
import { PretextValidationSectionComponent } from './pretext-validation-section.component';

@Component({
  selector: 'app-pretext',
  imports: [
    CommonModule,
    PretextHeroComponent,
    PretextEditorialEngineComponent,
    PretextShrinkwrapShowdownComponent,
    PretextValidationSectionComponent,
  ],
  templateUrl: './pretext.component.html',
  styleUrls: ['./pretext.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PretextComponent {
  readonly editorialContent = PRETEXT_EDITORIAL_CONTENT;
  readonly heroContent = PRETEXT_HERO_CONTENT;
  readonly shrinkwrapContent = PRETEXT_SHRINKWRAP_CONTENT;
  readonly validationContent = PRETEXT_VALIDATION_CONTENT;
}
