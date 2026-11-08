// Loads glTF models once and hands out copies.

import { GLTFLoader } from '../vendor/three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = new Map();

export function loadModel(path) {
  if (!cache.has(path)) {
    cache.set(path, loader.loadAsync(`assets/models/${path}`).then((gltf) => {
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      return gltf.scene;
    }));
  }
  return cache.get(path).then((scene) => scene.clone(true));
}
