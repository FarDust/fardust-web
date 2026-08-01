import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PRETEXT_EDITORIAL_CONTENT } from './pretext-page.data';
import { PretextEditorialEngineComponent } from './pretext-editorial-engine.component';

describe('PretextEditorialEngineComponent', () => {
  let component: PretextEditorialEngineComponent;
  let fixture: ComponentFixture<PretextEditorialEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PretextEditorialEngineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PretextEditorialEngineComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', PRETEXT_EDITORIAL_CONTENT);
    component.orbs.set(
      PRETEXT_EDITORIAL_CONTENT.orbs.map((orb) => ({ ...orb })),
    );
    fixture.detectChanges();
  });

  it('renders the section title and at least one draggable node', () => {
    const host: HTMLElement = fixture.nativeElement;
    const nodes = host.querySelectorAll('.pretext-editorial__orb');

    expect(host.textContent).toContain(PRETEXT_EDITORIAL_CONTENT.title);
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.length).toBeLessThanOrEqual(
      PRETEXT_EDITORIAL_CONTENT.orbs.length,
    );
  });

  it('reduces mobile routing pressure on narrow stages', () => {
    component['stageWidth'].set(322);
    component['stageHeight'].set(608);
    component.orbs.set(
      PRETEXT_EDITORIAL_CONTENT.orbs.map((orb) => ({ ...orb })),
    );

    const layout = component.projection();

    expect(component.visibleOrbs().length).toBe(1);
    expect(layout).not.toBeNull();
    expect(layout?.overflowed).toBeFalse();
  });
});
