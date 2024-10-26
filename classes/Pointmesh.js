// PointMesh.js
import * as THREE from 'three';

export class PointMesh {
  constructor(scene, geometryType, size, materialOptions, position) {
    // Create geometry based on the specified type
    if (geometryType === 'sphere') {
      this.geometry = new THREE.SphereGeometry(size.radius, size.widthSegments, size.heightSegments);
    } else if (geometryType === 'box') {
      this.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    } else {
      throw new Error(`Unsupported geometry type: ${geometryType}`);
    }

    // Create material with specified options
    this.material = new THREE.PointsMaterial({
      color: materialOptions.color || 'black',
      size: materialOptions.size || 1,
      sizeAttenuation: materialOptions.sizeAttenuation || false
    });

    // Create Points mesh
    this.mesh = new THREE.Points(this.geometry, this.material);

    // Set position
    this.mesh.position.set(position.x, position.y, position.z);

    // Add to the scene
    scene.add(this.mesh);
  }

  // Method to rotate the mesh
  rotate(xSpeed = 0.01, ySpeed = 0.01, zSpeed = 0.01) {
    this.mesh.rotation.x += xSpeed;
    this.mesh.rotation.y += ySpeed;
    this.mesh.rotation.z += zSpeed;
  }
}
