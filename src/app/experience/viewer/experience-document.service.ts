import { Injectable, computed, signal } from '@angular/core';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import {
  buildExperienceHoverTargets,
  buildExperienceSearchResults,
  buildRenderedLineGroups,
  groupPdfItemsIntoLines,
  normalizeExperienceText,
} from './experience-document.utils';
import {
  ExperienceDocumentItem,
  ExperienceHoverTarget,
  ExperiencePageIndex,
  ExperienceRenderedSpan,
  ExperienceSearchResult,
} from './experience-viewer.types';

type PdfTextContentItem = {
  str?: string;
  transform?: number[];
  height?: number;
};

@Injectable()
export class ExperienceDocumentService {
  private readonly pagesState = signal<ReadonlyArray<ExperiencePageIndex>>([]);
  private readonly renderedTargetsState = signal<
    ReadonlyArray<ExperienceHoverTarget>
  >([]);
  private readonly searchQueryState = signal('');
  private readonly extractionState = signal<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  private readonly extractionProgressState = signal(0);

  readonly pages = computed(() => this.pagesState());
  readonly searchQuery = computed(() => this.searchQueryState());
  readonly extractionStatus = computed(() => this.extractionState());
  readonly extractionProgress = computed(() => this.extractionProgressState());
  readonly hoverTargets = computed(() => this.renderedTargetsState());
  readonly searchResults = computed<ReadonlyArray<ExperienceSearchResult>>(() =>
    buildExperienceSearchResults(this.pagesState(), this.searchQueryState()),
  );

  async loadDocument(pdf: PDFDocumentProxy): Promise<void> {
    this.extractionState.set('loading');
    this.extractionProgressState.set(0);

    try {
      const pages: ExperiencePageIndex[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const items = (content.items as PdfTextContentItem[])
          .map((item) => this.mapPdfItem(item))
          .filter(
            (item): item is ExperienceDocumentItem =>
              item !== null && item.text.length > 0,
          );

        pages.push({
          pageNumber,
          lines: groupPdfItemsIntoLines(items, pageNumber),
        });
        this.pagesState.set([...pages]);
        this.extractionProgressState.set(pageNumber / pdf.numPages);
      }

      this.extractionState.set('ready');
    } catch {
      this.extractionState.set('error');
    }
  }

  setSearchQuery(query: string): void {
    this.searchQueryState.set(query);
  }

  syncRenderedPage(pageNumber: number, shell: HTMLElement): void {
    const shellRect = shell.getBoundingClientRect();
    const spans = Array.from(
      shell.querySelectorAll<HTMLElement>('.textLayer span'),
    )
      .map((node) => {
        const text = normalizeExperienceText(node.textContent ?? '');
        const rect = node.getBoundingClientRect();
        if (!text || rect.width <= 0 || rect.height <= 0) {
          return null;
        }

        return {
          text,
          left: rect.left - shellRect.left,
          top: rect.top - shellRect.top,
          width: rect.width,
          height: rect.height,
        } satisfies ExperienceRenderedSpan;
      })
      .filter((span): span is ExperienceRenderedSpan => span !== null);

    this.renderedTargetsState.set(
      buildExperienceHoverTargets(buildRenderedLineGroups(spans, pageNumber)),
    );
  }

  searchResultById(id: string): ExperienceSearchResult | undefined {
    return this.searchResults().find((result) => result.id === id);
  }

  contextForTarget(target: ExperienceHoverTarget): string {
    return target.context.join(' ');
  }

  private mapPdfItem(item: PdfTextContentItem): ExperienceDocumentItem | null {
    if (
      !item?.str ||
      !item.transform ||
      typeof item.transform[4] !== 'number' ||
      typeof item.transform[5] !== 'number'
    ) {
      return null;
    }

    return {
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      fontSize:
        typeof item.height === 'number' && Number.isFinite(item.height)
          ? item.height
          : Math.abs(item.transform[0]) || 12,
    };
  }
}
