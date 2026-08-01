import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PretextComponent } from './pretext.component';

describe('PretextComponent', () => {
  let fixture: ComponentFixture<PretextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PretextComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PretextComponent);
    fixture.detectChanges();
  });

  it('renders the four main route sections through dedicated subcomponents', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('app-pretext-hero')).not.toBeNull();
    expect(host.querySelector('app-pretext-editorial-engine')).not.toBeNull();
    expect(
      host.querySelector('app-pretext-shrinkwrap-showdown'),
    ).not.toBeNull();
    expect(host.querySelector('app-pretext-validation-section')).not.toBeNull();
  });
});
