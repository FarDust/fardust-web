import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent {

  constructor(readonly githubService$: GithubService, private router: Router) { }

  goToCurriculum() { 
    this.router.navigate(['/experience']);
  }
}
