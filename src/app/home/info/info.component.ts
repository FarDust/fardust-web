import { Component, OnInit, HostListener } from '@angular/core';
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

  secretSequence: string[] = ['t', 'e', 'c', 'h'];
  sequenceIndex = 0;
  easterEgg = false;

  starTrekSequence: string[] = ['n', 'c', 'c', '1', '7', '0', '1', 'd'];
  starIndex = 0;
  starTrekEgg = false;

  constructor(readonly githubService$: GithubService, readonly countryservice$: CountryService) { }

  ngOnInit(): void {
    this.countryservice$.checkIP('')
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === this.secretSequence[this.sequenceIndex]) {
      this.sequenceIndex++;
      if (this.sequenceIndex === this.secretSequence.length) {
        this.easterEgg = true;
        this.sequenceIndex = 0;
      }
    } else {
      this.sequenceIndex = 0;
    }

    if (key === this.starTrekSequence[this.starIndex]) {
      this.starIndex++;
      if (this.starIndex === this.starTrekSequence.length) {
        this.starTrekEgg = true;
        this.starIndex = 0;
      }
    } else {
      this.starIndex = 0;
    }
  }

}
