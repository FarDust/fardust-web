import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { PretextService, type CircularObstacle } from './pretext.service';
import {
  PRETEXT_EDITORIAL_CONTENT,
  PretextEditorialContent,
  PretextEditorialOrbContent,
} from './pretext-page.data';
import { PretextSectionHeaderComponent } from './pretext-section-header.component';
import { PretextTextComponent } from './pretext-text.component';

type Orb = CircularObstacle & PretextEditorialOrbContent;

type PositionedLine = {
  text: string;
  width: number;
  x: number;
  y: number;
};

type ColumnRegion = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type EditorialLayoutMetrics = {
  font: string;
  fontSize: number;
  lineHeight: number;
  horizontalPadding: number;
  topPadding: number;
  bottomPadding: number;
  gutter: number;
  columns: 1 | 2;
  orbScale: number;
  dragInset: number;
  orbPadding: number;
  minSlotWidth: number;
  maxVisibleOrbs: number;
  orbBandTop: number;
  orbBandBottom: number | null;
};

@Component({
  selector: 'app-pretext-editorial-engine',
  imports: [CommonModule, PretextSectionHeaderComponent, PretextTextComponent],
  templateUrl: './pretext-editorial-engine.component.html',
  styleUrls: ['./pretext-editorial-engine.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PretextEditorialEngineComponent {
  private readonly baseStageWidth = 1180;
  private readonly baseStageHeight = 620;
  private readonly destroyRef = inject(DestroyRef);
  private readonly pretext = inject(PretextService);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  private readonly stageWidth = signal(0);
  private readonly stageHeight = signal(0);
  private readonly dragRect = signal<DOMRect | null>(null);
  private readonly activeOrbId = signal<Orb['id'] | null>(null);
  private readonly hasUserRepositioned = signal(false);
  readonly content = input<PretextEditorialContent>(PRETEXT_EDITORIAL_CONTENT);
  readonly orbs = signal<ReadonlyArray<Orb>>([]);

  readonly layoutMetrics = computed<EditorialLayoutMetrics>(() => {
    const width = this.stageWidth();

    if (width < 360) {
      return {
        font: '500 11px "JetBrains Mono", "SFMono-Regular", Consolas, monospace',
        fontSize: 11,
        lineHeight: 19,
        horizontalPadding: 18,
        topPadding: 104,
        bottomPadding: 24,
        gutter: 0,
        columns: 1,
        orbScale: 0.14,
        dragInset: 12,
        orbPadding: 14,
        minSlotWidth: 138,
        maxVisibleOrbs: 1,
        orbBandTop: 112,
        orbBandBottom: 196,
      };
    }

    if (width < 480) {
      return {
        font: '500 13px "JetBrains Mono", "SFMono-Regular", Consolas, monospace',
        fontSize: 13,
        lineHeight: 21,
        horizontalPadding: 18,
        topPadding: 126,
        bottomPadding: 62,
        gutter: 0,
        columns: 1,
        orbScale: 0.18,
        dragInset: 12,
        orbPadding: 14,
        minSlotWidth: 158,
        maxVisibleOrbs: 1,
        orbBandTop: 132,
        orbBandBottom: 254,
      };
    }

    if (width < 960) {
      return {
        font: '500 15px "JetBrains Mono", "SFMono-Regular", Consolas, monospace',
        fontSize: 15,
        lineHeight: 24,
        horizontalPadding: 24,
        topPadding: 108,
        bottomPadding: 68,
        gutter: 0,
        columns: 1,
        orbScale: 0.56,
        dragInset: 58,
        orbPadding: 18,
        minSlotWidth: 112,
        maxVisibleOrbs: 3,
        orbBandTop: 108,
        orbBandBottom: null,
      };
    }

    return {
      font: '500 20px "JetBrains Mono", "SFMono-Regular", Consolas, monospace',
      fontSize: 20,
      lineHeight: 30,
      horizontalPadding: width >= 1100 ? 52 : 28,
      topPadding: width >= 900 ? 132 : 116,
      bottomPadding: 72,
      gutter: width >= 1500 ? 48 : 0,
      columns: width >= 1500 ? 2 : 1,
      orbScale: 1,
      dragInset: 72,
      orbPadding: 18,
      minSlotWidth: 72,
      maxVisibleOrbs: 3,
      orbBandTop: width >= 900 ? 132 : 116,
      orbBandBottom: null,
    };
  });

  private readonly bodyPrepared = computed(() =>
    this.pretext.prepareRich(this.content().body, this.layoutMetrics().font),
  );

  readonly visibleOrbs = computed(() => {
    const width = this.stageWidth();
    const height = this.stageHeight();
    const metrics = this.layoutMetrics();

    return this.orbs()
      .slice(0, metrics.maxVisibleOrbs)
      .map((orb) => {
        const radius = orb.radius * metrics.orbScale;
        const maxY =
          height > 0
            ? metrics.orbBandBottom === null
              ? height - radius - 32
              : Math.min(height - radius - 32, metrics.orbBandBottom - radius)
            : orb.y;

        return {
          ...orb,
          radius,
          padding: metrics.orbPadding,
          x:
            width > 0
              ? this.clamp(
                  orb.x,
                  radius + metrics.dragInset,
                  width - radius - metrics.dragInset,
                )
              : orb.x,
          y:
            height > 0
              ? this.clamp(orb.y, radius + metrics.orbBandTop, maxY)
              : orb.y,
        };
      });
  });

  readonly projection = computed(() => {
    const width = this.stageWidth();
    const height = this.stageHeight();
    const orbs = this.visibleOrbs();
    const prepared = this.bodyPrepared();
    const metrics = this.layoutMetrics();

    if (width < 320 || height < 280) {
      return null;
    }

    const startedAt = performance.now();
    const contentWidth = width - metrics.horizontalPadding * 2;
    const columns = metrics.columns;
    const columnWidth =
      columns === 1 ? contentWidth : (contentWidth - metrics.gutter) / columns;
    const columnHeight = height - metrics.topPadding - metrics.bottomPadding;

    const regions: ColumnRegion[] = Array.from(
      { length: columns },
      (_, index) => ({
        left:
          metrics.horizontalPadding + index * (columnWidth + metrics.gutter),
        top: metrics.topPadding,
        width: columnWidth,
        height: columnHeight,
      }),
    );

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    const lines: PositionedLine[] = [];

    for (const region of regions) {
      const columnLayout = this.pretext.layoutFlowAroundCircles(
        prepared,
        cursor,
        region,
        metrics.lineHeight,
        orbs,
        { minSlotWidth: metrics.minSlotWidth },
      );
      lines.push(...columnLayout.lines);
      cursor = columnLayout.cursor;
    }

    const reachedEnd =
      cursor.segmentIndex >= prepared.segments.length - 1 &&
      cursor.graphemeIndex === 0;
    const reflowMs = performance.now() - startedAt;

    return {
      columns,
      lines,
      lineCount: lines.length,
      reflowMs,
      overflowed: !reachedEnd,
    };
  });

  constructor() {
    effect(() => {
      const seededOrbs = this.content().orbs;
      const width = this.stageWidth();
      const height = this.stageHeight();
      if (width <= 0 || height <= 0 || this.hasUserRepositioned()) {
        return;
      }

      this.orbs.set(
        seededOrbs.map((orb, index) =>
          this.seedOrbToStage(orb, index, width, height, this.layoutMetrics()),
        ),
      );
    });

    afterNextRender(() => {
      const stageElement = this.stage().nativeElement;
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        this.stageWidth.set(entry.contentRect.width);
        this.stageHeight.set(entry.contentRect.height);
      });

      resizeObserver.observe(stageElement);
      this.destroyRef.onDestroy(() => resizeObserver.disconnect());
    });
  }

  startDrag(event: PointerEvent, orbId: Orb['id']): void {
    const stageRect = this.stage().nativeElement.getBoundingClientRect();
    this.dragRect.set(stageRect);
    this.activeOrbId.set(orbId);
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(
      event.pointerId,
    );
    event.preventDefault();
  }

  drag(event: PointerEvent): void {
    const activeOrbId = this.activeOrbId();
    const stageRect = this.dragRect();
    const metrics = this.layoutMetrics();
    if (!activeOrbId || !stageRect) {
      return;
    }

    const activeOrb = this.visibleOrbs().find((orb) => orb.id === activeOrbId);
    const radius = activeOrb?.radius ?? metrics.dragInset;
    const maxY =
      metrics.orbBandBottom === null
        ? stageRect.height - radius - 32
        : Math.min(
            stageRect.height - radius - 32,
            metrics.orbBandBottom - radius,
          );
    const nextX = this.clamp(
      event.clientX - stageRect.left,
      radius + metrics.dragInset,
      stageRect.width - radius - metrics.dragInset,
    );
    const nextY = this.clamp(
      event.clientY - stageRect.top,
      radius + metrics.orbBandTop,
      maxY,
    );

    this.orbs.update((orbs) =>
      orbs.map((orb) =>
        orb.id === activeOrbId
          ? {
              ...orb,
              x: nextX,
              y: nextY,
            }
          : orb,
      ),
    );
    this.hasUserRepositioned.set(true);
  }

  endDrag(): void {
    this.activeOrbId.set(null);
    this.dragRect.set(null);
  }

  orbStyle(orb: Orb): Record<string, string | number> {
    return {
      width: `${orb.radius * 2}px`,
      height: `${orb.radius * 2}px`,
      transform: `translate(${orb.x - orb.radius}px, ${orb.y - orb.radius}px)`,
    };
  }

  lineStyle(line: PositionedLine): Record<string, string | number> {
    return {
      transform: `translate(${line.x}px, ${line.y}px)`,
      width: `${Math.ceil(line.width + 2)}px`,
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private seedOrbToStage(
    orb: PretextEditorialOrbContent,
    index: number,
    width: number,
    height: number,
    metrics: EditorialLayoutMetrics,
  ): Orb {
    if (width < 480) {
      const radius = orb.radius * metrics.orbScale;
      const isLeadingOrb = index === 0;

      return {
        ...orb,
        x: isLeadingOrb
          ? width - metrics.horizontalPadding - radius - (width < 360 ? 22 : 14)
          : metrics.horizontalPadding + radius + 28,
        y: isLeadingOrb
          ? metrics.orbBandTop + radius + 4
          : metrics.orbBandTop + radius + metrics.lineHeight * 2.4,
      };
    }

    const scaleX = Math.min(1, width / this.baseStageWidth);
    const scaleY = Math.min(1, height / this.baseStageHeight);

    return {
      ...orb,
      x: orb.x * scaleX,
      y: orb.y * scaleY,
    };
  }
}
