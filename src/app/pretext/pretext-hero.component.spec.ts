import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PretextHeroComponent } from './pretext-hero.component';
import { PRETEXT_HERO_CONTENT } from './pretext-page.data';

describe('PretextHeroComponent', () => {
  let fixture: ComponentFixture<PretextHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PretextHeroComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PretextHeroComponent);
    fixture.componentRef.setInput('content', PRETEXT_HERO_CONTENT);
    fixture.detectChanges();
  });

  it('renders the headline and both call-to-action labels', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.textContent).toContain(PRETEXT_HERO_CONTENT.title);
    expect(host.textContent).toContain(PRETEXT_HERO_CONTENT.returnActionLabel);
    expect(host.textContent).toContain(PRETEXT_HERO_CONTENT.libraryActionLabel);
  });

  it('renders the metric and timeline collections from the provided content', () => {
    const host: HTMLElement = fixture.nativeElement;
    const metrics = host.querySelectorAll('.pretext-hero__metric');
    const timelineRows = host.querySelectorAll('.pretext-hero__timeline-row');

    expect(metrics.length).toBe(PRETEXT_HERO_CONTENT.metrics.length);
    expect(timelineRows.length).toBe(PRETEXT_HERO_CONTENT.timeline.length);
  });

  it('binds the expected destinations for both call-to-action links', () => {
    const host: HTMLElement = fixture.nativeElement;
    const links = host.querySelectorAll<HTMLAnchorElement>(
      '.pretext-hero__action',
    );

    expect(links.length).toBe(2);
    expect(links[0]?.getAttribute('href')).toBe('/');
    expect(links[1]?.getAttribute('href')).toBe(
      PRETEXT_HERO_CONTENT.libraryActionHref,
    );
    expect(links[1]?.getAttribute('target')).toBe('_blank');
  });
});
