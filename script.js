import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x660066));
document.body.appendChild(renderer.domElement);

// const light = new THREE.AmbientLight(0x404040);
// scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

function loadModel(path) {
    loader.load(path, function(gltf) {
        const track = gltf.scene.children[0];
        const main_obj = track.children[0];
        const rail_obj = track.children[1];
    
        const main = new THREE.Mesh(
            main_obj.geometry, 
            new THREE.MeshBasicMaterial({ color: main_obj.material.color})
        );
        scene.add(main);
    
        const rail = new THREE.Mesh(
            rail_obj.geometry, 
            new THREE.MeshBasicMaterial({ color: rail_obj.material.color})
        );
        scene.add(rail);
        
    }, undefined, function(error) {
        console.error(error);
    });
}

loadModel('res/helix_large_left.glb');


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();