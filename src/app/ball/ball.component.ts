import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.sass']
})
export class BallComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private sphere!: THREE.Mesh;
  private animationId?: number;
  private clock = new THREE.Clock();

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.sphere) {
      if (this.sphere.geometry) {
        this.sphere.geometry.dispose();
      }
      if (this.sphere.material) {
        if (Array.isArray(this.sphere.material)) {
          this.sphere.material.forEach(material => material.dispose());
        } else {
          this.sphere.material.dispose();
        }
      }
      this.sphere = null!;
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.onWindowResize);
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({ color: 0x2194ce, shininess: 100, specular: 0x888888 });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    window.addEventListener('resize', this.onWindowResize);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const t = this.clock.getElapsedTime();

    // swirling motion with slight jitter
    this.sphere.position.set(
      Math.sin(t * 0.8) * 1.5 + (Math.random() - 0.5) * 0.02,
      Math.sin(t * 1.2) * 1 + Math.sin(t * 0.5) * 0.5 + (Math.random() - 0.5) * 0.02,
      Math.cos(t * 0.8) * 1.5 + (Math.random() - 0.5) * 0.02
    );

    this.sphere.rotation.x += 0.02;
    this.sphere.rotation.y += 0.03;

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}
