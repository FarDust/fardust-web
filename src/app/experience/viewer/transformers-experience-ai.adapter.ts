import { Injectable, inject, signal } from '@angular/core';
import {
  EXPERIENCE_AI_CONFIG,
  ExperienceAiAdapter,
} from './experience-ai-adapter';
import {
  ExperienceAiInsightRequest,
  ExperienceAiInsightResult,
  ExperienceAiReadiness,
} from './experience-viewer.types';

type TransformersBundle = {
  AutoProcessor: typeof import('@huggingface/transformers').AutoProcessor;
  AutoTokenizer: typeof import('@huggingface/transformers').AutoTokenizer;
  Moondream1ForConditionalGeneration: typeof import('@huggingface/transformers').Moondream1ForConditionalGeneration;
  RawImage: typeof import('@huggingface/transformers').RawImage;
  TextStreamer: typeof import('@huggingface/transformers').TextStreamer;
};

type PreparedBundle = {
  hf: TransformersBundle;
  processor: Awaited<
    ReturnType<
      typeof import('@huggingface/transformers').AutoProcessor.from_pretrained
    >
  >;
  tokenizer: Awaited<
    ReturnType<
      typeof import('@huggingface/transformers').AutoTokenizer.from_pretrained
    >
  >;
  model: Awaited<
    ReturnType<
      typeof import('@huggingface/transformers').Moondream1ForConditionalGeneration.from_pretrained
    >
  >;
};

@Injectable()
export class TransformersExperienceAiAdapter implements ExperienceAiAdapter {
  private readonly config = inject(EXPERIENCE_AI_CONFIG);

  readonly readiness = signal<ExperienceAiReadiness>('idle');
  readonly reason = signal('');

  private bundlePromise?: Promise<PreparedBundle>;

  async warmUp(): Promise<void> {
    if (this.readiness() === 'ready' || this.readiness() === 'warming') {
      return;
    }

    const support = this.resolveSupport();
    if (!support.supported) {
      this.readiness.set('unsupported');
      this.reason.set(support.reason);
      return;
    }

    this.readiness.set('warming');
    this.reason.set('Loading local multimodal coprocessor');

    try {
      await this.ensureBundle();
      this.readiness.set('ready');
      this.reason.set('Local multimodal coprocessor ready');
    } catch (error) {
      this.readiness.set('error');
      this.reason.set(
        error instanceof Error ? error.message : 'Failed to load local model',
      );
      throw error;
    }
  }

  async generateInsight(
    request: ExperienceAiInsightRequest,
  ): Promise<ExperienceAiInsightResult> {
    await this.warmUp();
    if (this.readiness() !== 'ready') {
      throw new Error(this.reason() || 'Local multimodal model is unavailable');
    }

    const bundle = await this.ensureBundle();
    this.readiness.set('ready');
    this.reason.set('Generating recruiter hover note');

    const prompt = [
      '<image>',
      '',
      `Question: ${request.target.promptHint}`,
      `Visible line: ${request.target.sourceText}`,
      `Nearby context: ${request.nearbyText}`,
      `Recruiter focus: ${request.recruiterFocus}`,
      'Return plain text only, under 70 words, with no bullets and no invented facts.',
      '',
      'Answer:',
    ].join('\n');

    const textInputs = bundle.tokenizer(prompt);
    const image = await bundle.hf.RawImage.read(request.imageDataUrl);
    const visionInputs = await bundle.processor(image);

    const streamer = new bundle.hf.TextStreamer(bundle.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: false,
      callback_function: (chunk) => {
        request.onToken?.(chunk);
      },
    });

    const output = (await bundle.model.generate({
      ...textInputs,
      ...visionInputs,
      do_sample: false,
      max_new_tokens: this.config.maxNewTokens,
      streamer,
    })) as Parameters<typeof bundle.tokenizer.batch_decode>[0];
    const decoded = bundle.tokenizer.batch_decode(output, {
      skip_special_tokens: false,
    })[0];

    const answer = decoded.split('Answer:').pop()?.trim() || decoded.trim();
    this.reason.set('Local multimodal coprocessor ready');

    return {
      text: answer.replace(/<\|endoftext\|>/g, '').trim(),
      modelId: this.config.modelId,
      generatedAt: Date.now(),
    };
  }

  private async ensureBundle(): Promise<PreparedBundle> {
    if (!this.bundlePromise) {
      this.bundlePromise = this.loadBundle();
    }

    return this.bundlePromise;
  }

  private async loadBundle(): Promise<PreparedBundle> {
    const hf = (await import(
      /* webpackChunkName: "experience-local-ai" */ '@huggingface/transformers'
    )) as unknown as TransformersBundle;

    const [processor, tokenizer, model] = await Promise.all([
      hf.AutoProcessor.from_pretrained(this.config.modelId),
      hf.AutoTokenizer.from_pretrained(this.config.modelId),
      hf.Moondream1ForConditionalGeneration.from_pretrained(
        this.config.modelId,
        {
          dtype: {
            embed_tokens: 'fp16',
            vision_encoder: 'q8',
            decoder_model_merged: 'q4',
          },
          device: 'webgpu',
        },
      ),
    ]);

    return {
      hf,
      processor,
      tokenizer,
      model,
    };
  }

  private resolveSupport():
    | { supported: true; reason: string }
    | { supported: false; reason: string } {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        supported: false,
        reason: 'Browser-only local model path',
      };
    }

    if (navigator.webdriver) {
      return {
        supported: false,
        reason: 'Automation session parked local model warmup',
      };
    }

    if (!('gpu' in navigator)) {
      return {
        supported: false,
        reason: 'WebGPU not available on this device',
      };
    }

    const maybeNavigator = navigator as Navigator & { deviceMemory?: number };
    if (
      typeof maybeNavigator.deviceMemory === 'number' &&
      maybeNavigator.deviceMemory < 4
    ) {
      return {
        supported: false,
        reason: 'Local model requires a larger memory budget',
      };
    }

    return {
      supported: true,
      reason: 'Queueing local multimodal warmup',
    };
  }
}
