import * as THREE from 'three'
import Stats from 'stats.js'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import simFragmentPosition from "./shaders/simFragment.glsl";
import simFragmentVelocity from "./shaders/simFragmentVelocity.glsl";
import simVertex from "./shaders/simVertex.glsl";

function lerp(a, b, n) {
	return (1 - n) * a + n * b;
}

// Stats Setup
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false })
renderer.setSize(window.innerWidth, window.innerHeight)

const sceneElements = [];
function addScene(elem, fn) {
  sceneElements.push({elem, fn});
}

function makeScene(elem) {
	const scene = new THREE.Scene();
   
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
	camera.position.z = 10
   
	return {scene, camera, elem};
}

const sceneInitFunctionsByName = {
	'scene1' : () => 
	{
		const {scene, camera} = makeScene();

		// Listen to mouse move event
		window.addEventListener('mousemove', onMouseMove, false);

		// Create geometry and material
		const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
		const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#000fff') })

		// Create Hitbox geometry and material
		const hitboxGeometry = new THREE.BoxGeometry(2, 2, 2)
		const hitboxMaterial = new THREE.MeshBasicMaterial({visible: false})

		// Create InstancedMesh
		const instancedMesh = new THREE.InstancedMesh(geometry, material, 100)
		scene.add(instancedMesh)

		// Create HitboxMesh
		const instancedHitboxes = new THREE.InstancedMesh(hitboxGeometry, hitboxMaterial, 100)
		scene.add(instancedHitboxes);
		for (let i = 0; i < 100; i++) 
		{
			let x = (i % 10) - 5;
			let y = Math.floor(i / 10) - 5;
			const tempObject = new THREE.Object3D();
			tempObject.position.set(x, y, 0);
			tempObject.updateMatrix();
			instancedHitboxes.setMatrixAt(i, tempObject.matrix);
		}

		//Instaced Mesh Data
		const rotations = new Array(100).fill(0);
		const rotationSpeed = new Array(100).fill(0);
		const rotationAcceleration = 0.0075;
		const rotationDecay = 0.97;

		// Raycaster setup
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		let hovered = new Set();

		function onMouseMove(event) {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			const intersects = raycaster.intersectObject(instancedHitboxes, true);

			let newHovered = new Set();
			intersects.forEach((intersect) => {
				newHovered.add(intersect.instanceId);
			});

			hovered = newHovered;
		}

		// Clamp Function
		function clamp(value, min, max)
		{
			return Math.min(Math.max(value, min), max);
		}

		// Animation loop
		return () => 
		{
			// May need this
			// camera.updateProjectionMatrix();

			// Update instances
			for (let i = 0; i < 100; i++) {
				let x = (i % 10) - 5;
				let y = Math.floor(i / 10) - 5;
				const tempObject = new THREE.Object3D();
				tempObject.position.set(x, y, 0);

				if (hovered.has(i)) {
					rotationSpeed[i] += rotationAcceleration;
					rotationSpeed[i] = clamp(rotationSpeed[i], 0, 0.085);
				} else {
					rotationSpeed[i] *= rotationDecay; 
				}

				// Update rotation based on speed
				rotations[i] += rotationSpeed[i];
				tempObject.rotation.y = rotations[i];


				tempObject.updateMatrix();
				instancedMesh.setMatrixAt(i, tempObject.matrix);
			}
			instancedMesh.instanceMatrix.needsUpdate = true;
			renderer.render(scene, camera);
		}
	},
	'scene2' : () =>
	{
		const {scene, camera} = makeScene();

		// Listen to mouse move event
		window.addEventListener('mousemove', onMouseMove, false);

		// Create geometry and material
		const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
		const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#000fff') })

		// Create Hitbox geometry and material
		const hitboxGeometry = new THREE.BoxGeometry(2, 2, 2)
		const hitboxMaterial = new THREE.MeshBasicMaterial({visible: false})

		// Create InstancedMesh
		const instancedMesh = new THREE.InstancedMesh(geometry, material, 100)
		scene.add(instancedMesh)

		// Create HitboxMesh
		const instancedHitboxes = new THREE.InstancedMesh(hitboxGeometry, hitboxMaterial, 100)
		scene.add(instancedHitboxes);
		for (let i = 0; i < 100; i++) 
		{
			let x = (i % 10) - 5;
			let y = Math.floor(i / 10) - 5;
			const tempObject = new THREE.Object3D();
			tempObject.position.set(x, y, 0);
			tempObject.updateMatrix();
			instancedHitboxes.setMatrixAt(i, tempObject.matrix);
		}

		//Instaced Mesh Data
		const rotations = new Array(100).fill(0);
		const rotationSpeed = new Array(100).fill(0);
		const rotationAcceleration = 0.0075;
		const rotationDecay = 0.97;

		// Raycaster setup
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		let hovered = new Set();

		function onMouseMove(event) {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			const intersects = raycaster.intersectObject(instancedHitboxes, true);

			let newHovered = new Set();
			intersects.forEach((intersect) => {
				newHovered.add(intersect.instanceId);
			});

			hovered = newHovered;
		}

		// Clamp Function
		function clamp(value, min, max)
		{
			return Math.min(Math.max(value, min), max);
		}

		// Animation loop
		return () => 
		{
			// May need this
			// camera.updateProjectionMatrix();

			// Update instances
			for (let i = 0; i < 100; i++) {
				let x = (i % 10) - 5;
				let y = Math.floor(i / 10) - 5;
				const tempObject = new THREE.Object3D();
				tempObject.position.set(x, y, 0);

				if (hovered.has(i)) {
					rotationSpeed[i] += rotationAcceleration;
					rotationSpeed[i] = clamp(rotationSpeed[i], 0, 0.085);
				} else {
					rotationSpeed[i] *= rotationDecay; 
				}

				// Update rotation based on speed
				rotations[i] += rotationSpeed[i];
				tempObject.rotation.y = rotations[i];


				tempObject.updateMatrix();
				instancedMesh.setMatrixAt(i, tempObject.matrix);
			}
			instancedMesh.instanceMatrix.needsUpdate = true;
			renderer.render(scene, camera);
		}	
	},
	'scene3' : () =>
	{
		const {scene, camera} = makeScene();

		// Listen to mouse move event
		window.addEventListener('mousemove', onMouseMove, false);
		let mouse = new THREE.Vector3( 0, 0, 1);

		const geometry = new THREE.CylinderGeometry(5, 5, 2)
		const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0ff000') })
		const mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = Math.PI * 0.2;
		scene.add(mesh);

		function onMouseMove(event) {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
		}

		return (time, rect) => {
			
			//mesh.rotation.x += 0.1
			mesh.lookAt(mouse)
			renderer.render(scene, camera);
		};
	},
	'scene4' : () =>
	{
		const {scene, camera} = makeScene();

		/**
		 * Model
		 */
		const numInstances = 6;
		const group = new THREE.Group();

		const geometry = new THREE.CylinderGeometry(1, 1, 0.2);
		const material = new THREE.MeshBasicMaterial();

		const instancedMesh = new THREE.InstancedMesh(geometry, material, numInstances);

		group.add(instancedMesh);
		scene.add(group);
		group.rotateX(1.5);
		group.rotateY(1.5);

		// Instancing Position
		const radius = 5;
		for (let i = 0; i < numInstances; i++) {
			const angle = (i / numInstances) * Math.PI;

			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;

			const dummyObject = new THREE.Object3D();
			dummyObject.position.set(x, y, 0);
			dummyObject.lookAt(0, 0, 0);
			dummyObject.rotateX(1.5);

			dummyObject.updateMatrix();
			instancedMesh.setMatrixAt(i, dummyObject.matrix);
		}
		instancedMesh.instanceMatrix.needsUpdate = true;

		/**
		 * Mouse
		 */
		const mouse = new THREE.Vector2();

		document.addEventListener("mousemove", (event) =>
		{
			mouse.x = event.clientX / canvas.offsetWidth * 2 - 1
			mouse.y = - (event.clientY / canvas.offsetHeight) * 2 + 1

		})

		let currentRotation = 0;
		const dampingFactor = 0.025;

		return () => {
			// Update Instance Rotation
			const targetRotation = mouse.y * 0.75;
			currentRotation += (targetRotation - currentRotation) * dampingFactor;
			group.rotation.z = currentRotation;
		
			// Render
			renderer.render(scene, camera)
		};
	}
}

