import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CountryService } from './country.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('CountryService', () => {
  let service: CountryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CountryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  const expectCountryRequest = (ip: string) =>
    http.expectOne((request) => {
      const url = new URL(request.urlWithParams);
      const normalizedPath = url.pathname.replace(/^\/|\/$/g, '');

      return (
        url.origin === 'https://ipinfo.io' &&
        normalizedPath === ip &&
        url.searchParams.has('token')
      );
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch country info', (done) => {
    service.subscribe((value) => {
      if (value.ip === '1.1.1.1') {
        expect(value).toEqual({ ip: '1.1.1.1', country: 'US' });
        done();
      }
    });
    expectCountryRequest('').flush({ ip: '', country: '??' });
    service.checkIP('1.1.1.1');
    expectCountryRequest('1.1.1.1').flush({ ip: '1.1.1.1', country: 'US' });
  });

  it('should return default on error', (done) => {
    let emissionCount = 0;

    service.subscribe((value) => {
      emissionCount += 1;
      if (emissionCount === 2) {
        expect(value).toEqual({ ip: '', country: '??' });
        done();
      }
    });
    expectCountryRequest('').flush({ ip: '', country: '??' });
    service.checkIP('2.2.2.2');
    expectCountryRequest('2.2.2.2').flush('err', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
