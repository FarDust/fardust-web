import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter, RouterModule } from '@angular/router';
import { EmbeddingSpaceApiPanelComponent } from './embedding-space-api-panel.component';
import { EmbeddingSpaceComponent } from './embedding-space.component';
import { EmbeddingSpaceDataService } from './embedding-space-data.service';
import { EmbeddingSpaceFallbackComponent } from './embedding-space-fallback.component';
import { EmbeddingSpaceHudComponent } from './embedding-space-hud.component';
import { EmbeddingSpaceSceneController } from './embedding-space-scene.controller';
import { PretextTextComponent } from '../pretext/pretext-text.component';
import { EmbeddingSpaceData, isEmbeddingSpaceData } from './cluster.types';

const MOCK_DATA: EmbeddingSpaceData = {
  clusters: [
    {
      id: 'test-a',
      label: 'Cluster A',
      color: '#81ecff',
      points: [
        [0, 0, 0],
        [1, 1, 1],
        [0.5, 0.5, 0.5],
      ],
    },
    {
      id: 'test-b',
      label: 'Cluster B',
      color: '#ff7c4b',
      points: [
        [3, 3, 3],
        [4, 4, 4],
      ],
    },
  ],
};

function primeCanvasRef(component: EmbeddingSpaceComponent): void {
  component.canvasRef = {
    nativeElement: document.createElement('canvas'),
  } as any;
}

function syncSceneLabels(
  sceneController: EmbeddingSpaceSceneController,
  data: EmbeddingSpaceData,
): void {
  sceneController.clusterLabels.length = 0;
  data.clusters.forEach((cluster, index) => {
    sceneController.clusterLabels.push({
      text: cluster.label,
      color: cluster.color ?? '#81ecff',
      visible: true,
      x: index * 12,
      y: index * 16,
    });
  });
}

