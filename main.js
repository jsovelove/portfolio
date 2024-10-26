import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {HalftonePass} from 'three/examples/jsm/postprocessing/HalftonePass.js';
import {gsap} from 'gsap';
import {AudioVisualizer} from '/classes/AudioVisualizer.js';
import {Ring} from  '/classes/Ring.js';
import { Particles } from '/classes/Particles.js';
import { AssetLoader } from '/classes/AssetLoader.js';
import { PointMesh } from '/classes/PointMesh.js';
import { CameraController } from '/classes/CameraController.js';
import { CameraButtonController } from './classes/CameraButtonController.js';

const targetPoint = new THREE.Vector3(13, 0.2, 7); // Adjust this to your model's position
const isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;

const scene = new THREE.Scene();
const cameraController = new CameraController(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
  { 
    default: { x: 25, y: 28, z: -20 }, // Default desktop position
    mobile: { x: 25, y: 45, z: -30 }  // Initial mobile position
  },
  targetPoint
);
const camera = cameraController.camera
window.addEventListener('resize', () => {
  cameraController.resize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const playPauseButton = document.getElementById('playPauseButton');
const buttonContainer = document.getElementById('buttonContainer');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const sectionOne = document.getElementById('section-one');
const aboutMe = document.getElementById('aboutMe');
const skills = document.getElementById('skills')
const moveCameraButton = document.getElementById('moveCameraButton'); // The initial button element

playPauseButton.addEventListener('click', () => {
  audioVisualizer.togglePlayPause();
});

// Set up CameraButtonController with positions for Move Camera and Back actions
const cameraButtonController = new CameraButtonController(
  cameraController,
  buttonContainer,
  moveCameraButton,
  sectionOne, // Pass the existing moveCameraButton
  { 
    default: { x: 25, y: 300, z: -20 }, // Move Camera position
    mobile: { x: 25, y: 300, z: -20 } 
  },
  { 
    default: { x: 25, y: 28, z: -20 }, // Back position
    mobile: { x: 25, y: 45, z: -30 } 
  }
);



cameraController.resize(window.innerWidth, window.innerHeight);

// Resize listener
window.addEventListener('resize', () => {
  cameraController.resize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const particles = new Particles(scene);
const audioVisualizer = new AudioVisualizer('/portfolio/bug.mp3', 256, playIcon, pauseIcon);

const rings = [];
for (let i = 0; i < 50; i++) {
  const innerRadius = 1 + i * 3;
  const outerRadius = innerRadius + 0.3;
  const ring = new Ring(scene, innerRadius, outerRadius, new THREE.Vector3(13, 0.2, 7));
  rings.push(ring);
}



window.addEventListener('resize', () => {
  cameraController.resize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
});

cameraController.resize(window.innerWidth, window.innerHeight);
camera.lookAt(targetPoint);

//render and post process
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true 
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.render(scene, camera);
scene.background = new THREE.Color(0xffffff);


//post processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const pass = new HalftonePass(window.innerWidth, window.innerHeight, {greyscale: true, radius: 1, scatter: 1, blending: 1})
pass.renderToScreen = true;
composer.addPass(pass);


//lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
scene.add(directionalLight);
directionalLight.position.set(0, 50, -30);
directionalLight.lookAt(30, 10, 0)

const assetLoader = new AssetLoader(scene);
const modelUrl = new URL('voxelme2.glb', import.meta.url);
assetLoader.loadModel(modelUrl.href, {
  position: { x: 9, y: 0.34, z: 6 },
  scale: { x: 1, y: 1, z: 1 },
  rotation: { x: Math.PI * 0.05, y: 0, z: 0 }
}).then((model) => {
  console.log('Model loaded:', model);
}).catch((error) => {
  console.error('Model loading failed:', error);
});

const mesh2 = new PointMesh(scene, 'sphere', { radius: 50, widthSegments: 50, heightSegments: 14 }, { color: 'black', size: 1, sizeAttenuation: false }, { x: 200, y: 90, z: 280 });
const mesh3 = new PointMesh(scene, 'sphere', { radius: 25, widthSegments: 25, heightSegments: 14 }, { color: 'black', size: 1, sizeAttenuation: false }, { x: -320, y: 90, z: -120 });


function animate(time) {
  const frequencyData = audioVisualizer.getFrequencyData();
  particles.rotate(time / 100000, time / 100000);
  composer.render(scene, camera);

  rings.forEach((ring, index) => {
    const scale = frequencyData[index % audioVisualizer.bufferLength] / 128;
    ring.setScale(scale);
  });
  
  rings.forEach((ring, index) => {
    const frequencyValue = frequencyData[index % audioVisualizer.bufferLength];
    const normalizedValue = frequencyValue / 255;
    const dynamicScale = 1 + normalizedValue;
    ring.setScale(dynamicScale);
});

}
renderer.setAnimationLoop(animate);



