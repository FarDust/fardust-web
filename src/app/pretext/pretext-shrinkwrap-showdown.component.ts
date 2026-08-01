import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import {
  PRETEXT_SHRINKWRAP_CONTENT,
  PretextShrinkwrapContent,
} from './pretext-page.data';
import { PretextService } from './pretext.service';
import { PretextSectionHeaderComponent } from './pretext-section-header.component';
import { PretextTextComponent } from './pretext-text.component';

type BubbleRender = {
  text: string;
  width: number;
  lines: ReadonlyArray<string>;
};

@Component({
  selector: 'app-pretext-shrinkwrap-showdown',
  imports: [CommonModule, PretextSectionHeaderComponent, PretextTextComponent],
  templateUrl: './pretext-shrinkwrap-showdown.component.html',
  styleUrls: ['./pretext-shrinkwrap-showdown.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PretextShrinkwrapShowdownComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pretext = inject(PretextService);
  private readonly cssBubbleNodes = viewChildren('cssBubble', {
    read: ElementRef<HTMLDivElement>,
  });

  readonly content = input<PretextShrinkwrapContent>(
    PRETEXT_SHRINKWRAP_CONTENT,
  );

  readonly chatWidth = signal(420);
  readonly maxWidth = signal(420);
  readonly cssWaste = signal(0);

  readonly pretextBubbles = computed<ReadonlyArray<BubbleRender>>(() => {
    const bubbleMaxWidth = this.chatWidth();
    return this.content().messages.map((message) => {
      const prepared = this.pretext.prepareRich(
        message,
        '500 15px "Inter", "Helvetica Neue", sans-serif',
      );
      const width = this.pretext.findTightWidth(prepared, bubbleMaxWidth);
      const layout = this.pretext.layoutPrepared(prepared, width, 24);
      return {
        text: message,
        width,
        lines: layout.lines.map((line) => line.text),
      };
    });
  });

  readonly pretextWaste = computed(() => 0);

  constructor() {
    afterNextRender(() => {
      this.updateSizing();
      const observer = new ResizeObserver(() => {
        this.updateSizing();
      });

      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  setWidth(value: string): void {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return;
    }

    this.chatWidth.set(Math.min(parsed, this.maxWidth()));
    queueMicrotask(() => this.measureCssWaste());
  }

  bubbleWidthStyle(width: number): Record<string, string> {
    return {
      width: `${width}px`,
      maxWidth: `${this.chatWidth()}px`,
    };
  }

  private updateSizing(): void {
    const hostWidth = this.host.nativeElement.clientWidth;
    const nextMax = Math.max(260, Math.floor(Math.min(hostWidth * 0.72, 460)));
    this.maxWidth.set(nextMax);
    this.chatWidth.update((current) => Math.min(current, nextMax));
    queueMicrotask(() => this.measureCssWaste());
  }

  private measureCssWaste(): void {
    const bubbleNodes = this.cssBubbleNodes();
    const pretextBubbles = this.pretextBubbles();
    if (!bubbleNodes.length || bubbleNodes.length !== pretextBubbles.length) {
      return;
    }

    const wasted = bubbleNodes.reduce((total, bubbleNode, index) => {
      const cssWidth = bubbleNode.nativeElement.offsetWidth;
      const idealWidth = pretextBubbles[index]?.width ?? cssWidth;
      return total + Math.max(cssWidth - idealWidth, 0);
    }, 0);

    this.cssWaste.set(Math.round(wasted));
  }

  protected readonly Math = Math;
}
