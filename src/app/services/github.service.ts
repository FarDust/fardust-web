import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export interface GithubUser {
  login: string,
  avatar_url: string,
  url: string,
  html_url: string,
  name: string,
}

@Injectable({
  providedIn: 'any'
})
export class GithubService extends Observable<GithubUser> {

  private githubUser$ = new BehaviorSubject<string>('');
  private inner$: Observable<GithubUser>;

  constructor(http: HttpClient) { 
    super(subscriber => this.inner$.subscribe(subscriber));
    this.inner$ = this.githubUser$.pipe(
      switchMap(githubUser => http.get<any>(`https://api.github.com/users/${githubUser}`)),
      shareReplay(1)
    );
    this.checkUser();
  }

  public checkUser(githubUser?: string) {
    this.githubUser$.next(githubUser || environment.githubUser);
  }
  
}
