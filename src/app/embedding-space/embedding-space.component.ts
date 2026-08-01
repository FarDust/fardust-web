import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { EmbeddingSpaceDataService } from './embedding-space-data.service';
import { EmbeddingSpaceSceneController } from './embedding-space-scene.controller';
import {
  EmbeddingClusterLabel,
  EmbeddingSpaceApiStatus,
} from './embedding-space.types';

@Component({
  selector: 'app-embedding-space',
  templateUrl: './embedding-space.component.html',
  styleUrls: ['./embedding-space.component.sass'],
  standalone: false,
  providers: [EmbeddingSpaceSceneController],
})
export class EmbeddingSpaceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dataService = inject(EmbeddingSpaceDataService);
  private readonly sceneController = inject(EmbeddingSpaceSceneController);

  renderError = false;
  tryItOpen = false;
  apiUrl = '';
  apiStatus: EmbeddingSpaceApiStatus = 'idle';
  apiError = '';
  readonly clusterLabels: EmbeddingClusterLabel[] =
    this.sceneController.clusterLabels;
  sampleExpanded = false;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.tryItOpen) {
      this.tryItOpen = false;
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    if (!this.canvasRef?.nativeElement) {
      this.renderError = true;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.sceneController.initialize(this.canvasRef.nativeElement, () => {
        this.cdr.detectChanges();
      });
      this.dataService.loadSeedData().subscribe((data) => {
        this.sceneController.renderClusters(data);
        this.cdr.detectChanges();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/webgl/i.test(message)) {
        console.error(
          'Failed to initialize EmbeddingSpaceComponent 3D scene:',
          error,
        );
      }
      this.renderError = true;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.sceneController.destroy();
  }

  loadFromApi(url: string): void {
    this.apiStatus = 'loading';
    this.apiError = '';
    this.dataService.loadFromApi(url).subscribe({
      next: (data) => {
        this.sceneController.renderClusters(data);
        this.apiStatus = 'live';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.apiStatus = 'error';
        this.apiError = this.dataService.toErrorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  toggleTryIt(): void {
    this.tryItOpen = !this.tryItOpen;
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  setSampleExpanded(expanded: boolean): void {
    this.sampleExpanded = expanded;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.renderError || !this.canvasRef?.nativeElement) {
      return;
    }

    this.sceneController.resize(this.canvasRef.nativeElement);
  }
}
