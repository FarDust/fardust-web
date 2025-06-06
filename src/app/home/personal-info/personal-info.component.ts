import { Component, OnInit } from '@angular/core';
import { PersonalInfoService, PrivateInfo } from '../../services/personal-info.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const TOKEN_COOKIE = 'personal_token';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.sass']
})

export class PersonalInfoComponent implements OnInit {
  token = '';
  personal$?: Observable<PrivateInfo>;
  error = '';
  readonly publicBio =
    'Soy una persona curiosa y enérgica. Reparto mi tiempo entre trabajar, entrenar y disfrutar de los videojuegos. ' +
    'Viajar solo me permite observar cómo funcionan las cosas en distintos lugares, siempre acompañado de mi gato y buenos amigos.';

  constructor(private personalService: PersonalInfoService) {}

  ngOnInit(): void {
    const match = document.cookie.match(new RegExp('(?:^|; )' + TOKEN_COOKIE + '=([^;]*)'));
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
      })
    );
  }
}
