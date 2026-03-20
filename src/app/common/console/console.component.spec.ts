import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CountryService } from '../../services/country.service';

import { ConsoleComponent } from './console.component';

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  let checkIPSpy: jasmine.Spy;
  let countryServiceStub: CountryService;

  beforeEach(async () => {
    checkIPSpy = jasmine.createSpy('checkIP');
    countryServiceStub = Object.assign(of({ ip: '', country: 'US' }), {
      checkIP: checkIPSpy,
    }) as unknown as CountryService;

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

  it('should render the degree line without duplicating the major suffix', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');

    expect(text).toContain('Degree in Software Engineering');
    expect(text).not.toContain('Software Engineeringing');
  });
});
