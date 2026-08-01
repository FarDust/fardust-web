import {
  ExperienceDocumentItem,
  ExperienceDocumentLine,
  ExperienceHoverTarget,
  ExperienceLineKind,
  ExperiencePageIndex,
  ExperienceRenderedLine,
  ExperienceRenderedSpan,
  ExperienceSearchResult,
} from './experience-viewer.types';

const HEADING_LABELS = new Set([
  'education',
  'skills',
  'experience',
  'certificates',
  'extracurricular',
]);

const ROLE_KEYWORDS = [
  'engineer',
  'developer',
  'assistant',
  'member',
  'platform',
  'backend',
  'full stack',
  'data engineer',
];

function slugify(value: string): string {
  return normalizeExperienceText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function normalizeExperienceText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/•/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function classifyExperienceLine(text: string): ExperienceLineKind {
  const normalized = normalizeExperienceText(text);
  const lower = normalized.toLowerCase();

  if (!normalized) {
    return 'body';
  }

  if (
    lower.includes('@') ||
    lower.includes('http') ||
    lower.includes('www.') ||
    lower.includes('|')
  ) {
    return 'contact';
  }

  if (/^[•\-]/.test(text.trim())) {
    return 'bullet';
  }

  if (HEADING_LABELS.has(lower)) {
    return 'heading';
  }

  const words = lower.split(' ').filter(Boolean);
  const uppercaseDensity =
    normalized.replace(/[^A-Z]/g, '').length / Math.max(normalized.length, 1);
  const looksLikeRole =
    words.length <= 10 &&
    ROLE_KEYWORDS.some((keyword) => lower.includes(keyword)) &&
    uppercaseDensity > 0.18;

  if (looksLikeRole) {
    return 'role';
  }

  return 'body';
}

export function groupPdfItemsIntoLines(
  items: ReadonlyArray<ExperienceDocumentItem>,
  pageNumber: number,
): ReadonlyArray<ExperienceDocumentLine> {
  const ordered = [...items].sort((left, right) => {
    if (Math.abs(right.y - left.y) > 2.5) {
      return right.y - left.y;
    }

    return left.x - right.x;
  });

  const lines: ExperienceDocumentLine[] = [];
  for (const item of ordered) {
    const current = lines.at(-1);
    if (!current || Math.abs(current.y - item.y) > 2.5) {
      const text = normalizeExperienceText(item.text);
      lines.push({
        id: `p${pageNumber}-line-${lines.length}`,
        pageNumber,
        order: lines.length,
        text,
        kind: classifyExperienceLine(text),
        y: item.y,
        items: text ? [item] : [],
      });
      continue;
    }

    const mergedText = normalizeExperienceText(`${current.text} ${item.text}`);
    const mergedItems = [...current.items, item];
    lines[lines.length - 1] = {
      ...current,
      text: mergedText,
      kind: classifyExperienceLine(mergedText),
      items: mergedItems,
    };
  }

  return lines.filter((line) => line.text.length > 0);
}

export function buildRenderedLineGroups(
  spans: ReadonlyArray<ExperienceRenderedSpan>,
  pageNumber: number,
): ReadonlyArray<ExperienceRenderedLine> {
  const ordered = [...spans].sort((left, right) => {
    if (Math.abs(left.top - right.top) > 4) {
      return left.top - right.top;
    }

    return left.left - right.left;
  });

  const lines: ExperienceRenderedLine[] = [];
  for (const span of ordered) {
    const text = normalizeExperienceText(span.text);
    if (!text) {
      continue;
    }

    const current = lines.at(-1);
    if (!current || Math.abs(current.rect.top - span.top) > 4) {
      lines.push({
        id: `p${pageNumber}-rendered-${lines.length}`,
        pageNumber,
        order: lines.length,
        text,
        kind: classifyExperienceLine(text),
        rect: {
          left: span.left,
          top: span.top,
          width: span.width,
          height: span.height,
        },
      });
      continue;
    }

    lines[lines.length - 1] = {
      ...current,
      text: normalizeExperienceText(`${current.text} ${text}`),
      kind: classifyExperienceLine(
        normalizeExperienceText(`${current.text} ${text}`),
      ),
      rect: {
        left: Math.min(current.rect.left, span.left),
        top: Math.min(current.rect.top, span.top),
        width:
          Math.max(
            current.rect.left + current.rect.width,
            span.left + span.width,
          ) - Math.min(current.rect.left, span.left),
        height:
          Math.max(
            current.rect.top + current.rect.height,
            span.top + span.height,
          ) - Math.min(current.rect.top, span.top),
      },
    };
  }

  return lines;
}

function linePromptHint(
  line: ExperienceRenderedLine,
  context: ReadonlyArray<string>,
): string {
  const contextText = context.join(' ');
  if (
    /llm|genai|rag|mlops|machine learning|embeddings|vertex|beam|dataflow/i.test(
      contextText,
    )
  ) {
    return 'Explain the AI and platform significance of this detail for a recruiter evaluating senior ML and product delivery experience.';
  }

  if (line.kind === 'role') {
    return 'Summarize the scope, seniority, and likely ownership implied by this role line.';
  }

  if (line.kind === 'bullet') {
    return 'Translate this accomplishment into recruiter-facing impact, calling out delivery, scale, and technical maturity.';
  }

  return 'Explain why this visible CV detail matters to a recruiter in one concise grounded summary.';
}

function looksInteresting(line: ExperienceRenderedLine): boolean {
  const lower = line.text.toLowerCase();
  if (line.kind === 'role') {
    return line.text.length >= 8;
  }

  if (line.text.length < 18) {
    return false;
  }

  if (line.kind === 'bullet') {
    return true;
  }

  return /python|typescript|rag|vertex|aws|gcp|latam|blend|plutto|betterfly/i.test(
    lower,
  );
}

export function buildExperienceHoverTargets(
  lines: ReadonlyArray<ExperienceRenderedLine>,
): ReadonlyArray<ExperienceHoverTarget> {
  return lines
    .filter(looksInteresting)
    .slice(0, 8)
    .map((line, index) => {
      const context = lines
        .slice(
          Math.max(0, line.order - 1),
          Math.min(lines.length, line.order + 2),
        )
        .map((entry) => entry.text);

      return {
        id: `${line.id}-${slugify(line.text) || index}`,
        pageNumber: line.pageNumber,
        title:
          line.kind === 'role'
            ? 'Role scope'
            : line.kind === 'bullet'
              ? 'Impact signal'
              : 'Recruiter note',
        label: line.text,
        sourceText: line.text,
        kind: line.kind,
        rect: line.rect,
        context,
        promptHint: linePromptHint(line, context),
      };
    });
}

export function buildExperienceSearchResults(
  pages: ReadonlyArray<ExperiencePageIndex>,
  query: string,
): ReadonlyArray<ExperienceSearchResult> {
  const normalizedQuery = normalizeExperienceText(query).toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = normalizedQuery
    .split(' ')
    .filter((token) => token.length > 1);
  return pages
    .flatMap((page) =>
      page.lines.map((line) => {
        const normalizedLine = normalizeExperienceText(line.text).toLowerCase();
        const tokenScore = queryTokens.reduce((score, token) => {
          return normalizedLine.includes(token) ? score + 1 : score;
        }, 0);
        const phraseBonus = normalizedLine.includes(normalizedQuery) ? 3 : 0;
        const score = tokenScore + phraseBonus;

        return {
          id: line.id,
          pageNumber: page.pageNumber,
          text: line.text,
          excerpt: line.text,
          kind: line.kind,
          score,
        };
      }),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.pageNumber !== right.pageNumber) {
        return left.pageNumber - right.pageNumber;
      }

      return left.text.length - right.text.length;
    })
    .slice(0, 12);
}
