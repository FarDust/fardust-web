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
  let originalPersonalInfoUrl: string;

  beforeEach(() => {
    originalPersonalInfoUrl = environment.personalInfoUrl;
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

  afterEach(() => {
    (environment as any).personalInfoUrl = originalPersonalInfoUrl;
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report when the feature is configured', () => {
    expect(service.isConfigured()).toBeTrue();
  });

  it('should fetch private info', () => {
    const mock: PrivateInfo = { privateBio: 'secret' };
    service.getPersonalInfo('tok').subscribe((data) => {
      expect(data).toEqual(mock);
    });
    const req = httpMock.expectOne(
      new URL('/info', window.location.origin).toString(),
    );
    expect(req.request.params.has('token')).toBeFalse();
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    req.flush(mock);
  });

  it('should reject requests when the URL is not configured', () => {
    (environment as any).personalInfoUrl = '';

    service.getPersonalInfo('tok').subscribe({
      next: () =>
        fail('Expected getPersonalInfo to error when no URL is configured'),
      error: (error: Error) => {
        expect(error.message).toContain('not configured');
      },
    });

    httpMock.expectNone(() => true);
  });

  it('should report when the feature is disabled', () => {
    (environment as any).personalInfoUrl = '';

    expect(service.isConfigured()).toBeFalse();
  });
});
