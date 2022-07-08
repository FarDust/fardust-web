import { Component, OnInit } from '@angular/core';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { CountryService } from 'src/app/services/country.service';
import { GithubService } from 'src/app/services/github.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.sass']
})
export class InfoComponent implements OnInit {

  faUniversity = faUniversity;

  constructor(readonly githubService$: GithubService, readonly countryservice$: CountryService) { }

  ngOnInit(): void {
    this.countryservice$.checkIP('')
  }

}
