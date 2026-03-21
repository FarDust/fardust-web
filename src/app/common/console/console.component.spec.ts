import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CountryService } from '../../services/country.service';

import { ConsoleComponent } from './console.component';

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  let checkIPSpy: jasmine.Spy;
  let countryServiceStub: {
    checkIP: jasmine.Spy;
    subscribe: typeof Observable.prototype.subscribe;
  };

  beforeEach(async () => {
    checkIPSpy = jasmine.createSpy('checkIP');
    const countryResult$ = of({ ip: '', country: 'CL' });
    countryServiceStub = {
      checkIP: checkIPSpy,
      subscribe: countryResult$.subscribe.bind(countryResult$),
    };

    await TestBed.configureTestingModule({
      declarations: [ConsoleComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        {
          provide: CountryService,
          useValue: countryServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    component.major = 'Software Engineering';
    component.minor = 'Computer Science';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request IP on init', () => {
    expect(checkIPSpy).toHaveBeenCalledWith('');
  });

  it('should render the education line without duplicating the major suffix', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');

    expect(text).toContain('Major: Software Engineering');
    expect(text).not.toContain('Software Engineeringing');
  });

  it('should render the degree label for non-CL locales', () => {
    const countryResult$ = of({ ip: '', country: 'US' });
    countryServiceStub.subscribe =
      countryResult$.subscribe.bind(countryResult$);

    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    component.degree = 'B.Eng.';
    component.major = 'Software Engineering';
    component.minor = 'Computer Science';
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Degree: B.Eng.');
    expect(text).not.toContain('Degree: Software Engineering');
  });
});
