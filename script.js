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

const light = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

function loadModel(path) {
    loader.load(path, function(gltf) {
        const track = gltf.scene.children[0];
        const group = new THREE.Group();
        console.log(track);
        track.children.forEach(child => {
            group.add(
                new THREE.Mesh(
                    child.geometry, 
                    new THREE.MeshPhongMaterial({ color: child.material.color })
                )
            );
        });

        group.position.set(
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 10
        );

        scene.add(group);
        
    }, undefined, function(error) {
        console.error(error);
    });
}

fetch("res/all_models.txt")
    .then(response => response.text())
    .then(text => {
        let models = text.split("\n");
        models = [ models[0] ];
        models.forEach(model => {
            loadModel('res/' + model);
        });
    })
    .catch(error => {
        console.error(error);
    });


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();