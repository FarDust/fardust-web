import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PretextValidationSectionComponent } from './pretext-validation-section.component';
import { PRETEXT_VALIDATION_CONTENT } from './pretext-page.data';

describe('PretextValidationSectionComponent', () => {
  let fixture: ComponentFixture<PretextValidationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PretextValidationSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PretextValidationSectionComponent);
    fixture.componentRef.setInput('content', PRETEXT_VALIDATION_CONTENT);
    fixture.detectChanges();
  });

  it('renders the title and validation brief link', () => {
    const host: HTMLElement = fixture.nativeElement;
    const briefLink = host.querySelector(
      '.pretext-validation__link',
    ) as HTMLAnchorElement | null;

    expect(host.textContent).toContain(PRETEXT_VALIDATION_CONTENT.title);
    expect(briefLink?.getAttribute('href')).toBe(
      PRETEXT_VALIDATION_CONTENT.briefHref,
    );
  });

  it('renders one validation card per provided sample', () => {
    const host: HTMLElement = fixture.nativeElement;
    const cards = host.querySelectorAll('.pretext-validation__card');

    expect(cards.length).toBe(PRETEXT_VALIDATION_CONTENT.samples.length);
  });

  it('switches the active mobile sample when a tab is selected', () => {
    const host: HTMLElement = fixture.nativeElement;
    const tabs = host.querySelectorAll<HTMLButtonElement>(
      '.pretext-validation__tab',
    );
    const sample = PRETEXT_VALIDATION_CONTENT.samples[4];

    tabs[4]?.click();
    fixture.detectChanges();

    const panel = host.querySelector('.pretext-validation__mobile-card');

    expect(tabs[4]?.getAttribute('aria-selected')).toBe('true');
    expect(panel?.textContent).toContain(sample?.label ?? '');
    expect(panel?.textContent).toContain(sample?.text ?? '');
  });
});
