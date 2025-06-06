import { Component, OnInit } from '@angular/core';
import {
  PersonalInfoService,
  PrivateInfo,
} from '../../services/personal-info.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const TOKEN_COOKIE = 'personal_token';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.sass'],
})
export class PersonalInfoComponent implements OnInit {
  token = '';
  personal$?: Observable<PrivateInfo>;
  error = '';

  constructor(private personalService: PersonalInfoService) {}

  ngOnInit(): void {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + TOKEN_COOKIE + '=([^;]*)'),
    );
    this.token = match ? decodeURIComponent(match[1]) : '';
    if (this.token) {
      this.load();
    }
  }

  tokenChanged(): void {
    if (!this.token) {
      document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      this.personal$ = undefined;
      return;
    }
    this.load();
  }

  load(): void {
    this.error = '';
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(this.token)}; path=/`;
    this.personal$ = this.personalService.getPersonalInfo(this.token).pipe(
      catchError(() => {
        this.error = 'Could not load personal info';
        return of({ privateBio: '' });
      }),
    );
  }
}
