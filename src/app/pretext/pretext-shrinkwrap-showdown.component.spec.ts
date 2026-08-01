import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PRETEXT_SHRINKWRAP_CONTENT } from './pretext-page.data';
import { PretextShrinkwrapShowdownComponent } from './pretext-shrinkwrap-showdown.component';

describe('PretextShrinkwrapShowdownComponent', () => {
  let component: PretextShrinkwrapShowdownComponent;
  let fixture: ComponentFixture<PretextShrinkwrapShowdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PretextShrinkwrapShowdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PretextShrinkwrapShowdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', PRETEXT_SHRINKWRAP_CONTENT);
    fixture.detectChanges();
  });

  it('clamps requested width to the current max width', () => {
    component.maxWidth.set(320);

    component.setWidth('999');

    expect(component.chatWidth()).toBe(320);
  });

  it('computes a pretext bubble for every message', () => {
    expect(component.pretextBubbles().length).toBe(
      PRETEXT_SHRINKWRAP_CONTENT.messages.length,
    );
  });
});
