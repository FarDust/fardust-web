import { ConsoleSpecField } from 'src/app/home/info/console.models';

export type ExperienceLineKind =
  | 'heading'
  | 'role'
  | 'bullet'
  | 'contact'
  | 'body';

export type ExperienceAiReadiness =
  | 'idle'
  | 'warming'
  | 'ready'
  | 'unsupported'
  | 'error';

export type ExperienceHoverCardState =
  | 'idle'
  | 'generating'
  | 'cached'
  | 'ready'
  | 'error';

export type ExperienceInspectorTab = 'overview' | 'search' | 'copilot';

export type ExperienceDocumentItem = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
};

export type ExperienceDocumentLine = {
  id: string;
  pageNumber: number;
  order: number;
  text: string;
  kind: ExperienceLineKind;
  y: number;
  items: ReadonlyArray<ExperienceDocumentItem>;
};

export type ExperiencePageIndex = {
  pageNumber: number;
  lines: ReadonlyArray<ExperienceDocumentLine>;
};

export type ExperienceRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ExperienceRenderedSpan = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ExperienceRenderedLine = {
  id: string;
  pageNumber: number;
  order: number;
  text: string;
  kind: ExperienceLineKind;
  rect: ExperienceRect;
};

export type ExperienceHoverTarget = {
  id: string;
  pageNumber: number;
  title: string;
  label: string;
  sourceText: string;
  kind: ExperienceLineKind;
  rect: ExperienceRect;
  context: ReadonlyArray<string>;
  promptHint: string;
};

export type ExperienceSearchResult = {
  id: string;
  pageNumber: number;
  text: string;
  excerpt: string;
  kind: ExperienceLineKind;
  score: number;
};

export type ExperienceHoverCard = {
  targetId: string;
  title: string;
  pageNumber: number;
  state: ExperienceHoverCardState;
  text: string;
  waitingVerb: string;
  provenance: string;
  error?: string;
};

export type ExperienceAiInsightRequest = {
  target: ExperienceHoverTarget;
  imageDataUrl: string;
  nearbyText: string;
  recruiterFocus: string;
  onToken?: (chunk: string) => void;
};

export type ExperienceAiInsightResult = {
  text: string;
  modelId: string;
  generatedAt: number;
};

export type ExperienceAiConfig = {
  modelId: string;
  cacheTtlMs: number;
  maxNewTokens: number;
};

export type ExperienceSignalPanelState = {
  readonly overviewFields: ReadonlyArray<ConsoleSpecField>;
  readonly documentFields: ReadonlyArray<ConsoleSpecField>;
  readonly sessionFields: ReadonlyArray<ConsoleSpecField>;
  readonly searchQuery: string;
  readonly searchResults: ReadonlyArray<ExperienceSearchResult>;
  readonly activeTab: ExperienceInspectorTab;
  readonly aiReadiness: ExperienceAiReadiness;
  readonly aiStatusCopy: string;
  readonly hoverTargetCount: number;
  readonly cacheCount: number;
};
