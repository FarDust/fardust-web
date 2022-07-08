import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, shareReplay, catchError } from 'rxjs/operators';

// https://medium.com/wizdm-genesys/angular-where-am-i-from-93f9cfb0857b
// https://stackoverflow.com/questions/3489460/how-to-get-visitors-location-i-e-country-using-geolocation
// https://ipinfo.io
// https://angular.io/guide/observables


export interface CountryResult {
  ip: string,
  country: string,
}

// From: https://github.com/lasfrancisco/cover/blob/master/apps/cover/src/app/core/iplist/iplist.service.ts
@Injectable({
  providedIn: 'root'
})
export class CountryService extends Observable<CountryResult> {

  // The internal ip$ subject to specify dirfferent ip to inspect
  private ip$ = new BehaviorSubject<string>('');
  // The inner observable making sure all subscriptions replays
  private inner$: Observable<CountryResult>;

  constructor(http: HttpClient) {
    // Simply subscribes to the inner observable
    super(subscriber => this.inner$.subscribe(subscriber));
    // Builds the inner observable to get the ip info from iplist.cc and keeping replaying the last one to all the subscribers
    this.inner$ = this.ip$.pipe(
      // Queries the iplist API with the give ip
      switchMap(ip => http.get<any>("https://ipinfo.io/"+ ip +"?token=9351e0f5fa9e8c" ).pipe(
          catchError(this.handleError)
      )),
      // Replays the last value to all the subscribers
      shareReplay(1)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 0) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a default value
    return of({ ip: '', country: '??' });
  }

  /** Checks the give IP. When null the caller IP will be inspected. */
  public checkIP(ip?: string) {
    this.ip$.next(ip || '');
  }
}
