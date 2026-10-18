import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createPokedexScreen, createStatScreen, pokemonDescription } from './pokedex.js';

const canvas = document.querySelector('#exp-canvas');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x274e13);
// Camera
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3.5);
// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
// Lights
scene.add(new THREE.AmbientLight(0xffffff, 2.5));
const sun = new THREE.DirectionalLight(0xffffff, 5);
sun.position.set(5, 5, 5);
scene.add(sun);

// HTML
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(innerWidth, innerHeight);
cssRenderer.domElement.style.position = 'fixed';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
document.body.appendChild(cssRenderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.minAzimuthAngle = -Math.PI / 3;
controls.maxAzimuthAngle = Math.PI / 3;
controls.maxDistance = 5;

// Sticks an HTML screen onto a part of the model
function stick(sticker, part, width, height, tilt, moveX = 0, moveY = 0) {
  const box = new THREE.Box3().setFromObject(part);
  const size = box.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
  sticker.scale.setScalar(Math.min(size[0] / width, size[1] / height));

  const direction = box.getCenter(new THREE.Vector3()).sub(camera.position).normalize();
  const hit = new THREE.Raycaster(camera.position, direction).intersectObject(part, true)[0];
  const facing = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).negate();

  sticker.position.copy(hit.point).addScaledVector(facing, 0.01);
  sticker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), facing);
  sticker.rotateY(Math.PI);
  sticker.rotateZ(tilt);
  sticker.translateX(moveX);
  sticker.translateY(moveY);
  scene.add(sticker);
}

// Load the model and stick the screens on it
new GLTFLoader().load('/Models/pokedex.glb', function (gltf) {
  const model = gltf.scene;
  scene.add(model);
  model.rotation.y = -Math.PI / 2.3;
  model.updateMatrixWorld(true);

  stick(new CSS3DObject(createPokedexScreen()), model.getObjectByName('Object_6'), 280, 240, 0);
  stick(new CSS3DObject(createStatScreen()), model.getObjectByName('Object_7'), 330, 270, -0.06);
  stick(new CSS3DObject(pokemonDescription()), model.getObjectByName('Object_17'), 500, 250, 0, 0.15, 0.33);
});

// Draw everything
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}
animate();

// Keep the size right when the window changes
addEventListener('resize', function () {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  cssRenderer.setSize(innerWidth, innerHeight);
});

// Background music
const listener = new THREE.AudioListener();
camera.add(listener);
const backgroundMusic = new THREE.Audio(listener);

new THREE.AudioLoader().load('/Models/assets/littleroot_town.mp3', function (buffer) {
  backgroundMusic.setBuffer(buffer);
  backgroundMusic.setLoop(true);
  backgroundMusic.setVolume(0.4);
});

document.getElementById('start').addEventListener('click', function () {
  this.remove();
  listener.context.resume();
  if (backgroundMusic.buffer) backgroundMusic.play();
});

const groundGeometry = new THREE.CircleGeometry(2, 60);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x7cfc00 } );

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.y = -1.1;
scene.add(groundMesh);