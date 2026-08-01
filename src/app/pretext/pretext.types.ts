import { type LayoutLine } from '@chenglou/pretext';

export type PretextWhiteSpaceMode = 'normal' | 'pre-wrap';

export type PretextTypography = {
  font: string;
  lineHeight: number;
};

export type PretextLayoutSnapshot = {
  width: number;
  availableWidth: number;
  lineCount: number;
  height: number;
  lineHeight: number;
  durationMs: number;
  shrinkwrap: boolean;
  lines: ReadonlyArray<LayoutLine>;
};

export type PretextValidationSample = {
  label: string;
  text: string;
  whiteSpace?: PretextWhiteSpaceMode;
};
