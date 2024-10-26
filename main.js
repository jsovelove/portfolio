import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {HalftonePass} from 'three/examples/jsm/postprocessing/HalftonePass.js';
import {gsap} from 'gsap';
import {AudioVisualizer} from '/AudioVisualizer.js';
import {Ring} from  '/Ring.js';
import { Particles } from '/Particles.js';

const jackURL = new URL('voxelme2.glb', import.meta.url);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
const moveCameraButton = document.getElementById('moveCameraButton');

function moveCameraToPosition(x, y, z) {
  gsap.to(camera.position, {
    x: x,
    y: y,
    z: z,
    duration: 2, // Adjust as needed for smoothness
    ease: 'power2.out',
    onUpdate: () => {
      camera.lookAt(targetPoint);
    }
  });
}

const playPauseButton = document.getElementById('playPauseButton');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const particles = new Particles(scene);
const audioVisualizer = new AudioVisualizer('/portfolio/bug.mp3', 256, playIcon, pauseIcon);

const rings = [];
for (let i = 0; i < 50; i++) {
  const innerRadius = 1 + i * 3;
  const outerRadius = innerRadius + 0.3;
  const ring = new Ring(scene, innerRadius, outerRadius, new THREE.Vector3(13, 0.2, 7));
  rings.push(ring);
}
moveCameraButton.addEventListener('click', () => {
  moveCameraToPosition(25, 220, -20); // Move the camera to a higher position
  createNewButtons(); // Create the new buttons after moving the camera
});

const sectionOne = document.getElementById('section-one');
const aboutMe = document.getElementById('aboutMe');
const skills = document.getElementById('skills')
function fadeOut(element, duration = 0.5) {
  gsap.to(element, {
    opacity: 0,
    duration: duration,
    onComplete: () => {
      element.style.display = 'none';
    }
  });
}

function fadeIn(element, duration = 0.5) {
  element.style.display = 'flex'; // Ensure the element is visible before fading in
  gsap.to(element, {
    opacity: 1,
    duration: duration
  });
}

function checkCameraPosition() {
  const thresholdY1 = 100;
  const thresholdY2 = 800;
  const thresholdY3 = 900;


  // Check if the camera is above the first threshold
  if (camera.position.y > thresholdY1) {
    fadeOut(sectionOne, 0.5);
  } else {
    fadeIn(sectionOne, 0.5);
  }

  // Check if the camera is above the second threshold for the "About Me" section
  if (camera.position.y > thresholdY2) {
    fadeIn(aboutMe, 0.5);
  } else {
    fadeOut(aboutMe, 0.5);
  }
  if (camera.position.y > thresholdY3) {
    fadeOut(aboutMe, 0);
  }
  if (camera.position.y > thresholdY3) {
    skills.style.display = 'flex'
  }

}

const buttonContainer = document.getElementById('buttonContainer');


 

playPauseButton.addEventListener('click', () => {
  audioVisualizer.togglePlayPause();
});
// Target point where your character or model is positioned
const targetPoint = new THREE.Vector3(13, 0.2, 7); // Adjust this to your model's position

function resize() {
  const isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;
  // Update the aspect ratio of the camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // Update the renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Update the halftone pass with the new window dimensions (if needed)
  pass.uniforms.width.value = window.innerWidth;
  pass.uniforms.height.value = window.innerHeight;
  composer.setSize(window.innerWidth, window.innerHeight);

  // Adjust the camera position to ensure it keeps the target centered on desktop
   // Adjust the threshold for mobile as needed
  if (isMobile) {
    camera.position.set(25, 45, -30); // Higher position for smaller screens
  } else {
    camera.position.set(25, 28, -20); // Original position for larger screens
  }

  camera.lookAt(targetPoint); // Ensure the camera looks at the model's position
}
const isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;

window.addEventListener('resize', resize);
if (isMobile) {
  camera.position.set(25, 45, -30); // Higher position for smaller screens
} else {
  camera.position.set(25, 28, -20); // Original position for larger screens
}
camera.lookAt(targetPoint);


function createNewButtons() {
  const isMobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;

  // Create buttons for going back to the original position and moving right
  const navContainer = document.createElement('div')
  buttonContainer.appendChild(navContainer);


const backButton = document.createElement('button');
  backButton.classList.add('control-button');
  const backIcon = document.createElement('span');
  backIcon.classList.add('material-icons');
  backIcon.textContent = 'arrow_upward';
  backButton.appendChild(backIcon);

  const rightButton = document.createElement('button');
  rightButton.classList.add('control-button');
  rightButton.textContent = "BIO"

  const skillButton = document.createElement('button');
  skillButton.classList.add('control-button');
  skillButton.textContent = "SKILLS"
  backButton.addEventListener('click', () => {
    buttonContainer.removeChild(navContainer);
    buttonContainer.appendChild(moveCameraButton);
    if (isMobile) {
      moveCameraToPosition(25, 45, -30);
    } else {
      moveCameraToPosition(25, 28, -20);
    }
  });

  rightButton.addEventListener('click', () => {
    moveCameraToPosition(50, 900, -20); // Move to the right
    navContainer.removeChild(rightButton);
    navContainer.appendChild(skillButton)
  });
  skillButton.addEventListener('click', () => {
    moveCameraToPosition(50, 2000, -20); // Move to the right
    navContainer.removeChild(skillButton);
  });
  buttonContainer.removeChild(moveCameraButton);
  buttonContainer.appendChild(navContainer);
  navContainer.appendChild(backButton);
  navContainer.appendChild(rightButton);
}

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true 
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.render(scene, camera);

const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) =>{
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 -1

})

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
scene.add(directionalLight);
directionalLight.position.set(0, 50, -30);
directionalLight.lookAt(30, 10, 0)

scene.background = new THREE.Color(0xffffff);

const assetLoader = new GLTFLoader();
assetLoader.load(jackURL.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(9, 0.34, 6);
    // model.rotation.y = Math.PI * 0.25
    model.rotation.x = Math.PI * 0.05
    model.castShadow = true;
    
}, undefined, function(error) {
    console.error(error);
});

var mat2 = new THREE.PointsMaterial({
	color: 'black',
	size: 1,
	sizeAttenuation: false
});
var geometry2 = new THREE.SphereGeometry(50, 50, 14);
var geometry3 = new THREE.SphereGeometry(25, 25, 14);


var mesh2 = new THREE.Points(geometry2, mat2);
mesh2.position.z = 280;
mesh2.position.x = 200;
mesh2.position.y = 90;
scene.add(mesh2);
var mesh3 = new THREE.Points(geometry3, mat2);
mesh3.position.z = -120;
mesh3.position.x = -320;
mesh3.position.y = 90;
scene.add(mesh3);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const pass = new HalftonePass(window.innerWidth, window.innerHeight, {greyscale: true, radius: 1, scatter: 1, blending: 1})
pass.renderToScreen = true;
composer.addPass(pass);


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
  checkCameraPosition();

}
renderer.setAnimationLoop(animate);



