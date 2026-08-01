import * as THREE from 'three';
import { EmbeddingSpaceSceneController } from './embedding-space-scene.controller';
import { EmbeddingSpaceData } from './cluster.types';

const MOCK_DATA: EmbeddingSpaceData = {
  clusters: [
    {
      id: 'test-a',
      label: 'Cluster A',
      color: '#81ecff',
      points: [
        [0, 0, 0],
        [1, 1, 1],
      ],
    },
    {
      id: 'test-b',
      label: 'Cluster B',
      color: '#ff7c4b',
      points: [[3, 3, 3]],
    },
  ],
};

describe('EmbeddingSpaceSceneController', () => {
  it('replaces the projected labels when new cluster data arrives', () => {
    const controller = new EmbeddingSpaceSceneController();
    const sceneGroup = {
      add: jasmine.createSpy('add'),
      remove: jasmine.createSpy('remove'),
      matrixWorld: new THREE.Matrix4(),
    };

    (controller as any).sceneGroup = sceneGroup;

    controller.renderClusters(MOCK_DATA);

    expect(controller.clusterLabels.length).toBe(2);
    expect(sceneGroup.add).toHaveBeenCalledTimes(2);

    controller.renderClusters({
      clusters: [
        {
          id: 'fresh',
          label: 'Fresh cluster',
          points: [[1, 2, 3]],
        },
      ],
    });

    expect(controller.clusterLabels.length).toBe(1);
    expect(controller.clusterLabels[0].text).toBe('Fresh cluster');
    expect(sceneGroup.remove).toHaveBeenCalled();
  });

  it('ignores resize requests when the canvas is not measurable', () => {
    const controller = new EmbeddingSpaceSceneController();
    const updateProjectionMatrix = jasmine.createSpy('updateProjectionMatrix');
    const rendererSetSize = jasmine.createSpy('rendererSetSize');
    const composerSetSize = jasmine.createSpy('composerSetSize');

    (controller as any).camera = {
      aspect: 2,
      updateProjectionMatrix,
    };
    (controller as any).renderer = {
      setSize: rendererSetSize,
    };
    (controller as any).composer = {
      setSize: composerSetSize,
    };

    controller.resize({
      clientWidth: 0,
      clientHeight: 0,
    } as HTMLCanvasElement);

    expect((controller as any).camera.aspect).toBe(2);
    expect(updateProjectionMatrix).not.toHaveBeenCalled();
    expect(rendererSetSize).not.toHaveBeenCalled();
    expect(composerSetSize).not.toHaveBeenCalled();
  });
});
