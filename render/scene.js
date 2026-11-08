// Three.js scene: renderer, isometric camera and lights.

import * as THREE from 'three';

export function createScene(canvas, config) {
  const { width, height } = config.frame;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  // Orthographic camera = no perspective, parallel lines stay parallel.
  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 500);
  const az = THREE.MathUtils.degToRad(config.camera.azimuthDeg);
  const el = THREE.MathUtils.degToRad(config.camera.elevationDeg);
  const d = config.camera.distance;
  camera.position.set(
    d * Math.cos(el) * Math.sin(az),
    d * Math.sin(el),
    d * Math.cos(el) * Math.cos(az),
  );
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xd8c8ff, 0x3a2340, 1.4));
  const sun = new THREE.DirectionalLight(0xfff1dd, 2.2);
  sun.position.set(-12, 20, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 60 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // Zooms the camera so `object` fits in the frame, with a margin.
  function fitTo(object) {
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return;
    camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const x of [box.min.x, box.max.x]) {
      for (const y of [box.min.y, box.max.y]) {
        for (const z of [box.min.z, box.max.z]) {
          const p = new THREE.Vector3(x, y, z).applyMatrix4(view);
          minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        }
      }
    }
    const marginRatio = config.frame.marginPx / Math.min(width, height);
    const half = (Math.max(maxX - minX, maxY - minY) / 2) / (1 - 2 * marginRatio);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const aspect = width / height;
    camera.left = cx - half * aspect;
    camera.right = cx + half * aspect;
    camera.top = cy + half;
    camera.bottom = cy - half;
    camera.updateProjectionMatrix();
  }

  function render() {
    renderer.render(scene, camera);
  }

  return { renderer, scene, camera, fitTo, render };
}
