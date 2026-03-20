import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ViewerComponent } from './viewer.component';

describe('ViewerComponent', () => {
  let component: ViewerComponent;
  let fixture: ComponentFixture<ViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerComponent ],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set total pages on PDF load', () => {
    component.onPdfLoad({ numPages: 5 } as any);
    expect(component.totalPages).toBe(5);
  });

  it('should increment and decrement pages respecting limits', () => {
    component.totalPages = 2;
    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(2);
    component.nextPage();
    expect(component.page).toBe(2);
    component.prevPage();
    expect(component.page).toBe(1);
    component.prevPage();
    expect(component.page).toBe(1);
  });

  it('should zoom in and out respecting lower bound', () => {
    const initial = component.zoom;
    component.zoomIn();
    expect(component.zoom).toBeCloseTo(initial + 0.1, 5);
    for (let i = 0; i < 10; i++) {
      component.zoomOut();
    }
    expect(component.zoom).toBeGreaterThan(0.39);
  });
});
