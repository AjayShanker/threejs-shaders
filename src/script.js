import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const texture1 = textureLoader.load("/textures/canvatemplate1-tiny.png");
const texture2 = textureLoader.load("/textures/canvatemplate2-tiny.png");
const texture3 = textureLoader.load("/textures/canvatemplate3-tiny.png");
const texture4 = textureLoader.load("/textures/canvatemplate4-tiny.png");
const texture5 = textureLoader.load("/textures/canvatemplate5-tiny.png");
const texture6 = textureLoader.load("/textures/canvatemplate6-tiny.png");

// Geometry

const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
const geometry2 = new THREE.BoxGeometry(1, 1, 1);
// const count = geometry.attributes.position.count;
// const randoms = new Float32Array(count);
// for (let i = 0; i < count; i++) {
//   randoms[i] = Math.random();
// }
// geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  wireframe: false,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(2, 6) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: texture6 },
  },
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.x = 4 / 5;
scene.add(mesh);

// GUI Control Interface
// https://lil-gui.georgealways.com/#Guide#Numbers-and-Sliders
const obj = {
  reset() {
    gui.reset();
  },
  multiplyFactor: 1,
  bg: "#000",
};
gui
  .addColor(obj, "bg")
  .name("scene color")
  .onChange((v) => (scene.background = new THREE.Color(v)));
gui.add(mesh, "geometry", { plane: geometry, box: geometry2 });

gui.add(obj, "multiplyFactor").min(0.3).max(3).step(0.01).name("speed");
gui.add(material, "wireframe"); // checkbox
gui.add(material, "side", {
  frontSideOnly: THREE.FrontSide,
  backSideOnly: THREE.BackSide,
  doubleSide: THREE.DoubleSide,
});
gui
  .add(material.uniforms.uTexture, "value", {
    demo1: texture1,
    demo2: texture2,
    demo3: texture3,
    demo4: texture4,
    demo5: texture5,
  })
  .name("texture")
  .onChange((v) => {
    material.uniforms.uTexture.value = v;
  });

// https://lil-gui.georgealways.com/#Guide#Dropdowns
// use object so that dropdown item label won't be [ object Object ]

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(15)
  .step(0.01)
  .name("wavy X");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(15)
  .step(0.01)
  .name("wavy Y");

gui.add(mesh.scale, "x").min(0.5).max(2).step(0.01).name("scale X");
gui.add(mesh.scale, "y").min(0.5).max(2).step(0.01).name("scale Y");

gui.add(obj, "reset").name("reset to initial value");

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
camera.position.set(0.25, -0.25, 1);
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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime * obj.multiplyFactor;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();