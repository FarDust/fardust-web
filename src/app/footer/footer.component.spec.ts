import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { GithubService } from '../services/github.service';

import { FooterComponent } from './footer.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { PretextTextComponent } from '../pretext/pretext-text.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterModule, PretextTextComponent],
      providers: [
        {
          provide: GithubService,
          useValue: { subscribe: () => ({ unsubscribe() {} }) },
        },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a curriculum router link', () => {
    const curriculumLink = fixture.debugElement
      .queryAll(By.css('.console-footer__links a'))
      .find((link) => link.nativeElement.textContent.includes('Curriculum'));

    expect(curriculumLink).toBeTruthy();
  });
});
