import { PRETEXT_VALIDATION_SAMPLES } from './pretext-validation.data';
import { PretextValidationSample } from './pretext.types';

export type PretextMetric = {
  label: string;
  value: string;
  detail: string;
};

export type PretextTimelineEntry = {
  timestamp: string;
  summary: string;
};

export type PretextFeatureCard = {
  kicker: string;
  title: string;
  copy: string;
};

export type PretextSectionHeaderContent = {
  eyebrow: string;
  title: string;
  lead: string;
};

export type PretextEditorialOrbContent = {
  id: 'north' | 'south' | 'west';
  x: number;
  y: number;
  radius: number;
  tone: 'amber' | 'plasma' | 'cyan';
  label: string;
};

export type PretextEditorialContent = PretextSectionHeaderContent & {
  stageLabel: string;
  stageHint: string;
  overflowMessage: string;
  body: string;
  orbs: ReadonlyArray<PretextEditorialOrbContent>;
};

export type PretextShrinkwrapContent = PretextSectionHeaderContent & {
  sliderLabel: string;
  leftTitle: string;
  rightTitle: string;
  rightWasteLabel: string;
  messages: ReadonlyArray<string>;
};

export type PretextHeroContent = {
  eyebrow: string;
  status: string;
  title: string;
  copy: string;
  returnActionLabel: string;
  returnActionLink: string;
  libraryActionLabel: string;
  libraryActionHref: string;
  metrics: ReadonlyArray<PretextMetric>;
  logLabel: string;
  logTitle: string;
  logCopy: string;
  timeline: ReadonlyArray<PretextTimelineEntry>;
  featureCards: ReadonlyArray<PretextFeatureCard>;
};

export type PretextValidationContent = {
  eyebrow: string;
  title: string;
  briefLabel: string;
  briefHref: string;
  samples: ReadonlyArray<PretextValidationSample>;
};

export const PRETEXT_HERO_CONTENT: PretextHeroContent = {
  eyebrow: 'STARDATE 2026.094 · TYPE SYSTEMS LAB',
  status: 'SECTOR 001 / ACTIVE',
  title: 'Subspace type control',
  copy: 'A mission interface should not wait for browser wrapping to decide how much room language deserves. In this lab the DOM still paints the words, but Pretext resolves the line geometry first so labels, packets, and telemetry read like part of the console instead of spillover from it.',
  returnActionLabel: 'Back to console',
  returnActionLink: '/',
  libraryActionLabel: 'Open Pretext docs',
  libraryActionHref: 'https://github.com/chenglou/pretext',
  metrics: [
    {
      label: 'Render path',
      value: 'DOM lines',
      detail: 'Readable, selectable, route-owned text',
    },
    {
      label: 'Surface',
      value: '/pretext',
      detail: 'Dedicated typography operations lab',
    },
    {
      label: 'Locales',
      value: 'EN / ES / CJK',
      detail: 'Validation canaries stay online',
    },
    {
      label: 'Telemetry',
      value: '0 DOM reads',
      detail: 'Layout math happens before paint',
    },
  ],
  logLabel: 'Systems log',
  logTitle: 'Layout sync',
  logCopy:
    'The visual language leans toward late-24th-century ops: darker hull tones, narrow cyan and amber rails, and typography that feels calibrated instead of decorative.',
  timeline: [
    {
      timestamp: 'LOG 094.1',
      summary:
        'Hero copy promoted from passive wrapping to explicit line geometry.',
    },
    {
      timestamp: 'LOG 094.2',
      summary:
        'Packet widths solved with shrinkwrap so multiline capsules stop wasting volume.',
    },
    {
      timestamp: 'LOG 094.3',
      summary:
        'Validation canaries stress bidi, emoji, CJK, URLs, and preserved whitespace.',
    },
  ],
  featureCards: [
    {
      kicker: 'Shared renderer',
      title: 'One renderer for route-owned text',
      copy: 'Navigation, viewer chrome, footer status, and the showcase route now share the same cached Pretext renderer instead of ad hoc wrapping.',
    },
    {
      kicker: 'Tight packets',
      title: 'Capsules fit the transmission',
      copy: 'Shrinkwrap solves the smallest stable width for each transmission, which makes dense UI feel engineered rather than merely compressed.',
    },
    {
      kicker: 'Live routing',
      title: 'Telemetry and copy share the same surface',
      copy: 'The routing stage proves that moving obstacles can coexist with readable DOM text when the line stream is computed in app space.',
    },
  ],
};

export const PRETEXT_EDITORIAL_CONTENT: PretextEditorialContent = {
  eyebrow: 'Flight path compositor',
  title: 'Copy routed around live telemetry',
  lead: 'Move the sensor nodes and the line stream finds a new corridor before the browser needs to measure a mirror paragraph.',
  stageLabel: 'Telemetry flow / active routing',
  stageHint: 'Drag sensor nodes',
  overflowMessage:
    'Channel saturated. Reposition a node or widen the corridor.',
  body: 'Building the notification blacklisting system meant presenting cluster summaries and suppression reasoning in the same panel as live pipeline telemetry. If the layout waited for the browser to wrap, the category explanation always clipped at the wrong line — the context that justified the blacklist decision disappeared behind an orphaned word. Pretext changes that contract. The DOM still renders readable, selectable text, but the application routes the line stream first, leaves clearance for every active telemetry node, and keeps the reasoning legible without mirror probes or emergency reflow. Move the scan nodes and the paragraph finds a new corridor immediately. That is what building a real production system looks like: not decorating an interface, but making it behave correctly when the data is live.',
  orbs: [
    {
      id: 'north',
      x: 760,
      y: 162,
      radius: 98,
      tone: 'amber',
      label: 'Embedding',
    },
    {
      id: 'south',
      x: 684,
      y: 420,
      radius: 120,
      tone: 'plasma',
      label: 'Cluster scan',
    },
    {
      id: 'west',
      x: 228,
      y: 440,
      radius: 108,
      tone: 'cyan',
      label: 'Blacklist gate',
    },
  ],
};

export const PRETEXT_SHRINKWRAP_CONTENT: PretextShrinkwrapContent = {
  eyebrow: 'Packet geometry',
  title: 'Packets that fit their payload',
  lead: 'A calibrated transmission should hug the words it carries. This comparison shows how much empty hull CSS leaves behind once the payload wraps.',
  sliderLabel: 'Packet width',
  leftTitle: 'CSS packets',
  rightTitle: 'Pretext packets',
  rightWasteLabel: '0px wasted',
  messages: [
    'Cluster label needs to fit next to the suppression count — single line.',
    'Copy. CSS wraps the category name onto a second line. The badge breaks.',
    'Pretext solves the stable width first. No probe elements, no reflow.',
    'El grupo de notificaciones de facturación tiene etiquetas largas en español.',
    'Same geometry, tighter fit — cluster ID and confidence score side by side. ✨',
    'Right. The blacklist reason stops clipping once the width is pre-solved.',
    'That means denser cluster panels without layout thrash on model updates.',
    'Exactly. Group tags, suppression counts, and drift flags all stay compact.',
    'Approved. Lock the packet geometry and push to the inference surface.',
  ],
};

export const PRETEXT_VALIDATION_CONTENT: PretextValidationContent = {
  eyebrow: 'Universal translator canaries',
  title: 'Signals that should survive first contact',
  briefLabel: 'Read validation brief',
  briefHref:
    'https://raw.githubusercontent.com/chenglou/pretext/refs/heads/main/AGENTS.md',
  samples: PRETEXT_VALIDATION_SAMPLES,
};
