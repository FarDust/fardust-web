import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  GITHUB_PROFILE_CACHE_TTL_MS,
  GithubService,
  GithubUser,
} from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let http: HttpTestingController;
  let dateNowSpy: jasmine.Spy<() => number>;

  beforeEach(() => {
    localStorage.clear();
    dateNowSpy = spyOn(Date, 'now').and.returnValue(1_000);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(GithubService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  const flushGithubUser = (login: string, name = ''): GithubUser => {
    const req = http.expectOne(`https://api.github.com/users/${login}`);
    const payload = {
      login,
      avatar_url: `https://avatars.example/${login}.png`,
      url: '',
      html_url: `https://github.com/${login}`,
      name,
    };
    req.flush(payload);
    return payload;
  };

  it('should be created and load default user', (done) => {
    service.subscribe((user) => {
      expect(user.login).toBe('FarDust');
      done();
    });
    flushGithubUser('FarDust');
  });

  it('should fetch given user', (done) => {
    service.subscribe((user) => {
      if (user.login === 'foo') {
        expect(user.name).toBe('Foo Bar');
        done();
      }
    });
    flushGithubUser('FarDust');
    service.checkUser('foo');
    flushGithubUser('foo', 'Foo Bar');
  });

  it('reuses a fresh cached response instead of refetching the same user', () => {
    const users: GithubUser[] = [];
    service.subscribe((user) => users.push(user));

    const initialUser = flushGithubUser('FarDust', 'Gabriel Faundez');
    expect(users.at(-1)).toEqual(initialUser);

    service.checkUser('FarDust');

    http.expectNone('https://api.github.com/users/FarDust');
    expect(users.at(-1)).toEqual(initialUser);
  });

  it('refreshes the user after the cache TTL expires', () => {
    const users: GithubUser[] = [];
    service.subscribe((user) => users.push(user));

    flushGithubUser('FarDust', 'Cached User');
    dateNowSpy.and.returnValue(1_000 + GITHUB_PROFILE_CACHE_TTL_MS + 1);

    service.checkUser('FarDust');

    const refreshedUser = flushGithubUser('FarDust', 'Fresh User');
    expect(users.at(-1)).toEqual(refreshedUser);
  });

  it('falls back to the stale cache when GitHub rejects the refresh', () => {
    const users: GithubUser[] = [];
    service.subscribe((user) => users.push(user));

    const cachedUser = flushGithubUser('FarDust', 'Cached User');
    dateNowSpy.and.returnValue(1_000 + GITHUB_PROFILE_CACHE_TTL_MS + 1);

    service.checkUser('FarDust');

    const req = http.expectOne('https://api.github.com/users/FarDust');
    req.flush('rate limited', {
      status: 403,
      statusText: 'Forbidden',
    });

    expect(users.at(-1)).toEqual(cachedUser);
  });
});
