import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 400 });

let guiShowToggle = false;
let guiControlToggle = false;
// gui.show(gui._hidden);
// gui.open(gui._closed);

window.addEventListener('keypress', (e) => {
    if ((e.key === 'h' || e.key === 'H') && guiShowToggle == false) {
        gui.show(guiShowToggle);
        guiShowToggle = true;
    } else if ((e.key === 'h' || e.key === 'H') && guiShowToggle == true) {
        gui.show(guiShowToggle);
        guiShowToggle = false;
    }
    if ((e.key === 'c' || e.key === 'C') && guiControlToggle == false) {
        gui.open(guiControlToggle);
        guiControlToggle = true;
    } else if ((e.key === 'c' || e.key === 'C') && guiControlToggle == true) {
        gui.open(guiControlToggle);
        guiControlToggle = false;
    }
});

const parameters = {
    color: 0xff0000,
    sunLightColor: 0x00fffc,
    groundColor: 0x0000ff,
    pointColor: 0xff9000,
    rectAreaColor: 0x4e00ff,
    spotLightColor: 0x78ff00,
    // spin: () => {
    //     gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    // },
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// Omnidirectional Light effect
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light');
gui.add(ambientLight, 'visible');

// Sun light effect
const directionalLight = new THREE.DirectionalLight(parameters.sunLightColor, 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

const dLGuiFolder = gui.addFolder('Sun light');
dLGuiFolder.addColor(parameters, 'sunLightColor').onChange(() => {
    directionalLight.color.set(parameters.sunLightColor);
});
dLGuiFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Intensity');
dLGuiFolder.add(directionalLight.position, 'x').min(0).max(5).step(0.001).name('position x');
dLGuiFolder.add(directionalLight.position, 'y').min(0).max(5).step(0.001).name('position y');
dLGuiFolder.add(directionalLight.position, 'z').min(0).max(5).step(0.001).name('position z');

dLGuiFolder.add(directionalLight, 'visible');

// Sky and Ground color combination
const hemisphereLight = new THREE.HemisphereLight(parameters.color, parameters.groundColor, 0.3);
scene.add(hemisphereLight);

const hslGuiFolder = gui.addFolder('Hemishepe light');
hslGuiFolder.addColor(parameters, 'color').onChange(() => {
    hemisphereLight.color.set(parameters.color);
});
hslGuiFolder.addColor(parameters, 'groundColor').onChange(() => {
    hemisphereLight.groundColor.set(parameters.groundColor);
});
hslGuiFolder.add(hemisphereLight, 'visible');

// One Directional Light
const pointLight = new THREE.PointLight(parameters.pointColor, 0.5, 1);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

console.log(scene.remove);
const plGuiFolder = gui.addFolder('Point Light');
plGuiFolder.addColor(parameters, 'pointColor').onChange(() => {
    pointLight.color.set(parameters.pointColor);
});
plGuiFolder.add(pointLight, 'intensity').min(0).max(5).step(0.001);
plGuiFolder.add(pointLight, 'distance').min(0).max(10).step(0.001);
plGuiFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.001).name('position x');
plGuiFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.001).name('position y');
plGuiFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.001).name('position z');
plGuiFolder.add(pointLight, 'visible');

// Rectangle Light
const rectAreaLight = new THREE.RectAreaLight(parameters.rectAreaColor, 2, 3, 1);
scene.add(rectAreaLight);

const ralGuiFolder = gui.addFolder('RectArea Light');
ralGuiFolder.addColor(parameters, 'rectAreaColor').onChange(() => {
    rectAreaLight.color.set(parameters.rectAreaColor);
});
ralGuiFolder.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001);
ralGuiFolder.add(rectAreaLight, 'power').min(0).max(50).step(0.001);
ralGuiFolder.add(rectAreaLight, 'width').min(0).max(5).step(0.001);
ralGuiFolder.add(rectAreaLight, 'height').min(0).max(5).step(0.001);
ralGuiFolder.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.001).name('position x');
ralGuiFolder.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.001).name('position y');
ralGuiFolder.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.001).name('position z');
ralGuiFolder.add(rectAreaLight, 'visible');

// Spot Light
const spotLight = new THREE.SpotLight(parameters.spotLightColor, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
// spotLight.target.position.set(0.75, 0, 0);
scene.add(spotLight, spotLight.target);

const spGuiFolder = gui.addFolder('Spot Light');
spGuiFolder.addColor(parameters, 'spotLightColor').onChange(() => {
    spotLight.color.set(parameters.spotLightColor);
});
spGuiFolder.add(spotLight, 'intensity').min(0).max(10).step(0.001);
spGuiFolder.add(spotLight, 'distance').min(0).max(20).step(0.001);
spGuiFolder.add(spotLight, 'angle').min(0).max(2).step(0.0001);
spGuiFolder.add(spotLight, 'penumbra').min(0).max(2).step(0.001);
spGuiFolder.add(spotLight, 'decay').min(0).max(10).step(0.001);
spGuiFolder.add(spotLight.position, 'x').min(-5).max(5).step(0.001).name('position x');
spGuiFolder.add(spotLight.position, 'y').min(-5).max(5).step(0.001).name('position y');
spGuiFolder.add(spotLight.position, 'z').min(-5).max(5).step(0.001).name('position z');
spGuiFolder.add(spotLight.target.position, 'x').min(-5).max(5).step(0.001).name('target x');
spGuiFolder.add(spotLight.target.position, 'y').min(-5).max(5).step(0.001).name('target y');
spGuiFolder.add(spotLight.target.position, 'z').min(-5).max(5).step(0.001).name('target z');
spGuiFolder.add(spotLight, 'visible');

/**
 * Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
scene.add(spotLightHelper);

window.requestAnimationFrame(() => {
    spotLightHelper.update();
});

hemisphereLightHelper.visible = false;
directionalLightHelper.visible = false;
pointLightHelper.visible = false;
rectAreaLightHelper.visible = false;
spotLightHelper.visible = false;
hslGuiFolder.add(hemisphereLightHelper, 'visible').name('helper');
dLGuiFolder.add(directionalLightHelper, 'visible').name('helper');
plGuiFolder.add(pointLightHelper, 'visible').name('helper');
ralGuiFolder.add(rectAreaLightHelper, 'visible').name('helper');
spGuiFolder.add(spotLightHelper, 'visible').name('helper');

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
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

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
