import './style.css'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {HalftonePass} from 'three/examples/jsm/postprocessing/HalftonePass.js';



const jackURL = new URL('voxelme3.glb', import.meta.url);
const computer = new URL('old_pc.glb', import.meta.url);
const ship = new URL('spaceship.glb', import.meta.url);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  700
);


function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = t * -0.10 + 28;
  scene.rotation.y = t / 1000;
  camera.lookAt(30, 10, 0);
}

document.body.onscroll = moveCamera
camera.position.set(25, 28, -20,);
camera.lookAt(30, 10, 0);

const playPauseButton = document.getElementById('playPauseButton');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256; // Adjust this for the resolution of the frequency data
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Load and play the audio file
const audio = new Audio('public/bug.mp3');
audio.crossOrigin = 'anonymous';
const track = audioContext.createMediaElementSource(audio);
track.connect(analyser);
analyser.connect(audioContext.destination);

function togglePlayPause() {
  if (audio.paused) {
      audio.play();
      playPauseButton.textContent = 'Pause';
  } else {
      audio.pause();
      playPauseButton.textContent = 'Play';
  }
}

playPauseButton.addEventListener('click', togglePlayPause);


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
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

// Function to create a ring
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
    defaultScales.push(1); // Store the default scale for each ring (e.g., 1)
}


for (let i = 0; i < 100; i++) {
    const innerRadius = 1 + i * 3;
    const outerRadius = innerRadius + 0.1;
    createRing(innerRadius, outerRadius, 0);
}


var geo = new THREE.PlaneGeometry(1000, 1000, 8, 8);
var mat = new THREE.MeshBasicMaterial({ color:'white', side: THREE.DoubleSide });
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

let pc;
assetLoader.load(computer.href, function(gltf){
  pc = gltf.scene;
  scene.add(pc);
  pc.position.set(-20, 110, -100);
  // model.rotation.y = Math.PI * 0.25
  pc.rotation.x = Math.PI * 0.05
  
  
}, undefined, function(error) {
  console.error(error);
});

let spaceship;
assetLoader.load(ship.href, function(gltf){
  spaceship = gltf.scene;
  scene.add(spaceship);
  spaceship.position.set(250, 110, -200);
  // model.rotation.y = Math.PI * 0.25
  
  
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
// Mesh
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
//const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85);
const pass = new HalftonePass(window.innerWidth, window.innerHeight, {greyscale: true, radius: 1, scatter: 1, blending: 1})
//bloomPass.renderToScreen = true;
pass.renderToScreen = true;
composer.addPass(pass);

const raycaster = new THREE.Raycaster();

function animate(time) {

  analyser.getByteFrequencyData(dataArray);


  particles.rotation.x = time / 100000;
  particles.rotation.y = time / 100000;
  mesh2.rotation.y += 0.001;
	mesh2.rotation.z += 0.001;
  mesh3.rotation.y -= 0.001;
	mesh3.rotation.z -= 0.001;
  if(pc){
    pc.rotation.y -= 0.0005;
    pc.rotation.z -= 0.0005;
    pc.rotation.x += 0.0005;
    }
  if(spaceship){
    spaceship.position.x -= time / 100000;
    }
  composer.render(scene, camera);

  rings.forEach((ring, index) => {
    const scale = dataArray[index % bufferLength] / 128; // Normalize and scale the value
    ring.scale.set(scale, scale, 1); // Scale the ring on the X and Y axes
  });

  rings.forEach((ring, index) => {
        const frequencyValue = dataArray[index % bufferLength];
        const normalizedValue = frequencyValue / 255; // Normalize between 0 and 1

        // Calculate the dynamic scale based on the FFT data and default scale
        const dynamicScale = 1 + normalizedValue; // Start at scale 1 and add the normalized value

        // Ensure that the ring scale is affected by FFT only if the audio is playing
        ring.scale.set(dynamicScale, dynamicScale, 1);
    });

  //console.log(camera.position)
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})

