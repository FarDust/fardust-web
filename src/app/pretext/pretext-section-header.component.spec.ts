import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PretextSectionHeaderComponent } from './pretext-section-header.component';

@Component({
  imports: [PretextSectionHeaderComponent],
  template: `
    <app-pretext-section-header
      [eyebrow]="'Telemetry corridor'"
      [title]="'Copy routed around live telemetry'"
      [lead]="'A reusable section header keeps the lab aligned.'"
    >
      <button type="button" sectionAside>Open diagnostics</button>
    </app-pretext-section-header>
  `,
})
class TestHostComponent {}

describe('PretextSectionHeaderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('renders the eyebrow, title, and lead copy', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.textContent).toContain('Telemetry corridor');
    expect(host.textContent).toContain('Copy routed around live telemetry');
    expect(host.textContent).toContain(
      'A reusable section header keeps the lab aligned.',
    );
  });

  it('projects the aside content when provided', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.textContent).toContain('Open diagnostics');
  });
});
