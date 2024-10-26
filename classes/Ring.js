import * as THREE from 'three';

export class Ring {
    constructor(scene, innerRadius, outerRadius, position, color = 0x000000) {
      this.geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
      this.material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(position.x, position.y, position.z);
      this.mesh.rotation.x = -Math.PI / 2;
      scene.add(this.mesh);
    }
  
    setScale(scale) {
      this.mesh.scale.set(scale, scale, 1);
    }
  }
  