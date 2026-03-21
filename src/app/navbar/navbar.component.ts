import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  standalone: false,
})
export class NavbarComponent {
  menuOpen: boolean = false;

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

  currentContextLabel(): string {
    if (this.isExperienceRoute()) {
      return 'CURRICULUM_ACTIVE';
    }

    if (this.isHomeRoute()) {
      return 'PROFILE_ACTIVE';
    }

    return 'ROUTE_ACTIVE';
  }
}
