import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { PersonalInfoComponent } from './personal-info.component';
import { PersonalInfoService } from '../../services/personal-info.service';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  let personalInfoService: jasmine.SpyObj<PersonalInfoService>;

  const clearTokenCookie = () => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `personal_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${secure}`;
  };

  beforeEach(async () => {
    personalInfoService = jasmine.createSpyObj<PersonalInfoService>(
      'PersonalInfoService',
      ['getPersonalInfo', 'isConfigured'],
    );
    personalInfoService.isConfigured.and.returnValue(true);
    personalInfoService.getPersonalInfo.and.returnValue(
      of({ privateBio: 'secret' }),
    );

    await TestBed.configureTestingModule({
      declarations: [PersonalInfoComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: PersonalInfoService, useValue: personalInfoService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    clearTokenCookie();
  });

  afterEach(() => {
    clearTokenCookie();
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should load the token from the cookie when the feature is configured', () => {
    clearTokenCookie();
    document.cookie = 'personal_token=cookieTok; path=/';

    createComponent();

    expect(component.token).toBe('cookieTok');
    expect(personalInfoService.getPersonalInfo).toHaveBeenCalledWith(
      'cookieTok',
    );
  });

  it('should not load the token when the feature is disabled', () => {
    personalInfoService.isConfigured.and.returnValue(false);
    clearTokenCookie();
    document.cookie = 'personal_token=cookieTok; path=/';

    createComponent();

    expect(component.token).toBe('');
    expect(personalInfoService.getPersonalInfo).not.toHaveBeenCalled();
  });

  it('should store the token in a cookie and request private info on submit', () => {
    createComponent();
    component.token = 'saveTok';

    component.submitToken();

    expect(document.cookie).toContain('personal_token=saveTok');
    expect(personalInfoService.getPersonalInfo).toHaveBeenCalledWith('saveTok');
  });

  it('should clear the stored token and loaded state', () => {
    createComponent();
    component.token = 'saveTok';
    component.personal$ = of({ privateBio: 'secret' });
    component.errorKey = 'personal_info_load_failed';

    component.clearToken();

    expect(component.token).toBe('');
    expect(component.errorKey).toBe('');
    expect(component.personal$).toBeUndefined();
    expect(document.cookie).not.toContain('personal_token=');
  });

  it('should expose a translated error key when the request fails', () => {
    personalInfoService.getPersonalInfo.and.returnValue(
      throwError(() => new Error('boom')),
    );
    createComponent();

    component.token = 'broken';
    component.load();
    component.personal$?.subscribe();

    expect(component.errorKey).toBe('personal_info_load_failed');
  });
});
