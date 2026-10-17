import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createPokedexScreen } from './pokedex.js';

const canvas = document.querySelector('#exp-canvas');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2.2);

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

const sticker = new CSS3DObject(createPokedexScreen());
sticker.visible = false;
scene.add(sticker);

new GLTFLoader().load('/Models/pokedex.glb', ({ scene: model }) => {
  scene.add(model);
  model.rotation.y = -Math.PI / 2.3;
  model.updateMatrixWorld(true);

  const tv = model.getObjectByName('Object_6');
  const box = new THREE.Box3().setFromObject(tv);

  // Size: the two largest sides are width and height
  const [w, h] = box.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
  sticker.scale.setScalar(Math.min(w / 280, h / 240));

  // Position: ray from the camera to the TV, facing opposite the hit normal
  const dir = box.getCenter(new THREE.Vector3()).sub(camera.position).normalize();
  const hit = new THREE.Raycaster(camera.position, dir).intersectObject(tv, true)[0];
  const facing = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).negate();

  sticker.position.copy(hit.point).addScaledVector(facing, 0.01);
  sticker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), facing);
  sticker.rotateY(Math.PI);
  sticker.visible = true;
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
controls.enableZoom = false;