export interface EmbeddingCluster {
  id: string;
  label: string;
  color?: string;
  points: ReadonlyArray<readonly [number, number, number]>;
}

export interface EmbeddingSpaceData {
  clusters: ReadonlyArray<EmbeddingCluster>;
}

export function isEmbeddingSpaceData(
  value: unknown,
): value is EmbeddingSpaceData {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (!Array.isArray(obj['clusters'])) return false;
  return obj['clusters'].every((c: unknown) => {
    if (!c || typeof c !== 'object') return false;
    const cluster = c as Record<string, unknown>;
    return (
      typeof cluster['id'] === 'string' &&
      typeof cluster['label'] === 'string' &&
      Array.isArray(cluster['points']) &&
      cluster['points'].every(
        (p: unknown) =>
          Array.isArray(p) &&
          p.length === 3 &&
          p.every((v: unknown) => typeof v === 'number'),
      )
    );
  });
}
