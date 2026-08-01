import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { GithubService } from '../services/github.service';

import { NavbarComponent } from './navbar.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { PretextTextComponent } from '../pretext/pretext-text.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  const setRouterUrl = (url: string) => {
    Object.defineProperty(router, 'url', {
      configurable: true,
      get: () => url,
    });
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu state', () => {
    expect(component.menuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();
  });

  it('should close the menu', () => {
    component.menuOpen = true;
    component.closeMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should treat home fragments as the home route', () => {
    setRouterUrl('/#console-core');

    expect(component.isHomeRoute()).toBeTrue();
    expect(component.currentContextLabel()).toBe('Profile active');
  });

  it('should only match the experience route and its children', () => {
    setRouterUrl('/experience-archive');
    expect(component.isExperienceRoute()).toBeFalse();

    setRouterUrl('/experience/details');
    expect(component.isExperienceRoute()).toBeTrue();
    expect(component.currentContextLabel()).toBe('Curriculum active');
  });

  it('should detect the embedding space route', () => {
    setRouterUrl('/embedding-space');
    expect(component.isEmbeddingSpaceRoute()).toBeTrue();
    expect(component.currentContextLabel()).toBe('Embedding active');
  });

  it('should not match embedding-space prefix on unrelated routes', () => {
    setRouterUrl('/embedding-spaceship');
    expect(component.isEmbeddingSpaceRoute()).toBeFalse();
  });

  it('should detect the pretext route', () => {
    setRouterUrl('/pretext');
    expect(component.isPretextRoute()).toBeTrue();
    expect(component.currentContextLabel()).toBe('Pretext active');
  });

  it('should include embedding space in nav items', () => {
    const ids = component.navItems.map((item) => item.id);
    expect(ids).toContain('embedding-space');
  });
});
