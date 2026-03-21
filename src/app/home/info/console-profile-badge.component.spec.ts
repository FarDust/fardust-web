import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConsoleProfileBadgeComponent } from './console-profile-badge.component';

describe('ConsoleProfileBadgeComponent', () => {
  let component: ConsoleProfileBadgeComponent;
  let fixture: ComponentFixture<ConsoleProfileBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleProfileBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleProfileBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imageSrc', 'https://example.com/avatar.png');
    fixture.componentRef.setInput('imageAlt', 'Avatar alt');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the avatar image and status by default', () => {
    const image = fixture.debugElement.query(
      By.css('.console-profile-badge__image'),
    );
    const status = fixture.debugElement.query(
      By.css('.console-profile-badge__status'),
    );

    expect(image.nativeElement.getAttribute('src')).toContain('avatar.png');
    expect(image.nativeElement.getAttribute('alt')).toBe('Avatar alt');
    expect(status).toBeTruthy();
  });

  it('should hide the status indicator when disabled', () => {
    fixture.componentRef.setInput('showStatus', false);
    fixture.detectChanges();

    const status = fixture.debugElement.query(
      By.css('.console-profile-badge__status'),
    );
    expect(status).toBeNull();
  });

  it('should render a fallback label when the image is missing', () => {
    fixture.componentRef.setInput('imageSrc', null);
    fixture.componentRef.setInput('fallbackLabel', 'GF');
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(
      By.css('.console-profile-badge__placeholder'),
    );

    expect(placeholder.nativeElement.textContent.trim()).toBe('GF');
  });
});
