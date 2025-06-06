import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { GithubService } from '../services/github.service';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

beforeEach(async () => {
  const navigateSpy = jasmine.createSpy('navigate');
  await TestBed.configureTestingModule({
    declarations: [ FooterComponent ],
    imports: [HttpClientTestingModule],
    providers: [
      { provide: Router, useValue: { navigate: navigateSpy } },
      { provide: GithubService, useValue: { subscribe: () => ({unsubscribe(){}}) } }
    ]
  })
  .compileComponents();

  fixture = TestBed.createComponent(FooterComponent);
  component = fixture.componentInstance as FooterComponent & { navigateSpy: jasmine.Spy };
  (component as any).navigateSpy = navigateSpy;
  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to experience on curriculum click', () => {
    component.goToCurriculum();
    const spy = (component as any).navigateSpy as jasmine.Spy;
    expect(spy).toHaveBeenCalledWith(['/experience']);
  });
});
