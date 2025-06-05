import { TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should position footer at the bottom on large screens', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const footerEl: HTMLElement | null = fixture.nativeElement.querySelector('app-footer');
    expect(footerEl?.classList.contains('mt-auto')).toBeTrue();
  });

});
