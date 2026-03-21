import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass'],
  standalone: false,
})
export class FooterComponent {
  constructor(readonly githubService$: GithubService) {}
}
