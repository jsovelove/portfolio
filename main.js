import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {HalftonePass} from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { gsap } from 'gsap';

const jackURL = new URL('voxelme3.glb', import.meta.url);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
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

moveCameraButton.addEventListener('click', () => {
  moveCameraToPosition(25, 220, -20); // Move the camera to a higher position
  createNewButtons(); // Create the new buttons after moving the camera
});

const sectionOne = document.getElementById('section-one');
const aboutMe = document.getElementById('aboutMe');

function fadeOut(element, duration = 0.5) {
  gsap.to(element, { opacity: 0, duration: duration, onComplete: () => {
    element.style.display = 'none';
  }});
}

function fadeIn(element, duration = 0.5) {
  element.style.display = 'flex'; // Ensure the element is visible before fading in
  gsap.to(element, { opacity: 1, duration: duration });
}

function checkCameraPosition() {
  const thresholdY = 100;

  // Show or hide sections based on camera's y position
  if (camera.position.y > thresholdY) {
    fadeOut(sectionOne, 0.5);
    fadeIn(aboutMe, 0.5);
  } else {
    fadeOut(aboutMe, 0.5);
    fadeIn(sectionOne, 0.5);
  }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256; //fft
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const audio = new Audio('/portfolio/bug.mp3');
audio.crossOrigin = 'anonymous';
const track = audioContext.createMediaElementSource(audio);
track.connect(analyser);
analyser.connect(audioContext.destination);
const buttonContainer = document.getElementById('buttonContainer');

const playPauseButton = document.getElementById('playPauseButton');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

function togglePlayPause() {
  // Ensure the AudioContext is resumed after a user gesture
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (audio.paused) {
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    audio.pause();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}
playPauseButton.addEventListener('click', togglePlayPause);

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


  // Create the Back (Up Arrow) button
  const backButton = document.createElement('button');
  backButton.classList.add('control-button');
  const backIcon = document.createElement('span');
  backIcon.classList.add('material-icons');
  backIcon.textContent = 'arrow_upward'; // Use the up arrow icon
  backButton.appendChild(backIcon);

  // Create the Right (Right Arrow) button
  const rightButton = document.createElement('button');
  rightButton.classList.add('control-button');
  const rightIcon = document.createElement('span');
  rightIcon.classList.add('material-icons');
  rightIcon.textContent = 'arrow_downward'; // Use the right arrow icon
  rightButton.appendChild(rightIcon);

  // Add event listeners to the new buttons
  backButton.addEventListener('click', () => {
    buttonContainer.removeChild(navContainer);
    buttonContainer.appendChild(moveCameraButton);
    if (isMobile) {
      moveCameraToPosition(25, 45, -30); // Higher position for smaller screens
    } else {
      moveCameraToPosition(25, 28, -20); // Original position for larger screens
    }
  });

  rightButton.addEventListener('click', () => {
    moveCameraToPosition(50, 900, -20); // Move to the right
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

let material;
const geometry = new THREE.BufferGeometry()
const vertices = []
const size = 1000

for (let i = 0; i < 2000; i++) {
    const x = (Math.random() * size + Math.random() * size) / 2 - size / 2
    const y = (Math.random() * size + Math.random() * size) / 2 - size / 2
    const z = (Math.random() * size + Math.random() * size) / 2 - size / 2

    vertices.push(x, y, z)
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

material = new THREE.PointsMaterial({
    size: 1,
    color: 'black',
})
const particles = new THREE.Points(geometry, material)
scene.add(particles)


const rings = [];
const defaultScales = [];

function createRing(innerRadius, outerRadius) {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.position.set(13, 0.2, 7);
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);
    rings.push(ring);
    defaultScales.push(1);
}

for (let i = 0; i < 100; i++) {
    const innerRadius = 1 + i * 3;
    const outerRadius = innerRadius + 0.3;
    createRing(innerRadius, outerRadius, 0);
}


var geo = new THREE.PlaneGeometry(100, 100, 8, 8);
var mat = new THREE.MeshBasicMaterial({
  color: 'white',
  side: THREE.DoubleSide,
  opacity: 1,
  transparent: true
});
var plane = new THREE.Mesh(geo, mat);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = Math.PI * 0.5;


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
mesh2.position.z = -500;
mesh2.position.x = 100;
mesh2.position.y = 120;
scene.add(mesh2);
var mesh3 = new THREE.Points(geometry3, mat2);
mesh3.position.z = -200;
mesh3.position.x = -400;
mesh3.position.y = 90;
scene.add(mesh3);


const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const pass = new HalftonePass(window.innerWidth, window.innerHeight, {greyscale: true, radius: 1, scatter: 1, blending: 1})
pass.renderToScreen = true;
composer.addPass(pass);

function animate(time) {

  analyser.getByteFrequencyData(dataArray);


  particles.rotation.x = time / 100000;
  particles.rotation.y = time / 100000;
  mesh2.rotation.y += 0.001;
	mesh2.rotation.z += 0.001;
  mesh3.rotation.y -= 0.001;
	mesh3.rotation.z -= 0.001;
  // if (me) {
  //   me.position.x += 0.01; // Adjust the speed as needed
  // }
  composer.render(scene, camera);

  rings.forEach((ring, index) => {
    const scale = dataArray[index % bufferLength] / 128;
    ring.scale.set(scale, scale, 1);
  });

  rings.forEach((ring, index) => {
        const frequencyValue = dataArray[index % bufferLength];
        const normalizedValue = frequencyValue / 255;

        const dynamicScale = 1 + normalizedValue;
       
        ring.scale.set(dynamicScale, dynamicScale, 1);
    });
  //console.log(camera.position)
  checkCameraPosition();

}
renderer.setAnimationLoop(animate);



