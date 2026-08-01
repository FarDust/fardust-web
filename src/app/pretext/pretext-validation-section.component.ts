import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { PretextSectionHeaderComponent } from './pretext-section-header.component';
import { PretextTextComponent } from './pretext-text.component';
import { PretextValidationContent } from './pretext-page.data';

@Component({
  selector: 'app-pretext-validation-section',
  imports: [CommonModule, PretextSectionHeaderComponent, PretextTextComponent],
  templateUrl: './pretext-validation-section.component.html',
  styleUrls: ['./pretext-validation-section.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pretext-section pretext-validation animate-panel-rise',
  },
})
export class PretextValidationSectionComponent {
  readonly content = input.required<PretextValidationContent>();
  readonly activeSampleIndex = signal(0);
  readonly activeSampleIndexClamped = computed(() => {
    const maxIndex = this.content().samples.length - 1;
    return maxIndex < 0 ? 0 : Math.min(this.activeSampleIndex(), maxIndex);
  });
  readonly activeSample = computed(
    () => this.content().samples[this.activeSampleIndexClamped()] ?? null,
  );

  selectSample(index: number): void {
    this.activeSampleIndex.set(index);
  }

  isActiveSample(index: number): boolean {
    return this.activeSampleIndexClamped() === index;
  }

  sampleTabId(index: number): string {
    return `pretext-validation-tab-${index}`;
  }

  samplePanelId(index: number): string {
    return `pretext-validation-panel-${index}`;
  }
}
