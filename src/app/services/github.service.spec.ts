import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GithubService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created and load default user', done => {
    service.subscribe(user => {
      expect(user.login).toBe('FarDust');
      done();
    });
    const req = http.expectOne('https://api.github.com/users/FarDust');
    req.flush({ login: 'FarDust', avatar_url: '', url: '', html_url: '', name: '' });
  });

  it('should fetch given user', done => {
    service.subscribe(user => {
      if (user.login === 'foo') {
        expect(user.name).toBe('Foo Bar');
        done();
      }
    });
    service.checkUser('foo');
    const req = http.expectOne('https://api.github.com/users/foo');
    req.flush({ login: 'foo', avatar_url: '', url: '', html_url: '', name: 'Foo Bar' });
  });
});
