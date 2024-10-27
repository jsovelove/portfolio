// AssetLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AssetLoader {
  constructor(scene, loadingManager = null) {
    this.scene = scene;
    this.loader = loadingManager ? new GLTFLoader(loadingManager.getManager()) : new GLTFLoader();
  }

  loadModel(url, options = {}) {
    const { position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, rotation = { x: 0, y: 0, z: 0 } } = options;

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(position.x, position.y, position.z);
          model.scale.set(scale.x, scale.y, scale.z);
          model.rotation.set(rotation.x, rotation.y, rotation.z);
          this.scene.add(model);
          resolve(model);  // Resolve the promise with the loaded model
        },
        undefined,
        (error) => {
          console.error(`Error loading model at ${url}:`, error);
          reject(error);  // Reject the promise on error
        }
      );
    });
  }
}
