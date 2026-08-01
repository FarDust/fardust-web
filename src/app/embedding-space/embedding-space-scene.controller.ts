import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EmbeddingCluster, EmbeddingSpaceData } from './cluster.types';
import { EmbeddingClusterLabel } from './embedding-space.types';

type SceneClusterLabel = EmbeddingClusterLabel & {
  centroid: THREE.Vector3;
};

@Injectable()
export class EmbeddingSpaceSceneController {
  readonly clusterLabels: EmbeddingClusterLabel[] = [];

  private readonly sceneLabels: SceneClusterLabel[] = [];
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private composer?: EffectComposer;
  private controls?: OrbitControls;
  private sceneGroup?: THREE.Group;
  private clusterObjects: THREE.Points[] = [];
  private starfield?: THREE.Points;
  private animationId?: number;
  private onLabelsChanged?: () => void;

  initialize(canvas: HTMLCanvasElement, onLabelsChanged: () => void): void {
    const width = canvas.clientWidth || canvas.width || 1;
    const height = canvas.clientHeight || canvas.height || 1;

    this.onLabelsChanged = onLabelsChanged;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d0e13);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(width, height), 0.8, 0.6, 0.4),
    );

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.enableZoom = true;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.autoRotate = !window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.controls.autoRotateSpeed = 0.6;

    this.sceneGroup = new THREE.Group();
    this.scene.add(this.sceneGroup);
    this.buildStarfield();
  }

  renderClusters(data: EmbeddingSpaceData): void {
    this.disposeClusters();

    if (!this.sceneGroup) {
      return;
    }

    data.clusters.forEach((cluster, index) => {
      const points = this.buildClusterPoints(cluster);
      const material = points.material as THREE.PointsMaterial;
      material.transparent = true;
      material.opacity = 0;

      this.clusterObjects.push(points);
      this.sceneGroup!.add(points);

      const label: SceneClusterLabel = {
        text: cluster.label,
        centroid: this.computeCentroid(cluster),
        color: cluster.color ?? '#81ecff',
        x: 0,
        y: 0,
        visible: false,
      };

      this.sceneLabels.push(label);
      this.clusterLabels.push(label);
      this.fadeInCluster(points, index * 200);
    });

    this.onLabelsChanged?.();
    this.startAnimationLoop();
  }

  resize(canvas: HTMLCanvasElement): void {
    if (!this.camera || !this.renderer || !this.composer) {
      return;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  destroy(): void {
    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    this.controls?.dispose();
    this.disposeClusters();
    this.disposeStarfield();
    this.composer?.passes?.forEach((pass) => {
      if ('dispose' in pass && typeof pass.dispose === 'function') {
        pass.dispose();
      }
    });
    this.renderer?.dispose();
    this.onLabelsChanged = undefined;
  }

  private startAnimationLoop(): void {
    if (
      this.animationId !== undefined ||
      !this.renderer ||
      !this.scene ||
      !this.camera ||
      !this.sceneGroup ||
      !this.composer
    ) {
      return;
    }

    this.animate();
  }

  private animate = (): void => {
    if (
      !this.renderer ||
      !this.scene ||
      !this.camera ||
      !this.sceneGroup ||
      !this.composer
    ) {
      this.animationId = undefined;
      return;
    }

    this.animationId = requestAnimationFrame(this.animate);
    this.controls?.update();

    if (this.updateClusterLabels()) {
      this.onLabelsChanged?.();
    }

    this.composer.render();
  };

  private buildStarfield(): void {
    if (!this.scene) {
      return;
    }

    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 80;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x464752,
      size: 0.08,
      sizeAttenuation: true,
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  private disposeStarfield(): void {
    if (!this.starfield) {
      return;
    }

    this.starfield.geometry.dispose();
    (this.starfield.material as THREE.PointsMaterial).dispose();
    this.scene?.remove(this.starfield);
    this.starfield = undefined;
  }

  private buildClusterPoints(cluster: EmbeddingCluster): THREE.Points {
    const positions = new Float32Array(cluster.points.length * 3);

    cluster.points.forEach((point, index) => {
      positions[index * 3] = point[0];
      positions[index * 3 + 1] = point[1];
      positions[index * 3 + 2] = point[2];
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: cluster.color
        ? new THREE.Color(cluster.color)
        : new THREE.Color(0x81ecff),
      size: 0.07,
      sizeAttenuation: true,
    });

    return new THREE.Points(geometry, material);
  }

  private computeCentroid(cluster: EmbeddingCluster): THREE.Vector3 {
    if (cluster.points.length === 0) {
      return new THREE.Vector3();
    }

    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (const point of cluster.points) {
      sumX += point[0];
      sumY += point[1];
      sumZ += point[2];
    }

    return new THREE.Vector3(
      sumX / cluster.points.length,
      sumY / cluster.points.length,
      sumZ / cluster.points.length,
    );
  }

  private fadeInCluster(points: THREE.Points, delay: number): void {
    const material = points.material as THREE.PointsMaterial;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      material.opacity = 1;
      return;
    }

    const start = performance.now() + delay;
    const duration = 800;

    const tick = (): void => {
      const elapsed = performance.now() - start;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      material.opacity = 1 - Math.pow(1 - progress, 3);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  private disposeClusters(): void {
    this.clusterObjects.forEach((points) => {
      points.geometry.dispose();
      (points.material as THREE.PointsMaterial).dispose();
      this.sceneGroup?.remove(points);
    });

    this.clusterObjects = [];
    this.sceneLabels.length = 0;
    this.clusterLabels.length = 0;
  }

  private updateClusterLabels(): boolean {
    if (!this.camera || !this.renderer) {
      return false;
    }

    const canvas = this.renderer.domElement;
    const halfWidth = canvas.clientWidth / 2;
    const halfHeight = canvas.clientHeight / 2;
    const tempVec = new THREE.Vector3();
    let changed = false;

    for (const label of this.sceneLabels) {
      tempVec.copy(label.centroid);
      this.sceneGroup?.matrixWorld &&
        tempVec.applyMatrix4(this.sceneGroup.matrixWorld);
      tempVec.project(this.camera);

      if (tempVec.z > 1) {
        if (label.visible) {
          label.visible = false;
          changed = true;
        }
        continue;
      }

      const nextX = tempVec.x * halfWidth + halfWidth;
      const nextY = -(tempVec.y * halfHeight) + halfHeight;
      const moved =
        Math.abs(nextX - label.x) > 0.5 || Math.abs(nextY - label.y) > 0.5;

      if (moved || !label.visible) {
        label.x = nextX;
        label.y = nextY;
        label.visible = true;
        changed = true;
      }
    }

    return changed;
  }
}
