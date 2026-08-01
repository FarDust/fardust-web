import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  clearCache,
  layoutWithLines,
  layoutNextLine,
  prepareWithSegments,
  setLocale,
  walkLineRanges,
  type LayoutCursor,
  type LayoutLine,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';
import {
  PretextLayoutSnapshot,
  PretextTypography,
  PretextWhiteSpaceMode,
} from './pretext.types';

type CachedPreparedText = {
  prepared: PreparedTextWithSegments;
  locale: string;
};

type Interval = {
  left: number;
  right: number;
};

export type CircularObstacle = {
  x: number;
  y: number;
  radius: number;
  padding?: number;
};

@Injectable({ providedIn: 'root' })
export class PretextService {
  private readonly translate = inject(TranslateService, { optional: true });
  private readonly localeState = signal(this.resolveLocale());
  readonly locale = computed(() => this.localeState());

  private readonly preparedCache = new Map<string, CachedPreparedText>();
  private activeLibraryLocale = '';

  constructor() {
    this.ensureLocale(this.localeState());
    this.translate?.onLangChange.subscribe(({ lang }) => {
      const nextLocale = this.normalizeLocale(lang);
      if (nextLocale === this.localeState()) {
        return;
      }

      this.localeState.set(nextLocale);
      this.ensureLocale(nextLocale);
    });
  }

  prepareRich(
    text: string,
    font: string,
    whiteSpace: PretextWhiteSpaceMode = 'normal',
    locale = this.locale(),
  ): PreparedTextWithSegments {
    const effectiveLocale = this.normalizeLocale(locale);
    this.ensureLocale(effectiveLocale);

    const cacheKey = `${effectiveLocale}\u241f${whiteSpace}\u241f${font}\u241f${text}`;
    const cached = this.preparedCache.get(cacheKey);
    if (cached) {
      return cached.prepared;
    }

    const prepared = prepareWithSegments(text, font, { whiteSpace });
    this.preparedCache.set(cacheKey, { prepared, locale: effectiveLocale });
    return prepared;
  }

  layoutPrepared(
    prepared: PreparedTextWithSegments,
    maxWidth: number,
    lineHeight: number,
    options?: { shrinkwrap?: boolean },
  ): PretextLayoutSnapshot {
    const availableWidth = Math.max(1, maxWidth);
    const start = performance.now();
    const shrinkwrap = options?.shrinkwrap ?? false;
    const width = shrinkwrap
      ? this.findTightWidth(prepared, availableWidth)
      : availableWidth;
    const result = layoutWithLines(prepared, width, lineHeight);

    return {
      ...result,
      width,
      availableWidth,
      lineHeight,
      shrinkwrap,
      durationMs: performance.now() - start,
    };
  }

  getSingleLineWidth(prepared: PreparedTextWithSegments): number {
    let measuredWidth = 0;
    walkLineRanges(prepared, 100_000, (line) => {
      measuredWidth = Math.max(measuredWidth, line.width);
    });
    return measuredWidth;
  }

  countLines(prepared: PreparedTextWithSegments, maxWidth: number): number {
    let count = 0;
    walkLineRanges(prepared, Math.max(1, maxWidth), () => {
      count += 1;
    });
    return Math.max(count, 1);
  }

