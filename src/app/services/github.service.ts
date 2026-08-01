import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  finalize,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface GithubUser {
  login: string;
  avatar_url: string;
  url: string;
  html_url: string;
  name: string;
}

type GithubUserCacheEntry = {
  cachedAt: number;
  user: GithubUser;
};

const GITHUB_CACHE_KEY_PREFIX = 'fardust:github-user:';
export const GITHUB_PROFILE_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

@Injectable({
  providedIn: 'root',
})
export class GithubService extends Observable<GithubUser> {
  private readonly githubUser$ = new BehaviorSubject<string>(
    this.defaultUser(),
  );
  private readonly inflightRequests = new Map<string, Observable<GithubUser>>();
  private readonly inner$: Observable<GithubUser>;

  constructor(private readonly http: HttpClient) {
    super((subscriber) => this.inner$.subscribe(subscriber));

    this.inner$ = this.githubUser$.pipe(
      switchMap((githubUser) => this.resolveUser(githubUser)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  checkUser(githubUser?: string): void {
    this.githubUser$.next(this.normalizeLogin(githubUser));
  }

  private resolveUser(githubUser: string): Observable<GithubUser> {
    const login = this.normalizeLogin(githubUser);
    const cached = this.readCache(login);

    if (cached && !this.isExpired(cached)) {
      return of(cached.user);
    }

    const inflightRequest = this.inflightRequests.get(login);
    if (inflightRequest) {
      return inflightRequest;
    }

    const request$ = this.http
      .get<GithubUser>(`https://api.github.com/users/${login}`)
      .pipe(
        tap((user) => this.writeCache(login, user)),
        catchError((error) =>
          cached ? of(cached.user) : throwError(() => error),
        ),
        finalize(() => this.inflightRequests.delete(login)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.inflightRequests.set(login, request$);
    return request$;
  }

  private defaultUser(): string {
    return this.normalizeLogin(environment.githubUser);
  }

  private normalizeLogin(githubUser?: string): string {
    return githubUser?.trim() || environment.githubUser;
  }

  private isExpired(entry: GithubUserCacheEntry): boolean {
    return Date.now() - entry.cachedAt > GITHUB_PROFILE_CACHE_TTL_MS;
  }

  private readCache(login: string): GithubUserCacheEntry | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const rawEntry = localStorage.getItem(this.cacheKey(login));
      if (!rawEntry) {
        return null;
      }

      const parsedEntry = JSON.parse(rawEntry) as Partial<GithubUserCacheEntry>;
      if (
        typeof parsedEntry.cachedAt !== 'number' ||
        !parsedEntry.user ||
        typeof parsedEntry.user.login !== 'string'
      ) {
        return null;
      }

      return parsedEntry as GithubUserCacheEntry;
    } catch {
      return null;
    }
  }

  private writeCache(login: string, user: GithubUser): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        this.cacheKey(login),
        JSON.stringify({
          cachedAt: Date.now(),
          user,
        } satisfies GithubUserCacheEntry),
      );
    } catch {
      // Ignore storage quota and private-mode failures.
    }
  }

  private cacheKey(login: string): string {
    return `${GITHUB_CACHE_KEY_PREFIX}${login.toLowerCase()}`;
  }
}
