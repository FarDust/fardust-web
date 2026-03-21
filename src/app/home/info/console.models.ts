export type ConsoleMetric = {
  label: string;
  value: string;
  detail: string;
};

export type ConsoleNavItem = {
  label: string;
  icon: string;
  href?: string;
  routerLink?: string;
  fragment?: string;
  active?: boolean;
};

export type ConsolePipelineStage = {
  label: string;
  detail: string;
  emphasis: string;
  progress: number;
  tone: 'primary' | 'success' | 'muted';
};

export type ConsoleStatLine = {
  label: string;
  value: string;
};

export type ConsoleRegistryCard = {
  eyebrow: string;
  title: string;
  description: string;
  meta: ReadonlyArray<ConsoleStatLine>;
  href?: string;
  routerLink?: string;
};

export type ConsoleSupportModule = {
  eyebrow?: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  routerLink?: string;
};

export type ConsoleSpecField = {
  label: string;
  value: string;
};

export type ConsoleLogEntry = {
  time: string;
  message: string;
  tone: 'primary' | 'success' | 'muted';
};

export type ConsoleAction = {
  label: string;
  href?: string;
  routerLink?: string;
};
