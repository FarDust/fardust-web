import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PrivateInfo {
  privateBio: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {
  constructor(private http: HttpClient) {}

  getPersonalInfo(token: string): Observable<PrivateInfo> {
    const params = new HttpParams().set('token', token);
    return this.http.get<PrivateInfo>(environment.personalInfoUrl, { params });
  }
}
