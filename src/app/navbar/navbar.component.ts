import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../services/github.service';

type NavItem = {
  id: 'home' | 'experience' | 'embedding-space' | 'pretext';
  label: string;
  route: string;
  fragment?: string;
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  standalone: false,
})
export class NavbarComponent {
  menuOpen = false;
  readonly navItems: ReadonlyArray<NavItem> = [
    {
      id: 'home',
      label: 'Overview',
      route: '/',
      fragment: 'console-core',
    },
    {
      id: 'experience',
      label: 'Experience',
      route: '/experience',
    },
    {
      id: 'embedding-space',
      label: 'Embedding space',
      route: '/embedding-space',
    },
    {
      id: 'pretext',
      label: 'Pretext lab',
      route: '/pretext',
    },
  ];

  constructor(
    readonly githubService$: GithubService,
    private readonly router: Router,
  ) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  isNavItemActive(itemId: NavItem['id']): boolean {
    switch (itemId) {
      case 'experience':
        return this.isExperienceRoute();
      case 'embedding-space':
        return this.isEmbeddingSpaceRoute();
      case 'pretext':
        return this.isPretextRoute();
      default:
        return this.isHomeRoute();
    }
  }

  private currentPath(): string {
    return this.router.url.split(/[?#]/, 1)[0] || '/';
  }

  isHomeRoute(): boolean {
    return this.currentPath() === '/';
  }

  isExperienceRoute(): boolean {
    const path = this.currentPath();
    return path === '/experience' || path.startsWith('/experience/');
  }

  isEmbeddingSpaceRoute(): boolean {
    const path = this.currentPath();
    return path === '/embedding-space' || path.startsWith('/embedding-space/');
  }

  isPretextRoute(): boolean {
    const path = this.currentPath();
    return path === '/pretext' || path.startsWith('/pretext/');
  }

  currentContextLabel(): string {
    if (this.isExperienceRoute()) {
      return 'Curriculum active';
    }

    if (this.isEmbeddingSpaceRoute()) {
      return 'Embedding active';
    }

    if (this.isPretextRoute()) {
      return 'Pretext active';
    }

    if (this.isHomeRoute()) {
      return 'Profile active';
    }

    return 'Route active';
  }
}
