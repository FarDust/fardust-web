import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CountryService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch country info', done => {
    service.subscribe(value => {
      expect(value).toEqual({ ip: '1.1.1.1', country: 'US' });
      done();
    });
    service.checkIP('1.1.1.1');
    const req = http.expectOne('https://ipinfo.io/1.1.1.1?token=9351e0f5fa9e8c');
    req.flush({ ip: '1.1.1.1', country: 'US' });
  });

  it('should return default on error', done => {
    service.subscribe(value => {
      expect(value).toEqual({ ip: '', country: '??' });
      done();
    });
    service.checkIP('2.2.2.2');
    const req = http.expectOne('https://ipinfo.io/2.2.2.2?token=9351e0f5fa9e8c');
    req.flush('err', { status: 500, statusText: 'Server Error' });
  });
});
