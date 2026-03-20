import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PersonalInfoService, PrivateInfo } from './personal-info.service';
import { environment } from '../../environments/environment';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('PersonalInfoService', () => {
  let service: PersonalInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PersonalInfoService);
    httpMock = TestBed.inject(HttpTestingController);
    (environment as any).personalInfoUrl = '/info';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch private info', () => {
    const mock: PrivateInfo = { privateBio: 'secret' };
    service.getPersonalInfo('tok').subscribe((data) => {
      expect(data).toEqual(mock);
    });
    const req = httpMock.expectOne('/info?token=tok');
    expect(req.request.params.get('token')).toBe('tok');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush(mock);
    httpMock.verify();
  });
});