document.querySelectorAll('[data-diagram]').forEach((elem) => {
	const sceneName = elem.dataset.diagram;
	const sceneInitFunction = sceneInitFunctionsByName[sceneName];

	if (typeof sceneInitFunction !== "function") {
    console.error(`No valid initialization function found for scene '${sceneName}'.`);
    return;
  }
	const sceneRenderFunction = sceneInitFunction(elem);
	addScene(elem, sceneRenderFunction);
});

function render(time) {
	time *= 0.001;
   
	stats.begin();

	renderer.setScissorTest(false);
	renderer.clear(true, true);
	renderer.setScissorTest(true);
   
	for (const {elem, fn} of sceneElements) {
		// get the viewport relative position of this element
		const rect = elem.getBoundingClientRect();
		const {left, right, top, bottom, width, height} = rect;
	 
		const isOffscreen =
			bottom < 0 ||
			top > renderer.domElement.clientHeight ||
			right < 0 ||
			left > renderer.domElement.clientWidth;
	 
		if (!isOffscreen) {
		  const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
		  renderer.setScissor(left, positiveYUpBottom, width, height);
		  renderer.setViewport(left, positiveYUpBottom, width, height);
	 
		  fn(time, rect);
		}
	}

	stats.end();
   
	requestAnimationFrame(render);
}

render();