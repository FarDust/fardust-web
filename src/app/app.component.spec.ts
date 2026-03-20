import { TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(waitForAsync(() => {
    translateService = jasmine.createSpyObj<TranslateService>(
      'TranslateService',
      ['setDefaultLang', 'getBrowserLang', 'use'],
    );
    translateService.getBrowserLang.and.returnValue('en-US');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AppComponent],
      providers: [{ provide: TranslateService, useValue: translateService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize translations using the browser language', () => {
    TestBed.createComponent(AppComponent);

    expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateService.getBrowserLang).toHaveBeenCalled();
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should switch to Spanish when the browser language starts with es', () => {
    translateService.getBrowserLang.and.returnValue('es-CL');

    TestBed.createComponent(AppComponent);

    expect(translateService.use).toHaveBeenCalledWith('es');
  });

  it('should position footer at the bottom on large screens', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const footerEl: HTMLElement | null =
      fixture.nativeElement.querySelector('app-footer');
    expect(footerEl?.classList.contains('mt-auto')).toBeTrue();
  });
});
