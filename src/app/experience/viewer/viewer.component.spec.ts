import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PretextTextComponent } from '../../pretext/pretext-text.component';

import { ViewerComponent } from './viewer.component';

describe('ViewerComponent', () => {
  let component: ViewerComponent;
  let fixture: ComponentFixture<ViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewerComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        PretextTextComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set total pages on PDF load', () => {
    spyOn(component.document, 'loadDocument').and.resolveTo();
    component.onPdfLoad({ numPages: 5 } as any);
    expect(component.totalPages).toBe(5);
  });

  it('should increment and decrement pages respecting limits', () => {
    spyOn<any>(component, 'syncQueryParams').and.resolveTo(true);
    spyOn(component.ai, 'closeHoverCard');

    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(1);

    component.totalPages = 2;
    component.nextPage();
    expect(component.page).toBe(2);
    component.nextPage();
    expect(component.page).toBe(2);
    component.prevPage();
    expect(component.page).toBe(1);
    component.prevPage();
    expect(component.page).toBe(1);
  });

  it('should zoom in and out respecting lower bound', () => {
    const initial = component.zoom;
    component.zoomIn();
    expect(component.zoom).toBeCloseTo(initial + 0.1, 5);
    for (let i = 0; i < 10; i++) {
      component.zoomOut();
    }
    expect(component.zoom).toBeGreaterThan(0.39);
  });

  it('should keep the pdf viewer in single-page mode', () => {
    expect(component.showAllPages).toBeFalse();
  });

  it('should expose compact toolbar telemetry values', () => {
    component.page = 2;
    component.totalPages = 3;
    component.zoom = 1.25;
    component.searchDraft = 'betterfly';

    expect(component.toolbarStatusValue()).toBe('Ready');
    expect(component.toolbarPageValue()).toBe('2 of 3');
    expect(component.toolbarZoomValue()).toBe('125%');
    expect(component.toolbarSearchValue()).toBe('0 matches');
  });

  it('should clear pdfShellHeight on non-mobile resize', () => {
    component.pdfShellHeight = '500px';
    spyOn<any>(component, 'isMobileViewport').and.returnValue(false);

    (component as any).clearPdfShellHeight();

    expect(component.pdfShellHeight).toBeUndefined();
  });

  it('should not clear pdfShellHeight when already undefined', () => {
    component.pdfShellHeight = undefined;
    const cdrSpy = spyOn((component as any).cdr, 'detectChanges');

    (component as any).clearPdfShellHeight();

    expect(cdrSpy).not.toHaveBeenCalled();
  });

  it('should expose signal panel state for the side panel', () => {
    component.page = 1;
    component.totalPages = 3;

    const state = component.signalPanelState();

    expect(
      state.documentFields.some((field) => field.label === 'Artifact'),
    ).toBeTrue();
    expect(
      state.sessionFields.some((field) => field.label === 'Route'),
    ).toBeTrue();
    expect(state.aiStatusCopy.length).toBeGreaterThan(10);
  });

  it('should give stable ids and names to route workstation inputs', () => {
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const searchInput = host.querySelector<HTMLInputElement>(
      '#experience-route-search',
    );
    const pageJumpInput = host.querySelector<HTMLInputElement>(
      '#experience-page-jump',
    );

    expect(searchInput?.name).toBe('experience-route-search');
    expect(pageJumpInput?.name).toBe('experience-page-jump');
  });
});
