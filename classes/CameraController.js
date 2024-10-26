// CameraController.js
import * as THREE from 'three';
import { gsap } from 'gsap';

export class CameraController {
  constructor(fov, aspect, near, far, initialPosition, target) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.target = target || new THREE.Vector3(0, 0, 0);

    // Check if device is mobile to set the initial position accordingly
    this.isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;
    const initialPos = this.isMobile && initialPosition.mobile ? initialPosition.mobile : initialPosition.default;
    this.camera.position.set(initialPos.x, initialPos.y, initialPos.z);
    this.camera.lookAt(this.target);
  }

  // Method to update the camera aspect ratio on resize and adjust position for mobile
  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Adjust camera position based on device type
    const targetPosition = this.isMobile ? { x: 25, y: 45, z: -30 } : { x: 25, y: 28, z: -20 };
    this.camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

    // Ensure the camera looks at the target
    this.camera.lookAt(this.target);
  }

  // Method to set a new target for the camera to look at
  setTarget(x, y, z) {
    this.target.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  // Method to animate camera movement to a new position
  moveTo(newPosition, duration = 2) {
    gsap.to(this.camera.position, {
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      duration: duration,
      onUpdate: () => {
        this.camera.lookAt(this.target);
      }
    });
  }
}
