import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CountryService } from '../../services/country.service';

import { ConsoleComponent } from './console.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  let checkIPSpy: jasmine.Spy;

  beforeEach(async () => {
    checkIPSpy = jasmine.createSpy('checkIP');
    await TestBed.configureTestingModule({
      declarations: [ConsoleComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        {
          provide: CountryService,
          useValue: {
            checkIP: checkIPSpy,
            subscribe: () => ({ unsubscribe() {} }),
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request IP on init', () => {
    expect(checkIPSpy).toHaveBeenCalledWith('');
  });
});
