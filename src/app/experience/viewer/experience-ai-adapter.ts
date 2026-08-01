import { InjectionToken, Signal } from '@angular/core';
import {
  ExperienceAiConfig,
  ExperienceAiInsightRequest,
  ExperienceAiInsightResult,
  ExperienceAiReadiness,
} from './experience-viewer.types';

export interface ExperienceAiAdapter {
  readonly readiness: Signal<ExperienceAiReadiness>;
  readonly reason: Signal<string>;
  warmUp(): Promise<void>;
  generateInsight(
    request: ExperienceAiInsightRequest,
  ): Promise<ExperienceAiInsightResult>;
}

export const EXPERIENCE_AI_CONFIG = new InjectionToken<ExperienceAiConfig>(
  'EXPERIENCE_AI_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({
      modelId: 'Xenova/moondream2',
      cacheTtlMs: 60_000,
      maxNewTokens: 96,
    }),
  },
);

export const EXPERIENCE_AI_ADAPTER = new InjectionToken<ExperienceAiAdapter>(
  'EXPERIENCE_AI_ADAPTER',
);
