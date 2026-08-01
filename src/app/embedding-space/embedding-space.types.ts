export type EmbeddingSpaceApiStatus = 'idle' | 'loading' | 'live' | 'error';

export interface EmbeddingClusterLabel {
  text: string;
  color: string;
  x: number;
  y: number;
  visible: boolean;
}
