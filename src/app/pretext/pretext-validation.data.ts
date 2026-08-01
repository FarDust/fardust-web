import { PretextValidationSample } from './pretext.types';

export const PRETEXT_VALIDATION_SAMPLES: ReadonlyArray<PretextValidationSample> =
  [
    {
      label: 'English UI',
      text: 'Portfolio systems should feel fast, readable, and precise under real product constraints.',
    },
    {
      label: 'Spanish copy',
      text: 'Incorporar sistemas de inteligencia artificial en productos reales exige criterio, contexto y buena ingeniería.',
    },
    {
      label: 'Emoji',
      text: 'Latency down, confidence up, and still enough room for the fun parts 🚀✨',
    },
    {
      label: 'CJK',
      text: '文字レイアウトは見た目だけではなく、正確な計測と応答性の両方が必要です。',
    },
    {
      label: 'Mixed bidi',
      text: 'AGI 春天到了. بدأت الرحلة نحو أدوات أدق وأكثر متعة.',
    },
    {
      label: 'URL query',
      text: 'https://fardust.tralmor.com/pretext?q=layout+signals&lang=es-CL',
    },
    {
      label: 'Time range',
      text: 'Realtime orchestration window: 7:00-9:00 / २४×७ / 60fps.',
    },
    {
      label: 'Pre-wrap',
      text: 'Prompt queue:\n\t1. Capture intent\n\t2. Shape the layout\n\t3. Ship the experiment',
      whiteSpace: 'pre-wrap',
    },
  ];
