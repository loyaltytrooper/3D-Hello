/* jshint esversion : 6 */
/* jshint asi : true */

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/*
 * Adding objects like ilithya's portfolio
 */
const donutMatcap = textureLoader.load('/textures/matcaps/8.png');
const donutMaterial = new THREE.MeshMatcapMaterial({matcap : donutMatcap});
const donutGeometry = new THREE.TorusGeometry(0.4, 0.15, 20, 45);
console.time('Donuts');

for(let i = 0; i < 200; i++)
{
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.x = (Math.random() - 0.5) * 15;
    donut.position.y = (Math.random() - 0.5) * 15;
    donut.position.z = (Math.random() - 0.5) * 15;

    donut.rotation.x = Math.PI * Math.random();
    donut.rotation.y = Math.PI * Math.random();
    donut.rotation.z = Math.PI * Math.random();

    const donutScale = Math.random() * 1.25;
    donut.scale.set(donutScale, donutScale, donutScale)
    scene.add(donut);
}

console.timeEnd('Donuts');

/*
 * Matcaps
 */
 const matcapTexture = textureLoader.load('/textures/matcaps/9.png');

/*
 *  Font Loader
 */
const fontLoader  = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json',
(font) => {
            const textGeometry = new TextGeometry('Hi there!',
        {
            font : font,
            size : 0.5,
            height : 0.2,
            curveSegments : 4,
            bevelEnabled : true,
            bevelThickness : 0.02,
            bevelSize : 0.01,
            bevelOffset : 0,
            bevelSegments : 4
        });
        textGeometry.computeBoundingBox();  // Since max and min are vector3 of the
                                            // box bounding the object
    //     textGeometry.translate(
    //     -   (textGeometry.boundingBox.max.x - 0.02) * 0.5,  // 0.02 is subtracted to
    //     -   (textGeometry.boundingBox.max.y - 0.02) * 0.5,  // reduce the bevelSize
    //     -   (textGeometry.boundingBox.max.z - 0.02) * 0.5,  // restricting the text to
    // );                                             // come at the center of the screen

        textGeometry.center();

        // console.log(textGeometry.boundingBox); //Gives the bounding box that decides
        // whether the object has to be rendered or not min isn't zero because of
        // bevelSize and bevelTHickness

        const textMaterial = new THREE.MeshMatcapMaterial({matcap : matcapTexture});
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);
    }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/*
 *  Controls for Debugger
 */

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
