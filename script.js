import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const directionalLight = new THREE.DirectionalLight(0xffffff, 3.7);
directionalLight.position.set(55, 25, 25);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = .1;
directionalLight.shadow.camera.far = 1000;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x131313));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

const stats = new Stats();
stats.showPanel(1);
document.body.appendChild(stats.dom);

function loadModel(path) {
    loader.load(path, function (gltf) {

        const group = new THREE.Group();
        gltf.scene.children[0].children.forEach(child => {
            let color = child.material.color;
            if (color.r === 1 && color.g === 1 && color.b === 1) {
                // Weird pieces
            } else {
                const mesh = new THREE.Mesh(
                    child.geometry,
                    new THREE.MeshPhongMaterial({ color: color, wireframe: true })
                );
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                if (color.r === 0.2796306) {
                    // Track color
                    // color = 0x2d0000;
                    return;
                }
                else if (color.r === 0.6242308) {
                    // Groove color
                }

                group.add(mesh);

            }
        });

        group.position.set(
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 10
        );

        scene.add(group);

    }, undefined, function (error) {
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

function animate() {
    stats.begin();
    controls.update();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
}
animate();

