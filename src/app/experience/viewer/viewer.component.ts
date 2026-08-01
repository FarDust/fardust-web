import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import {
  CONSOLE_CURRENT_FOCUS,
  CONSOLE_PROFILE_DETAILS,
  CONSOLE_RAIL_UTILITY_ITEMS,
  createConsoleRailPrimaryItems,
} from 'src/app/home/info/console-shell.data';
import { ConsoleSpecField } from 'src/app/home/info/console.models';
import { EXPERIENCE_AI_ADAPTER } from './experience-ai-adapter';
import { ExperienceAiService } from './experience-ai.service';
import { ExperienceDocumentService } from './experience-document.service';
import { TransformersExperienceAiAdapter } from './transformers-experience-ai.adapter';
import {
  ExperienceHoverTarget,
  ExperienceInspectorTab,
  ExperienceSignalPanelState,
} from './experience-viewer.types';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.sass'],
  standalone: false,
  providers: [
    ExperienceDocumentService,
    ExperienceAiService,
    TransformersExperienceAiAdapter,
    {
      provide: EXPERIENCE_AI_ADAPTER,
      useExisting: TransformersExperienceAiAdapter,
    },
  ],
})
export class ViewerComponent {
  @ViewChild('pdfShell')
  pdfShellRef?: ElementRef<HTMLElement>;

  readonly pdfSrc =
    'https://storage.googleapis.com/landing-artifacts/curriculum/cv-gabriel-faundez.pdf';
  readonly showAllPages = false;
  readonly currentFocus = CONSOLE_CURRENT_FOCUS;
  readonly railPrimaryItems = createConsoleRailPrimaryItems('Experience');
  readonly railUtilityItems = CONSOLE_RAIL_UTILITY_ITEMS;
  readonly profileDetails: ReadonlyArray<ConsoleSpecField> =
    CONSOLE_PROFILE_DETAILS;

  readonly document = inject(ExperienceDocumentService);
  readonly ai = inject(ExperienceAiService);

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  page = 1;
  pageJumpValue = '1';
  totalPages?: number;
  zoom = 1;
  pdfShellHeight?: string;
  searchDraft = '';
  activeInspectorTab: ExperienceInspectorTab = 'overview';

  private pendingFocusTargetId: string | null = null;
  private pendingFocusText: string | null = null;

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const requestedPage = Number.parseInt(params.get('page') ?? '1', 10);
        const nextPage = Number.isFinite(requestedPage)
          ? Math.max(requestedPage, 1)
          : 1;
        this.page = nextPage;
        this.pageJumpValue = `${nextPage}`;

        this.searchDraft = params.get('q') ?? '';
        this.document.setSearchQuery(this.searchDraft);

