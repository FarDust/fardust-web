import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { GithubService } from './github.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('GithubService', () => {
  let service: GithubService;
  let http: HttpTestingController;

  beforeEach(() => {
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
  });

  const flushGithubUser = (login: string, name = '') => {
    const req = http.expectOne(`https://api.github.com/users/${login}`);
    req.flush({
      login,
      avatar_url: '',
      url: '',
      html_url: '',
      name,
    });
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
});
