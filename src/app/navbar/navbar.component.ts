import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  menuOpen: boolean = false;

  constructor(readonly githubService$: GithubService) { }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

}
