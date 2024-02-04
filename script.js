import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const dlShadow = new THREE.WebGLRenderer();
dlShadow.shadowMap.enabled = true;
dlShadow.shadowMap.type = THREE.PCFSoftShadowMap;
const directionalLight = new THREE.DirectionalLight(0xffffff,3.7);
directionalLight.position.set(55,25,25);
directionalLight.castShadow = true;
scene.add(directionalLight);
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.camera.near = .5;
directionalLight.shadow.camera.far = 500;

// directionalLight.target.updateMatrixWorld();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x660066));
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;




function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
function loadModel(path) {
    loader.load(path, function(gltf) {
        const track = gltf.scene.children[0];
        const group = new THREE.Group();
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

class trackPiece {
    constructor(name) {
       this.name = name;
       loadModel(this.name);
    }
 }

fetch("res/all_models.txt")
    .then(response => response.text())
    .then(text => {
        let models = text.split("\n");
        // models = [ models[0] ];
        models.forEach(model => {
            new trackPiece('res/' + model);
        });
    })
    .catch(error => {
        console.error(error);
    });
