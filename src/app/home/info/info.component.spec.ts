import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { GithubService } from 'src/app/services/github.service';

import { InfoComponent } from './info.component';

describe('HeaderComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CountryService, useValue: { checkIP: () => {}, subscribe: () => ({unsubscribe(){}}) } },
        { provide: GithubService, useValue: { subscribe: () => ({unsubscribe(){}}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
