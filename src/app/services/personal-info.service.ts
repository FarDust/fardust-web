import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PrivateInfo {
  privateBio: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  constructor(private http: HttpClient) {}

  isConfigured(): boolean {
    return this.resolveUrl() !== null;
  }

  getPersonalInfo(token: string): Observable<PrivateInfo> {
    const resolvedUrl = this.resolveUrl();
    if (!resolvedUrl) {
      return throwError(() => new Error('Personal info URL is not configured'));
    }

    return this.http.get<PrivateInfo>(resolvedUrl, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  private resolveUrl(): string | null {
    const rawUrl = environment.personalInfoUrl?.trim();
    if (!rawUrl) {
      return null;
    }

    try {
      return new URL(rawUrl, window.location.origin).toString();
    } catch {
      return null;
    }
  }
}
