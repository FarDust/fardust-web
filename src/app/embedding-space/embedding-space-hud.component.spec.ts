import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EmbeddingSpaceHudComponent } from './embedding-space-hud.component';

describe('EmbeddingSpaceHudComponent', () => {
  let fixture: ComponentFixture<EmbeddingSpaceHudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmbeddingSpaceHudComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmbeddingSpaceHudComponent);
    fixture.componentRef.setInput('apiStatus', 'live');
    fixture.componentRef.setInput('tryItOpen', true);
    fixture.detectChanges();
  });

  it('renders the live status and toggle button state', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.textContent).toContain('LIVE DATA');
    expect(host.querySelector('.embedding-hud__try-btn.active')).not.toBeNull();
  });

  it('emits a toggle request when the try button is clicked', () => {
    const component = fixture.componentInstance;
    const toggleSpy = spyOn(component.toggleTryIt, 'emit');
    const button = fixture.nativeElement.querySelector(
      '.embedding-hud__try-btn',
    ) as HTMLButtonElement | null;

    button?.click();

    expect(toggleSpy).toHaveBeenCalled();
  });
});
