import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { EmbeddingSpaceApiPanelComponent } from './embedding-space-api-panel.component';

describe('EmbeddingSpaceApiPanelComponent', () => {
  let fixture: ComponentFixture<EmbeddingSpaceApiPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmbeddingSpaceApiPanelComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbeddingSpaceApiPanelComponent);
    fixture.componentRef.setInput('apiUrl', 'https://example.com/embeddings');
    fixture.componentRef.setInput('apiStatus', 'idle');
    fixture.componentRef.setInput('apiError', '');
    fixture.componentRef.setInput('sampleExpanded', false);
    fixture.detectChanges();
  });

  it('renders the connect action enabled when a URL is present', () => {
    const button = fixture.nativeElement.querySelector(
      '.embedding-api-panel__connect',
    ) as HTMLButtonElement | null;

    expect(button?.disabled).toBeFalse();
    expect(button?.textContent).toContain('Connect');
  });

  it('emits changes for sample toggles and connect requests', () => {
    const component = fixture.componentInstance;
    const toggleSpy = spyOn(component.sampleExpandedChange, 'emit');
    const connectSpy = spyOn(component.connectRequested, 'emit');
    const toggle = fixture.nativeElement.querySelector(
      '.embedding-api-panel__sample-toggle',
    ) as HTMLButtonElement | null;
    const connect = fixture.nativeElement.querySelector(
      '.embedding-api-panel__connect',
    ) as HTMLButtonElement | null;

    toggle?.click();
    connect?.click();

    expect(toggleSpy).toHaveBeenCalledWith(true);
    expect(connectSpy).toHaveBeenCalledWith('https://example.com/embeddings');
  });
});
