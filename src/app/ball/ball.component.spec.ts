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

  it('should ignore resize events while the canvas has no measurable size', () => {
    fixture = TestBed.createComponent(BallComponent);
    component = fixture.componentInstance;

    const updateProjectionMatrix = jasmine.createSpy('updateProjectionMatrix');
    const setSize = jasmine.createSpy('setSize');
    const dispose = jasmine.createSpy('dispose');

    (component as any).camera = {
      aspect: 2,
      updateProjectionMatrix,
    };
    (component as any).renderer = { setSize, dispose };
    component.canvasRef = {
      nativeElement: {
        clientWidth: 0,
        clientHeight: 0,
        width: 0,
        height: 0,
      },
    } as any;

    (component as any).onWindowResize();

    expect((component as any).camera.aspect).toBe(2);
    expect(updateProjectionMatrix).not.toHaveBeenCalled();
    expect(setSize).not.toHaveBeenCalled();
  });
});
