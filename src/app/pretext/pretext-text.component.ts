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
} from '@angular/core';
import { PretextService } from './pretext.service';
import { PretextTypography, PretextWhiteSpaceMode } from './pretext.types';

@Component({
  selector: 'app-pretext-text',
  imports: [CommonModule],
  templateUrl: './pretext-text.component.html',
  styleUrls: ['./pretext-text.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pretext-text',
    '[class.pretext-text--shrinkwrap]': 'shrinkwrap()',
    '[class.pretext-text--no-wrap]': 'noWrap()',
    '[class.pretext-text--pre-wrap]': 'whiteSpace() === "pre-wrap"',
    '[style.--pretext-surface-width.px]':
      'shrinkwrap() || noWrap() ? renderState()?.width : null',
  },
})
export class PretextTextComponent {
  readonly text = input.required<string>();
  readonly locale = input<string>();
  readonly shrinkwrap = input(false);
  readonly noWrap = input(false);
  readonly whiteSpace = input<PretextWhiteSpaceMode>('normal');

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pretext = inject(PretextService);

  private readonly availableWidth = signal(0);
  private readonly typography = signal<PretextTypography | null>(null);

  readonly renderState = computed(() => {
    const text = this.text() ?? '';
    const typography = this.typography();
    const availableWidth = this.availableWidth();
    const locale = this.locale() ?? this.pretext.locale();
    const noWrap = this.noWrap();

    if (!text || !typography || (!noWrap && availableWidth <= 0)) {
      return null;
    }

    const prepared = this.pretext.prepareRich(
      text,
      typography.font,
      this.whiteSpace(),
      locale,
    );

    return this.pretext.layoutPrepared(
      prepared,
      noWrap ? 1_000_000 : availableWidth,
      typography.lineHeight,
      {
        shrinkwrap: this.shrinkwrap() || noWrap,
      },
    );
  });

  readonly lines = computed(() => this.renderState()?.lines ?? []);

  constructor() {
    afterNextRender(() => {
      this.refreshMetrics();

      const observer = new ResizeObserver(() => {
        this.refreshMetrics();
      });
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());

      if (typeof document !== 'undefined' && 'fonts' in document) {
        void document.fonts.ready.then(() => this.refreshMetrics());
      }
    });
  }

  private refreshMetrics(): void {
    const host = this.host.nativeElement;
    const width = host.clientWidth || host.getBoundingClientRect().width;
    this.availableWidth.set(Math.max(width, 0));
    this.typography.set(this.readTypography(host));
  }

  private readTypography(node: HTMLElement): PretextTypography {
    const style = getComputedStyle(node);
    const font =
      style.font && style.font !== ''
        ? style.font
        : `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    const fontSize = Number.parseFloat(style.fontSize) || 16;
    const rawLineHeight = Number.parseFloat(style.lineHeight);
    const lineHeight = Number.isFinite(rawLineHeight)
      ? rawLineHeight
      : fontSize * 1.2;

    return {
      font,
      lineHeight,
    };
  }
}
