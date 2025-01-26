import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { gsap } from "gsap/gsap-core";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
const doorTexture = textureLoader.load("/textures/matcaps/8.png");
doorTexture.colorSpace = THREE.SRGBColorSpace;
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello There", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);

  textGeometry.center();

  const axesHelper = new THREE.AxesHelper(5);
  //   scene.add(axesHelper);

  const material = new THREE.MeshMatcapMaterial({
    matcap: doorTexture,
    // color: "#ffffff",
    wireframe: false,
  });
  const text = new THREE.Mesh(textGeometry, material);

  //   debug ui/
  gui.add(text.position, "y").min(-1).max(1).step(0.01);
  gui.add(text.position, "x").min(-1).max(1).step(0.01);
  console.log(textGeometry);
  text.rotateX(-(Math.PI / 6));

  // add bevel related properties as well
  //   gui.add(text.material, "wireframe");

  //   text.position.x = -1.5;
  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  console.time("donuts");
  for (let i = 0; i < 150; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
  console.timeEnd("donuts");

  gui.add(text.geometry.parameters.options, "bevelEnabled");
  gui
    .add(text.geometry.parameters.options, "bevelThickness")
    .min(0)
    .max(1)
    .step(0.001);
  gui
    .add(text.geometry.parameters.options, "bevelSize")
    .min(0)
    .max(1)
    .step(0.001);
  gui
    .add(text.geometry.parameters.options, "bevelOffset")
    .min(0)
    .max(1)
    .step(0.001);
  gui
    .add(text.geometry.parameters.options, "bevelSegments")
    .min(0)
    .max(100)
    .step(1);
});
// const textGeometry = new THR();
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const elapsedTime = clock.getElapsedTime();
gsap.from(camera.position, {
  duration: 1.5,
  delay: 0,
  x: Math.cos(elapsedTime) * 5,
  z: Math.sin(elapsedTime) * 3,
});

const tick = () => {
  // Camera animation (optional)
  //   camera.position.x = Math.cos(elapsedTime) * 3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Keep the loop going
  window.requestAnimationFrame(tick);
};

tick(); // Start the anince
