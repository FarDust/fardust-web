import { Component, Input, OnInit } from '@angular/core';
import { faUniversity, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { CountryService } from '../../services/country.service';



@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.sass']
})
export class ConsoleComponent implements OnInit {

  faUniversity: IconDefinition = faUniversity;
  defaultCountry: string = "CL";
  @Input()
  header: string = "Console";
  @Input()
  degree: string = "";
  @Input()
  major: string = "";
  @Input()
  minor: string = "";

  constructor(readonly countryservice$: CountryService) {
  }

  ngOnInit(): void {
    this.countryservice$.checkIP('')
  }

}
