import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  PersonalInfoService,
  PrivateInfo,
} from '../../services/personal-info.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const TOKEN_COOKIE = 'personal_token';

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.sass'],
})
export class PersonalInfoComponent implements OnInit {
  token = '';
  personal$?: Observable<PrivateInfo>;
  errorKey = '';
  readonly personalInfoEnabled: boolean;

  constructor(private personalService: PersonalInfoService) {
    this.personalInfoEnabled = this.personalService.isConfigured();
  }

  ngOnInit(): void {
    if (!this.personalInfoEnabled) {
      return;
    }

    this.token = this.readTokenFromCookie();
    if (this.token) {
      this.load();
    }
  }

  submitToken(): void {
    if (!this.personalInfoEnabled) {
      return;
    }

    this.token = this.token.trim();
    if (!this.token) {
      this.clearToken();
      return;
    }

    this.persistToken(this.token);
    this.load();
  }

  clearToken(): void {
    this.token = '';
    this.errorKey = '';
    this.personal$ = undefined;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${secure}`;
  }

  load(): void {
    this.errorKey = '';
    this.personal$ = this.personalService.getPersonalInfo(this.token).pipe(
      catchError(() => {
        this.errorKey = 'personal_info_load_failed';
        return EMPTY;
      }),
    );
  }

  private readTokenFromCookie(): string {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + TOKEN_COOKIE + '=([^;]*)'),
    );
    return match ? decodeURIComponent(match[1]) : '';
  }

  private persistToken(token: string): void {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Strict${secure}`;
  }
}
