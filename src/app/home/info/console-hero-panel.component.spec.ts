import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ConsoleHeroPanelComponent } from './console-hero-panel.component';

describe('ConsoleHeroPanelComponent', () => {
  let fixture: ComponentFixture<ConsoleHeroPanelComponent>;
  let component: ConsoleHeroPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleHeroPanelComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleHeroPanelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('metrics', []);
    fixture.componentRef.setInput('specifications', []);
    fixture.componentRef.setInput('primaryAction', {
      label: 'OPEN_CV',
      href: 'https://example.com/cv.pdf',
    });
    fixture.detectChanges();
  });

  it('should render the primary action as a downloadable CV link', () => {
    const primaryAction: HTMLAnchorElement =
      fixture.nativeElement.querySelector('.console-hero__action--primary');

    expect(primaryAction.getAttribute('href')).toBe(
      'https://example.com/cv.pdf',
    );
    expect(primaryAction.getAttribute('download')).toBe(
      'gabriel-faundez-cv.pdf',
    );
    expect(primaryAction.getAttribute('target')).toBe('_blank');
  });
});