describe('EmbeddingSpaceComponent', () => {
  let component: EmbeddingSpaceComponent;
  let fixture: ComponentFixture<EmbeddingSpaceComponent>;
  let httpTesting: HttpTestingController;
  let sceneController: EmbeddingSpaceSceneController;

  function setupSceneSpies(options?: { initializeError?: string }): void {
    sceneController = fixture.debugElement.injector.get(
      EmbeddingSpaceSceneController,
    );
    spyOn(sceneController, 'initialize').and.callFake(() => {
      if (options?.initializeError) {
        throw new Error(options.initializeError);
      }
    });
    spyOn(sceneController, 'renderClusters').and.callFake((data) => {
      syncSceneLabels(sceneController, data);
    });
    spyOn(sceneController, 'resize').and.stub();
    spyOn(sceneController, 'destroy').and.callFake(() => {
      sceneController.clusterLabels.length = 0;
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EmbeddingSpaceApiPanelComponent,
        EmbeddingSpaceComponent,
        EmbeddingSpaceFallbackComponent,
        EmbeddingSpaceHudComponent,
      ],
      imports: [
        RouterModule,
        FormsModule,
        TranslateModule.forRoot(),
        PretextTextComponent,
      ],
      providers: [
        EmbeddingSpaceDataService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create when the scene initializes successfully', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();

    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    expect(component).toBeTruthy();
    expect(component.renderError).toBeFalse();
    expect(sceneController.initialize).toHaveBeenCalled();
    expect(sceneController.renderClusters).toHaveBeenCalledWith(MOCK_DATA);
  });

  it('should show the fallback UI when WebGL initialization fails', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies({ initializeError: 'WebGL unavailable' });

    fixture.detectChanges();

    expect(component.renderError).toBeTrue();
    expect(
      fixture.nativeElement.querySelector('.embedding-fallback'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.embedding-container--fallback'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('.embedding-fallback__fact')
        .length,
    ).toBe(3);
    expect(
      fixture.nativeElement.querySelectorAll('.embedding-fallback-aside__link')
        .length,
    ).toBe(2);
  });

  it('should populate cluster labels from the loaded seed data', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();

    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    expect(component.clusterLabels.length).toBe(2);
    expect(component.clusterLabels[0].text).toBe('Cluster A');
    expect(component.clusterLabels[0].color).toBe('#81ecff');
    expect(component.clusterLabels[1].text).toBe('Cluster B');
    expect(component.clusterLabels[1].color).toBe('#ff7c4b');
  });

  it('should render fallback seed data when the local JSON request fails', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();

    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .error(new ProgressEvent('error'));

    expect(sceneController.renderClusters).toHaveBeenCalledWith({
      clusters: [],
    });
    expect(component.clusterLabels.length).toBe(0);
  });

  it('should load from an external API and update status to live', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    component.loadFromApi('https://example.com/embeddings');
    expect(component.apiStatus).toBe('loading');

    httpTesting.expectOne('https://example.com/embeddings').flush(MOCK_DATA);

    expect(component.apiStatus).toBe('live');
    expect(component.clusterLabels.length).toBe(2);
    expect(sceneController.renderClusters).toHaveBeenCalledWith(MOCK_DATA);
  });

  it('should set error status when the API request fails', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    component.loadFromApi('https://example.com/bad');
    httpTesting
      .expectOne('https://example.com/bad')
      .error(new ProgressEvent('error'));

    expect(component.apiStatus).toBe('error');
    expect(component.apiError).toBeTruthy();
  });

  it('should reject malformed API responses with a validation error', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    component.loadFromApi('https://example.com/bad-shape');
    httpTesting
      .expectOne('https://example.com/bad-shape')
      .flush({ notClusters: true });

    expect(component.apiStatus).toBe('error');
    expect(component.apiError).toContain('Invalid response shape');
  });

  it('should close the try-it panel on Escape key', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();
    component.tryItOpen = true;

    component.onEscape();

    expect(component.tryItOpen).toBeFalse();
  });

  it('should not error on Escape when panel is already closed', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();
    component.tryItOpen = false;

    component.onEscape();

    expect(component.tryItOpen).toBeFalse();
  });

  it('should delegate resize handling to the scene controller', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    component.onWindowResize();

    expect(sceneController.resize).toHaveBeenCalledWith(
      component.canvasRef.nativeElement,
    );
  });

  it('should render fallback route links to /pretext and /experience', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies({ initializeError: 'WebGL unavailable' });

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll(
      '.embedding-fallback-aside__link',
    );
    const hrefs = Array.from(links).map(
      (element: Element) =>
        element.getAttribute('href') ||
        element.getAttribute('ng-reflect-router-link'),
    );

    expect(hrefs).toContain('/pretext');
    expect(hrefs).toContain('/experience');
  });

  it('should render three HUD legend items when the scene initializes', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    const items = fixture.nativeElement.querySelectorAll(
      '.embedding-hud__legend-item',
    );
    expect(items.length).toBe(3);
  });

  it('should show the API panel label when tryItOpen is true', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();
    component.tryItOpen = true;

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    expect(
      fixture.nativeElement.querySelector('.embedding-api-panel__label'),
    ).not.toBeNull();
  });

  it('should apply the live class to the status dot when apiStatus is live', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    component.loadFromApi('https://example.com/live');
    httpTesting.expectOne('https://example.com/live').flush(MOCK_DATA);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.embedding-hud__status-dot.live'),
    ).not.toBeNull();
  });

  it('should destroy the scene controller on teardown', () => {
    fixture = TestBed.createComponent(EmbeddingSpaceComponent);
    component = fixture.componentInstance;
    primeCanvasRef(component);
    setupSceneSpies();

    fixture.detectChanges();
    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .flush(MOCK_DATA);

    fixture.destroy();

    expect(sceneController.destroy).toHaveBeenCalled();
  });
});

describe('isEmbeddingSpaceData', () => {
  it('should accept valid data', () => {
    expect(
      isEmbeddingSpaceData({
        clusters: [{ id: 'a', label: 'A', color: '#fff', points: [[1, 2, 3]] }],
      }),
    ).toBeTrue();
  });

  it('should accept data with empty clusters', () => {
    expect(isEmbeddingSpaceData({ clusters: [] })).toBeTrue();
  });

  it('should reject null', () => {
    expect(isEmbeddingSpaceData(null)).toBeFalse();
  });

  it('should reject missing clusters key', () => {
    expect(isEmbeddingSpaceData({ data: [] })).toBeFalse();
  });

  it('should reject points with wrong dimensions', () => {
    expect(
      isEmbeddingSpaceData({
        clusters: [{ id: 'a', label: 'A', points: [[1, 2]] }],
      }),
    ).toBeFalse();
  });

  it('should reject clusters missing required fields', () => {
    expect(
      isEmbeddingSpaceData({
        clusters: [{ points: [[1, 2, 3]] }],
      }),
    ).toBeFalse();
  });
});
