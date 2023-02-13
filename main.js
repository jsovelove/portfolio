import './style.css'

import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass';
import * as dat from 'dat.gui';
import { Raycaster } from 'three';




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
camera.position.set(30, 20, 30)




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

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.7);
scene.add(directionalLight);
directionalLight.position.set(0, 50, -30);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

let material;
const geometry = new THREE.BufferGeometry()
const vertices = []
const size = 1000

for (let i = 0; i < 1000; i++) {
    const x = (Math.random() * size + Math.random() * size) / 2 - size / 2
    const y = (Math.random() * size + Math.random() * size) / 2 - size / 2
    const z = (Math.random() * size + Math.random() * size) / 2 - size / 2

    vertices.push(x, y, z)
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

material = new THREE.PointsMaterial({
    size: 1,
    color: 0xffffff,
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = t * -0.10 + 20;
  scene.rotation.y = t / 500;
}

document.body.onscroll = moveCamera

var geo = new THREE.PlaneGeometry(1000, 1000, 8, 8);
var mat = new THREE.MeshBasicMaterial({ color:'black', side: THREE.DoubleSide });
var plane = new THREE.Mesh(geo, mat);
scene.add(plane);
plane.rotation.x = Math.PI * 0.5;


const assetLoader = new GLTFLoader();
assetLoader.load(jackURL.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(9, 0.34, 6);
    // model.rotation.y = Math.PI * 0.25
    model.rotation.x = Math.PI * 0.05
    
    
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


camera.position.set(25, 20, -20,);
camera.lookAt(30, 5, 10);



onload = function(){
  camera.position.set(30, 50, 30)
  camera.lookAt(30, 5, 10)
  gsap.to(camera.position, {
      x: 25,
      z: -20,
      y: 20,
      duration: 1,
      onUpdate: function() {
          camera.lookAt(30, 5, 10);
          
      }
  });
  
};



var mat2 = new THREE.PointsMaterial({
	color: 'white',
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
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85);
bloomPass.renderToScreen = true;
composer.addPass(bloomPass);

const raycaster = new THREE.Raycaster();

function animate(time) {
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
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})