        this.pendingFocusTargetId = params.get('focus');
      });

    this.ai.warmUpOnIdle();
  }

  onPdfLoad(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
    this.pageJumpValue = `${this.page}`;
    this.schedulePdfShellSync();
    void this.document.loadDocument(pdf);
  }

  onPdfPageRendered(): void {
    this.schedulePdfShellSync();
    this.scheduleRenderedTargetSync();
  }

  toolbarStatusValue(): string {
    if (!this.totalPages) {
      return 'Syncing';
    }

    return this.document.extractionStatus() === 'ready' ? 'Indexed' : 'Ready';
  }

  toolbarPageValue(): string {
    return `${this.page} of ${this.totalPages ?? '?'}`;
  }

  toolbarZoomValue(): string {
    return `${Math.round(this.zoom * 100)}%`;
  }

  toolbarSearchValue(): string {
    return this.searchDraft
      ? `${this.document.searchResults().length} matches`
      : 'No filter';
  }

  nextPage(): void {
    if (!this.totalPages || this.page >= this.totalPages) {
      return;
    }

    this.setPage(this.page + 1);
  }

  prevPage(): void {
    if (this.page > 1) {
      this.setPage(this.page - 1);
    }
  }

  jumpToPage(): void {
    const requested = Number.parseInt(this.pageJumpValue, 10);
    if (!Number.isFinite(requested)) {
      this.pageJumpValue = `${this.page}`;
      return;
    }

    const maxPage = this.totalPages ?? requested;
    const nextPage = Math.min(Math.max(requested, 1), maxPage);
    this.setPage(nextPage);
  }

  zoomIn(): void {
    this.invalidatePdfShellHeight();
    this.zoom += 0.1;
  }

  zoomOut(): void {
    if (this.zoom <= 0.5) {
      return;
    }

    this.invalidatePdfShellHeight();
    this.zoom -= 0.1;
  }

  onSearchQueryChange(query: string): void {
    this.searchDraft = query;
    this.document.setSearchQuery(query);
    void this.syncQueryParams({
      q: query || null,
    });
  }

  onSearchResultSelected(resultId: string): void {
    const result = this.document.searchResultById(resultId);
    if (!result) {
      return;
    }

    this.pendingFocusText = result.text;
    this.activeInspectorTab = 'search';
    this.setPage(result.pageNumber, {
      focus: null,
      q: this.searchDraft || null,
    });
  }

  onInspectorTabChange(tab: ExperienceInspectorTab): void {
    this.activeInspectorTab = tab;
  }

  async onHoverTargetActivated(target: ExperienceHoverTarget): Promise<void> {
    const imageDataUrl = this.captureTargetCrop(target);
    if (!imageDataUrl) {
      return;
    }

    await this.ai.inspectTarget(
      target,
      imageDataUrl,
      this.document.contextForTarget(target),
    );

    void this.syncQueryParams({
      page: `${target.pageNumber}`,
      focus: target.id,
      q: this.searchDraft || null,
    });
  }

  clearAiCache(): void {
    this.ai.clearCache();
  }

  warmLocalModel(): void {
    this.ai.warmUpNow();
  }

  closeHoverCard(): void {
    this.ai.closeHoverCard();
  }

  async copyDeepLink(): Promise<void> {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      return;
    }

    const currentFocus = this.ai.hoverCard()?.targetId ?? null;
    const link = new URL(window.location.href);
    link.searchParams.set('page', `${this.page}`);

    if (this.searchDraft) {
      link.searchParams.set('q', this.searchDraft);
    } else {
      link.searchParams.delete('q');
    }

    if (currentFocus) {
      link.searchParams.set('focus', currentFocus);
    } else {
      link.searchParams.delete('focus');
    }

    await navigator.clipboard.writeText(link.toString());
  }

  signalPanelState(): ExperienceSignalPanelState {
    return {
      overviewFields: this.profileDetails,
      documentFields: [
        { label: 'Artifact', value: 'Curriculum Vitae' },
        { label: 'Updated', value: 'January 2026' },
        { label: 'Format', value: 'PDF' },
        {
          label: 'Index',
          value:
            this.document.extractionStatus() === 'ready'
              ? 'Ready'
              : `${Math.round(this.document.extractionProgress() * 100)}%`,
        },
      ],
      sessionFields: [
        { label: 'Page', value: `${this.page}` },
        { label: 'Total', value: `${this.totalPages ?? '?'}` },
        { label: 'Zoom', value: this.toolbarZoomValue() },
        { label: 'Route', value: '/experience' },
      ],
      searchQuery: this.searchDraft,
      searchResults: this.document.searchResults(),
      activeTab: this.activeInspectorTab,
      aiReadiness: this.ai.readiness(),
      aiStatusCopy: this.aiStatusCopy(),
      hoverTargetCount: this.document.hoverTargets().length,
      cacheCount: this.ai.cacheCount(),
    };
  }

  hoverTargetIsActive(targetId: string): boolean {
    return this.ai.hoverCard()?.targetId === targetId;
  }

  aiStatusCopy(): string {
    switch (this.ai.readiness()) {
      case 'ready':
        return 'Local multimodal hover generation is armed. Hover or tap highlighted lines to generate grounded recruiter notes in place.';
      case 'warming':
        return 'Queueing the local multimodal coprocessor in the background. The PDF viewer stays fully usable while weights warm.';
      case 'unsupported':
        return this.ai.readinessReason();
      case 'error':
        return this.ai.readinessReason();
      default:
        return 'Local hover intelligence is parked until the route gets an idle window to warm the model.';
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isMobileViewport()) {
      this.clearPdfShellHeight();
      return;
    }

    this.schedulePdfShellSync();
  }

  private setPage(
    nextPage: number,
    queryOverrides?: {
      page?: string | null;
      q?: string | null;
      focus?: string | null;
    },
  ): void {
    const maxPage = this.totalPages ?? nextPage;
    this.page = Math.min(Math.max(nextPage, 1), maxPage);
    this.pageJumpValue = `${this.page}`;
    this.invalidatePdfShellHeight();
    this.ai.closeHoverCard();

    void this.syncQueryParams({
      page: `${this.page}`,
      focus: queryOverrides?.focus ?? null,
      q: queryOverrides?.q ?? (this.searchDraft || null),
    });
  }

  private schedulePdfShellSync(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      this.syncPdfShellHeight();
    });
  }

  private syncPdfShellHeight(): void {
    if (!this.isMobileViewport()) {
      this.clearPdfShellHeight();
      return;
    }

    const shell = this.pdfShellRef?.nativeElement;
    const page = shell?.querySelector('.page') as HTMLElement | null;

    if (!shell || !page) {
      return;
    }

    const nextHeight = `${Math.ceil(page.getBoundingClientRect().height + 2)}px`;
    if (this.pdfShellHeight === nextHeight) {
      return;
    }

    this.pdfShellHeight = nextHeight;
    this.cdr.detectChanges();
  }

  private invalidatePdfShellHeight(): void {
    if (!this.isMobileViewport()) {
      return;
    }

    this.pdfShellHeight = undefined;
  }

  private clearPdfShellHeight(): void {
    if (!this.pdfShellHeight) {
      return;
    }

    this.pdfShellHeight = undefined;
    this.cdr.detectChanges();
  }

  private isMobileViewport(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  private schedulePendingTargetActivation(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      if (this.pendingFocusTargetId) {
        const target = this.document
          .hoverTargets()
          .find((entry) => entry.id === this.pendingFocusTargetId);
        if (target) {
          this.pendingFocusTargetId = null;
          void this.onHoverTargetActivated(target);
        }
      }

      if (this.pendingFocusText) {
        const target = this.document
          .hoverTargets()
          .find((entry) => entry.sourceText === this.pendingFocusText);
        if (target) {
          this.pendingFocusText = null;
          void this.onHoverTargetActivated(target);
        }
      }
    });
  }

  private scheduleRenderedTargetSync(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const runSync = () => {
      const shell = this.pdfShellRef?.nativeElement;
      if (!shell) {
        return;
      }

      this.document.syncRenderedPage(this.page, shell);
      if (!this.document.hoverTargets().length) {
        window.setTimeout(() => {
          this.document.syncRenderedPage(this.page, shell);
          this.schedulePendingTargetActivation();
          this.cdr.detectChanges();
        }, 140);
        return;
      }

      this.schedulePendingTargetActivation();
      this.cdr.detectChanges();
    };

    window.requestAnimationFrame(runSync);
  }

  private captureTargetCrop(target: ExperienceHoverTarget): string | null {
    const shell = this.pdfShellRef?.nativeElement;
    const canvas = shell?.querySelector(
      '.page canvas',
    ) as HTMLCanvasElement | null;
    if (!shell || !canvas) {
      return null;
    }

    const shellRect = shell.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const cssLeft = canvasRect.left - shellRect.left;
    const cssTop = canvasRect.top - shellRect.top;

    const cropLeft = target.rect.left - cssLeft - 24;
    const cropTop = target.rect.top - cssTop - 24;
    const cropWidth = target.rect.width + 48;
    const cropHeight = target.rect.height + 72;

    const scaleX = canvas.width / Math.max(canvasRect.width, 1);
    const scaleY = canvas.height / Math.max(canvasRect.height, 1);

    const sourceX = Math.max(0, Math.floor(cropLeft * scaleX));
    const sourceY = Math.max(0, Math.floor(cropTop * scaleY));
    const sourceWidth = Math.min(
      canvas.width - sourceX,
      Math.ceil(cropWidth * scaleX),
    );
    const sourceHeight = Math.min(
      canvas.height - sourceY,
      Math.ceil(cropHeight * scaleY),
    );

    if (sourceWidth <= 0 || sourceHeight <= 0) {
      return null;
    }

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = sourceWidth;
    previewCanvas.height = sourceHeight;
    const context = previewCanvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.drawImage(
      canvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight,
    );

    return previewCanvas.toDataURL('image/png');
  }

  private syncQueryParams(
    query: Record<string, string | null | undefined>,
  ): Promise<boolean> {
    return this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: query,
      queryParamsHandling: 'merge',
    });
  }
}
