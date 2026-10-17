import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createPokedexScreen, createStatScreen } from './pokedex.js';

const canvas = document.querySelector('#exp-canvas');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);

scene.add(new THREE.AmbientLight(0xffffff, 1));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(5, 5, 5);
scene.add(sun);

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(innerWidth, innerHeight);
cssRenderer.domElement.style.position = 'fixed';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
document.body.appendChild(cssRenderer.domElement);

const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Pokemon and name
const screen = new CSS3DObject(createPokedexScreen());
screen.visible = false;
scene.add(screen);

// Stat
const statScreen = new CSS3DObject(createStatScreen());
statScreen.visible = false;
scene.add(statScreen);

new GLTFLoader().load('/Models/pokedex.glb', ({ scene: model }) => {
  scene.add(model);
  model.rotation.y = -Math.PI / 2.3;
  model.updateMatrixWorld(true);

  const loadPokemon = model.getObjectByName('Object_6');
  const box = new THREE.Box3().setFromObject(loadPokemon);

  const [w, h] = box.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
  screen.scale.setScalar(Math.min(w / 280, h / 240));

  const dir = box.getCenter(new THREE.Vector3()).sub(camera.position).normalize();
  const hit = new THREE.Raycaster(camera.position, dir).intersectObject(loadPokemon, true)[0];
  const facing = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).negate();

  screen.position.copy(hit.point).addScaledVector(facing, 0.01);
  screen.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), facing);
  screen.rotateY(Math.PI);
  screen.visible = true;

  // Stat screen for the Pokemon
  const loadStaat = model.getObjectByName('Object_7');
  const statBox = new THREE.Box3().setFromObject(loadStaat);

  const [w_statScreen, h_statScreen] = statBox.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
  statScreen.scale.setScalar(Math.min(w_statScreen / 300, h_statScreen / 250));

  const dir_statSceen = statBox.getCenter(new THREE.Vector3()).sub(camera.position).normalize();
  const hit_statScreen = new THREE.Raycaster(camera.position, dir_statSceen).intersectObject(loadStaat, true)[0];
  const facing_statScreen = hit_statScreen.face.normal.clone().transformDirection(hit_statScreen.object.matrixWorld).negate();

  statScreen.position.copy(hit_statScreen.point).addScaledVector(facing_statScreen, 0.01);
  statScreen.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), facing_statScreen);
  statScreen.rotateY(Math.PI);
  statScreen.rotateZ(-0.070);
  statScreen.visible = true;
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  cssRenderer.setSize(innerWidth, innerHeight);
});

controls.minAzimuthAngle = -Math.PI / 3;
controls.maxAzimuthAngle = Math.PI / 3;
controls.maxDistance = 5;