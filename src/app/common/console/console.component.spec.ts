import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CountryService } from '../../services/country.service';

import { ConsoleComponent } from './console.component';

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CountryService, useValue: { checkIP: () => {}, subscribe: () => ({unsubscribe() {}}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
