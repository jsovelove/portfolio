import * as THREE from 'three';

export class Particles {
  constructor(scene, size = 1000, numParticles = 2000, color = 'black') {
    this.geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() * size + Math.random() * size) / 2 - size / 2;
      const y = (Math.random() * size + Math.random() * size) / 2 - size / 2;
      const z = (Math.random() * size + Math.random() * size) / 2 - size / 2;
      vertices.push(x, y, z);
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.material = new THREE.PointsMaterial({ size: 1, color });
    this.particles = new THREE.Points(this.geometry, this.material);
    scene.add(this.particles);
  }

  rotate(x, y) {
    this.particles.rotation.x = x;
    this.particles.rotation.y = y;
  }
}
