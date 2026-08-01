import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsoleLeftRailComponent } from './console-left-rail.component';

describe('ConsoleLeftRailComponent', () => {
  let fixture: ComponentFixture<ConsoleLeftRailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleLeftRailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleLeftRailComponent);
    fixture.componentRef.setInput('primaryItems', []);
    fixture.componentRef.setInput('utilityItems', []);
    fixture.componentRef.setInput('focus', 'Machine Learning Engineering');
    fixture.componentRef.setInput('path', '~/fardust-web/experience');
    fixture.detectChanges();
  });

  it('renders the provided route path in the identity block', () => {
    const path = fixture.nativeElement.querySelector(
      '.console-rail__path',
    ) as HTMLElement | null;

    expect(path?.textContent?.trim()).toBe('~/fardust-web/experience');
  });
});
