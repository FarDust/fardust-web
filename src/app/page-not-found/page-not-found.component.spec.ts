import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { PretextTextComponent } from '../pretext/pretext-text.component';

import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      imports: [TranslateModule.forRoot(), RouterModule, PretextTextComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the recovery action', () => {
    const action = fixture.nativeElement.querySelector(
      '.page-not-found__action',
    );
    expect(action).not.toBeNull();
  });

  it('should render two recovery links', () => {
    const actions = fixture.nativeElement.querySelectorAll(
      '.page-not-found__action',
    );
    expect(actions.length).toBe(2);
  });
});
