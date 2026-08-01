import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EmbeddingSpaceDataService } from './embedding-space-data.service';

describe('EmbeddingSpaceDataService', () => {
  let service: EmbeddingSpaceDataService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmbeddingSpaceDataService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(EmbeddingSpaceDataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('falls back to an empty cluster set when the seed file fails', () => {
    let result: unknown;

    service.loadSeedData().subscribe((data) => {
      result = data;
    });

    httpTesting
      .expectOne('assets/data/notification-clusters.json')
      .error(new ProgressEvent('error'));

    expect(result).toEqual({ clusters: [] });
  });

  it('rejects malformed API responses with the validation message', () => {
    let capturedError: unknown;

    service.loadFromApi('https://example.com/embeddings').subscribe({
      error: (error) => {
        capturedError = error;
      },
    });

    httpTesting
      .expectOne('https://example.com/embeddings')
      .flush({ notClusters: true });

    expect(capturedError).toEqual(jasmine.any(Error));
    expect((capturedError as Error).message).toContain(
      'Invalid response shape',
    );
  });
});
