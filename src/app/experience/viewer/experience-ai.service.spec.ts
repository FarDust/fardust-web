import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  EXPERIENCE_AI_ADAPTER,
  EXPERIENCE_AI_CONFIG,
} from './experience-ai-adapter';
import { ExperienceAiService } from './experience-ai.service';
import { ExperienceHoverTarget } from './experience-viewer.types';

describe('ExperienceAiService', () => {
  let service: ExperienceAiService;
  let adapter: {
    readiness: ReturnType<typeof signal>;
    reason: ReturnType<typeof signal>;
    warmUp: jasmine.Spy;
    generateInsight: jasmine.Spy;
  };

  const target: ExperienceHoverTarget = {
    id: 'target-1',
    pageNumber: 2,
    title: 'Impact signal',
    label: 'Built a recommendation system',
    sourceText: 'Built a recommendation system',
    kind: 'bullet',
    rect: { left: 0, top: 0, width: 100, height: 24 },
    context: ['Built a recommendation system', 'LATAM Airlines'],
    promptHint:
      'Translate this accomplishment into recruiter-facing impact, calling out delivery, scale, and technical maturity.',
  };

  beforeEach(() => {
    adapter = {
      readiness: signal('ready'),
      reason: signal('Local multimodal coprocessor ready'),
      warmUp: jasmine.createSpy().and.resolveTo(),
      generateInsight: jasmine.createSpy().and.resolveTo({
        text: 'This line shows direct ownership of a production recommendation surface.',
        modelId: 'test-local-model',
        generatedAt: Date.now(),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        ExperienceAiService,
        {
          provide: EXPERIENCE_AI_ADAPTER,
          useValue: adapter,
        },
        {
          provide: EXPERIENCE_AI_CONFIG,
          useValue: {
            modelId: 'test-local-model',
            cacheTtlMs: 60_000,
            maxNewTokens: 48,
          },
        },
      ],
    });

    service = TestBed.inject(ExperienceAiService);
  });

  it('should cache generated hover insights for one minute', async () => {
    await service.inspectTarget(target, 'data:image/png;base64,abc', 'nearby');
    await service.inspectTarget(target, 'data:image/png;base64,abc', 'nearby');

    expect(adapter.generateInsight).toHaveBeenCalledTimes(1);
    expect(service.hoverCard()?.state).toBe('cached');
    expect(service.cacheCount()).toBe(1);
  });

  it('should clear the hover insight cache on demand', async () => {
    await service.inspectTarget(target, 'data:image/png;base64,abc', 'nearby');
    service.clearCache();
    await service.inspectTarget(target, 'data:image/png;base64,abc', 'nearby');

    expect(adapter.generateInsight).toHaveBeenCalledTimes(2);
  });
});
