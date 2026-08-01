import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GithubService } from 'src/app/services/github.service';
import { NEVER } from 'rxjs';

import { InfoComponent } from './info.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: GithubService,
          useValue: NEVER,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the console shell before GitHub data resolves', () => {
    expect(
      fixture.nativeElement.querySelector('.console-layout'),
    ).not.toBeNull();
  });
});
