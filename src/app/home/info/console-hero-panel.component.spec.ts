import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

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

  it('renders the GitHub avatar when profile data is available', () => {
    fixture.componentRef.setInput('github', {
      login: 'FarDust',
      avatar_url: 'https://avatars.example/FarDust.png',
      url: 'https://api.github.com/users/FarDust',
      html_url: 'https://github.com/FarDust',
      name: 'Gabriel Faundez',
    });
    fixture.detectChanges();

    const portrait = fixture.debugElement.query(
      By.css('.console-profile-badge__image'),
    )?.nativeElement as HTMLImageElement | undefined;

    expect(portrait).toBeTruthy();
    expect(portrait?.getAttribute('src')).toContain(
      'https://avatars.example/FarDust.png',
    );
    expect(portrait?.getAttribute('alt')).toBe('Gabriel Faundez GitHub avatar');
  });
});
