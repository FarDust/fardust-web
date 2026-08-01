import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PretextTextComponent } from '../../pretext/pretext-text.component';
import { ExperienceSignalPanelComponent } from './experience-signal-panel.component';
import { ExperienceSignalPanelState } from './experience-viewer.types';

describe('ExperienceSignalPanelComponent', () => {
  let fixture: ComponentFixture<ExperienceSignalPanelComponent>;
  let component: ExperienceSignalPanelComponent;

  const state: ExperienceSignalPanelState = {
    overviewFields: [{ label: 'Role', value: 'Software Engineer' }],
    documentFields: [{ label: 'Artifact', value: 'Curriculum Vitae' }],
    sessionFields: [{ label: 'Route', value: '/experience' }],
    searchQuery: 'Angular',
    searchResults: [],
    activeTab: 'search',
    aiReadiness: 'idle',
    aiStatusCopy: 'Automation session parked local model warmup.',
    hoverTargetCount: 8,
    cacheCount: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExperienceSignalPanelComponent],
      imports: [PretextTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceSignalPanelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('state', state);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should give the panel search field stable id and name attributes', () => {
    const searchInput = fixture.debugElement.query(
      By.css('#experience-panel-search'),
    ).nativeElement as HTMLInputElement;

    expect(searchInput.name).toBe('experience-panel-search');
    expect(searchInput.value).toBe('Angular');
  });
});
