declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher } from 'three';

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement);
    enabled: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    enablePan: boolean;
    enableZoom: boolean;
    enableRotate: boolean;
    minDistance: number;
    maxDistance: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    update(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer } from 'three';

  export class Pass {
    enabled: boolean;
    renderToScreen: boolean;
    dispose?(): void;
  }

  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    passes: Pass[];
    addPass(pass: Pass): void;
    render(delta?: number): void;
    setSize(width: number, height: number): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';

  export class RenderPass extends Pass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/EffectComposer';

  export class UnrealBloomPass extends Pass {
    constructor(
      resolution: Vector2,
      strength: number,
      radius: number,
      threshold: number,
    );
    strength: number;
    radius: number;
    threshold: number;
    dispose(): void;
  }
}
