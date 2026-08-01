import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { EmbeddingSpaceData, isEmbeddingSpaceData } from './cluster.types';

@Injectable({
  providedIn: 'root',
})
export class EmbeddingSpaceDataService {
  private readonly http = inject(HttpClient);

  readonly invalidResponseMessage =
    'Invalid response shape. Expected { clusters: [{ id, label, points: [x,y,z][] }] }.';
  readonly requestFailedMessage =
    'Request failed. Check the URL and CORS headers.';

  loadSeedData(): Observable<EmbeddingSpaceData> {
    return this.http
      .get<EmbeddingSpaceData>('assets/data/notification-clusters.json')
      .pipe(catchError(() => of({ clusters: [] })));
  }

  loadFromApi(url: string): Observable<EmbeddingSpaceData> {
    return this.http.get<unknown>(url).pipe(
      map((value) => {
        if (!isEmbeddingSpaceData(value)) {
          throw new Error(this.invalidResponseMessage);
        }

        return value;
      }),
    );
  }

  toErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message
    ) {
      return error.message;
    }

    return this.requestFailedMessage;
  }
}
