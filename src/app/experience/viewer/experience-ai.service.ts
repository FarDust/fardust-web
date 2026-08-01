import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  EXPERIENCE_AI_ADAPTER,
  EXPERIENCE_AI_CONFIG,
} from './experience-ai-adapter';
import {
  ExperienceHoverCard,
  ExperienceHoverTarget,
} from './experience-viewer.types';

type CachedInsight = {
  text: string;
  expiresAt: number;
  modelId: string;
};

@Injectable()
export class ExperienceAiService {
  private readonly adapter = inject(EXPERIENCE_AI_ADAPTER);
  private readonly config = inject(EXPERIENCE_AI_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  private readonly hoverCardState = signal<ExperienceHoverCard | null>(null);
  private readonly cacheVersion = signal(0);

  private readonly cache = new Map<string, CachedInsight>();
  private readonly waitingVerbs = [
    'triangulating',
    'reading tea leaves',
    'warming relays',
    'cross-examining',
    'untangling buzzwords',
    'diffing recruiter brain',
  ];
  private waitingTimerId?: number;
  private generationSequence = 0;

  readonly readiness = computed(() => this.adapter.readiness());
  readonly readinessReason = computed(() => this.adapter.reason());
  readonly hoverCard = computed(() => this.hoverCardState());
  readonly cacheCount = computed(() => {
    this.cacheVersion();
    this.pruneExpiredCache();
    return this.cache.size;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearWaitingTimer();
    });
  }

  warmUpNow(): void {
    void this.adapter.warmUp().catch(() => {
      // The side panel mirrors the adapter error state.
    });
  }

  warmUpOnIdle(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const startWarmUp = () => {
      void this.adapter.warmUp().catch(() => {
        // The side panel reflects the error state; the route should stay usable.
      });
    };

    if ('requestIdleCallback' in window) {
      (
        window as Window & {
          requestIdleCallback?: (callback: IdleRequestCallback) => number;
        }
      ).requestIdleCallback?.(() => startWarmUp());
      return;
    }

    globalThis.setTimeout(startWarmUp, 350);
  }

  async inspectTarget(
    target: ExperienceHoverTarget,
    imageDataUrl: string,
    nearbyText: string,
  ): Promise<void> {
    const currentCard = this.hoverCardState();
    if (
      currentCard?.targetId === target.id &&
      currentCard.state === 'generating'
    ) {
      return;
    }

    const cached = this.readCachedInsight(target.id);
    if (cached) {
      this.hoverCardState.set({
        targetId: target.id,
        title: target.title,
        pageNumber: target.pageNumber,
        state: 'cached',
        text: cached.text,
        waitingVerb: this.waitingVerbs[0],
        provenance: `Page ${target.pageNumber} · cached for 1 minute`,
      });
      return;
    }

    const generationId = ++this.generationSequence;
    this.startWaitingCycle();
    this.hoverCardState.set({
      targetId: target.id,
      title: target.title,
      pageNumber: target.pageNumber,
      state: 'generating',
      text: '',
      waitingVerb: this.waitingVerbs[0],
      provenance: `Page ${target.pageNumber} · local multimodal coprocessor`,
    });

    try {
      const result = await this.adapter.generateInsight({
        target,
        imageDataUrl,
        nearbyText,
        recruiterFocus:
          'Senior machine learning engineer, staff platform engineer, applied AI lead, or recruiter screening for technical depth and delivery.',
        onToken: (chunk) => {
          if (this.generationSequence !== generationId) {
            return;
          }

          this.hoverCardState.update((card) => {
            if (!card || card.targetId !== target.id) {
              return card;
            }

            return {
              ...card,
              text: `${card.text}${chunk}`,
            };
          });
        },
      });

      if (this.generationSequence !== generationId) {
        return;
      }

      const insight = result.text.trim();
      this.cache.set(target.id, {
        text: insight,
        expiresAt: Date.now() + this.config.cacheTtlMs,
        modelId: result.modelId,
      });
      this.cacheVersion.update((value) => value + 1);
      this.hoverCardState.set({
        targetId: target.id,
        title: target.title,
        pageNumber: target.pageNumber,
        state: 'ready',
        text: insight,
        waitingVerb: this.waitingVerbs[0],
        provenance: `Page ${target.pageNumber} · ${result.modelId}`,
      });
    } catch (error) {
      if (this.generationSequence !== generationId) {
        return;
      }

      this.hoverCardState.set({
        targetId: target.id,
        title: target.title,
        pageNumber: target.pageNumber,
        state: 'error',
        text: '',
        waitingVerb: this.waitingVerbs[0],
        provenance: `Page ${target.pageNumber} · local multimodal coprocessor`,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to generate local recruiter note',
      });
    } finally {
      this.clearWaitingTimer();
    }
  }

  closeHoverCard(): void {
    this.hoverCardState.set(null);
    this.clearWaitingTimer();
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheVersion.update((value) => value + 1);
  }

  private readCachedInsight(targetId: string): CachedInsight | null {
    this.pruneExpiredCache();
    return this.cache.get(targetId) ?? null;
  }

  private pruneExpiredCache(): void {
    const now = Date.now();
    let changed = false;
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt <= now) {
        this.cache.delete(key);
        changed = true;
      }
    }

    if (changed) {
      queueMicrotask(() => {
        this.cacheVersion.update((value) => value + 1);
      });
    }
  }

  private startWaitingCycle(): void {
    this.clearWaitingTimer();
    let index = 0;
    this.hoverCardState.update((card) =>
      card
        ? {
            ...card,
            waitingVerb: this.waitingVerbs[index],
          }
        : card,
    );

    if (typeof window === 'undefined') {
      return;
    }

    this.waitingTimerId = window.setInterval(() => {
      index = (index + 1) % this.waitingVerbs.length;
      this.hoverCardState.update((card) =>
        card
          ? {
              ...card,
              waitingVerb: this.waitingVerbs[index],
            }
          : card,
      );
    }, 950);
  }

  private clearWaitingTimer(): void {
    if (typeof window !== 'undefined' && this.waitingTimerId) {
      window.clearInterval(this.waitingTimerId);
    }

    this.waitingTimerId = undefined;
  }
}