  findTightWidth(prepared: PreparedTextWithSegments, maxWidth: number): number {
    const safeWidth = Math.max(1, maxWidth);
    let targetLineCount = 0;
    let widestObservedLine = 0;

    walkLineRanges(prepared, safeWidth, (line) => {
      targetLineCount += 1;
      widestObservedLine = Math.max(widestObservedLine, line.width);
    });

    if (targetLineCount <= 1) {
      return Math.min(safeWidth, Math.max(widestObservedLine, 1));
    }

    let low = 1;
    let high = safeWidth;
    for (let iteration = 0; iteration < 18; iteration += 1) {
      const mid = (low + high) / 2;
      const lineCount = this.countLines(prepared, mid);
      if (lineCount > targetLineCount) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return Math.min(safeWidth, Math.max(high, widestObservedLine));
  }

  layoutFlowAroundCircles(
    prepared: PreparedTextWithSegments,
    start: LayoutCursor,
    region: { left: number; top: number; width: number; height: number },
    lineHeight: number,
    obstacles: ReadonlyArray<CircularObstacle>,
    options?: { minSlotWidth?: number },
  ): {
    lines: ReadonlyArray<{ text: string; width: number; x: number; y: number }>;
    cursor: LayoutCursor;
  } {
    let cursor = start;
    const lines: Array<{ text: string; width: number; x: number; y: number }> =
      [];
    let y = region.top;
    const right = region.left + region.width;
    const bottom = region.top + region.height;

    while (y + lineHeight <= bottom) {
      const slots = this.carveLineSlots(
        region.left,
        right,
        y,
        y + lineHeight,
        obstacles,
        options?.minSlotWidth,
      );
      if (!slots.length) {
        y += lineHeight;
        continue;
      }

      const slot = slots.reduce((widest, candidate) =>
        candidate.right - candidate.left > widest.right - widest.left
          ? candidate
          : widest,
      );

      const line = layoutNextLine(prepared, cursor, slot.right - slot.left);
      if (!line) {
        break;
      }

      lines.push({
        text: line.text,
        width: line.width,
        x: slot.left,
        y,
      });
      cursor = line.end;
      y += lineHeight;
    }

    return { lines, cursor };
  }

  private carveLineSlots(
    left: number,
    right: number,
    bandTop: number,
    bandBottom: number,
    obstacles: ReadonlyArray<CircularObstacle>,
    minSlotWidth = 32,
  ): Interval[] {
    const blocked = obstacles
      .map((obstacle) =>
        this.circleIntervalForBand(obstacle, bandTop, bandBottom),
      )
      .filter((interval): interval is Interval => interval !== null)
      .sort((a, b) => a.left - b.left);

    if (!blocked.length) {
      return [{ left, right }];
    }

    const merged: Interval[] = [];
    for (const interval of blocked) {
      const last = merged.at(-1);
      if (!last || interval.left > last.right) {
        merged.push({ ...interval });
        continue;
      }
      last.right = Math.max(last.right, interval.right);
    }

    const slots: Interval[] = [];
    let cursor = left;
    for (const interval of merged) {
      if (interval.left > cursor) {
        slots.push({ left: cursor, right: interval.left });
      }
      cursor = Math.max(cursor, interval.right);
    }

    if (cursor < right) {
      slots.push({ left: cursor, right });
    }

    return slots.filter(
      (slot) => slot.right - slot.left > Math.max(32, minSlotWidth),
    );
  }

  private circleIntervalForBand(
    obstacle: CircularObstacle,
    bandTop: number,
    bandBottom: number,
  ): Interval | null {
    const radius = obstacle.radius + (obstacle.padding ?? 18);
    const bandMid = (bandTop + bandBottom) / 2;
    const dy = Math.abs(bandMid - obstacle.y);
    if (dy >= radius) {
      return null;
    }

    const dx = Math.sqrt(radius * radius - dy * dy);
    return {
      left: obstacle.x - dx,
      right: obstacle.x + dx,
    };
  }

  private ensureLocale(locale: string): void {
    if (locale === this.activeLibraryLocale) {
      return;
    }

    setLocale(locale);
    clearCache();
    this.preparedCache.clear();
    this.activeLibraryLocale = locale;
  }

  private resolveLocale(): string {
    return this.normalizeLocale(
      this.translate?.currentLang ||
        this.translate?.getDefaultLang() ||
        (typeof document === 'undefined'
          ? 'en'
          : document.documentElement.lang || 'en'),
    );
  }

  private normalizeLocale(locale?: string | null): string {
    return locale?.trim() || 'en';
  }
}
