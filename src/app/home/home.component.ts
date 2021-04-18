import { Component, OnInit } from '@angular/core';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  
  faUniversity = faUniversity;

  constructor() { }

  ngOnInit() {
  }

}
