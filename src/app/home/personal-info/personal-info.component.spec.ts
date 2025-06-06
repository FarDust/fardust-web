import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PersonalInfoComponent } from './personal-info.component';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [PersonalInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    document.cookie =
      'personal_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load token from cookie and call load', () => {
    document.cookie = 'personal_token=cookieTok';
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    spyOn(component, 'load');
    fixture.detectChanges();
    expect(component.token).toBe('cookieTok');
    expect(component.load).toHaveBeenCalled();
  });

  it('should store token in cookie when changed', () => {
    component.token = 'saveTok';
    component.tokenChanged();
    expect(document.cookie).toContain('personal_token=saveTok');
  });
});
