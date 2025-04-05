import * as THREE from 'three';
import '/style/style.css';
import gsap from "node-modules/gsap";
import {OrbitControls} from 'node-modules/three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'node-modules/three/examples/jsm/loaders/OBJLoader.js';

// Texture Loader
//const loader = new THREE.TextureLoader()
//const star = loader.load('./assets/glowing_star.png')
//<a href='https://pngtree.com/so/white'>white png from pngtree.com/</a>

//Scene
const scene = new THREE.Scene();

//Create our sphere
 const geometry = new THREE.SphereGeometry(3, 74, 74);

 const particlesGeometry = new THREE.BufferGeometry;
 const particlesCnt = 5000;

 const posArray = new Float32Array(particlesCnt * 3); //xyz, xyz, xyz, xyz

for(let i = 0; i < particlesCnt * 3; i++) {
  //posArray[i] = Math.random()
  //posArray[i] = Math.random() - 0.5
  posArray[i] = (Math.random() - 0.5) * 15
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

//Material
const material = new THREE.PointsMaterial({
  size: 0.02
})

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02
  //map: star,
  //transparent: true,
  //blending: THREE.AdditiveBlending
})

//Mesh
const mesh = new THREE.Points(geometry, material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(mesh, particlesMesh)

// Load Model
const objloader = new OBJLoader();
objloader.load(
  '/assets/tree.obj', 
  function ( object ) {
    scene.add( object );
  },
  // called when loading is in progress
  function (xhr) {
    console.log((xhr.loaded / xhr.total*100)+'% loaded');
    },
      // called when loading has errors
    function (error) {
      console.log('An error happened');
    }
  );

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
light.intensity = 1.25
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)//closest dist0.1,furthest100
camera.position.z = 10
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#303030'), 1) //color&opacity
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true //slow down movement
controls.enablePan = false
controls.enableZoom = true
controls.autoRotate = true
controls.autoRotateSpeed = 1

//Resize
window.addEventListener('resize', () => {
  //Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //Update Camera
  camera.aspect = sizes.width / sizes. height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes. height)
})

const loop = () => {
  //mesh.position.x += 0.1 //use delta time for consistent speed
  controls.update() //keeps animating
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, { z: 1, x: 1, y: 1})
tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })


//Mouse Animation Color
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    //Let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`) //new THREE.Color(`rgb(0,100,150)`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})

