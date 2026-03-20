import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter, RouterModule } from '@angular/router';
import { BallComponent } from './ball.component';

describe('BallComponent', () => {
  let component: BallComponent;
  let fixture: ComponentFixture<BallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BallComponent],
      imports: [RouterModule, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create when the scene initializes successfully', () => {
    fixture = TestBed.createComponent(BallComponent);
    component = fixture.componentInstance;
    spyOn<any>(component, 'initScene').and.stub();
    spyOn<any>(component, 'animate').and.stub();

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.renderError).toBeFalse();
  });

  it('should show the fallback UI when WebGL initialization fails', () => {
    fixture = TestBed.createComponent(BallComponent);
    component = fixture.componentInstance;
    spyOn<any>(component, 'initScene').and.throwError('WebGL unavailable');
    spyOn<any>(component, 'animate').and.stub();

    fixture.detectChanges();

    expect(component.renderError).toBeTrue();
    expect(
      fixture.nativeElement.querySelector('.ball-fallback'),
    ).not.toBeNull();
  });
});
