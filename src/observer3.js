import * as THREE from 'three'
import Stats from 'stats.js'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import simFragmentPosition from "./shaders/simFragment.glsl";
import simFragmentVelocity from "./shaders/simFragmentVelocity.glsl";
import simVertex from "./shaders/simVertex.glsl";

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
			camera.updateProjectionMatrix();

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
		const size = 1024;
		const number = size * size;
		const {scene, camera} = makeScene();
		
		let width = canvas.offsetWidth;
		let height = canvas.offsetHeight;
		
		// this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		const loader = new GLTFLoader();
		const _position = new THREE.Vector3();
		function setupSettings()
			Promise.all([
			loader.loadAsync(suzanne),
			]).then(([model]) => {
			const suzanne = model.scene.children[0]
			this.suzanne.geometry.rotateX(-Math.PI/2)
			this.suzanne.material = new THREE.MeshBasicMaterial()
			
			this.sampler = new MeshSurfaceSampler( this.suzanne )
			.build();
		
			// this.scene.add(this.suzanne)
			this.data1 = this.getPointsOnSphere()
			this.data2 = this.getPointsOnSphere()
			this.getPixelDataFromImage(t1)
			this.mouseEvents()
			this.setupFBO()
			this.initGPGPU();
			this.addObjects();
			this.setupResize();
			this.render();
			})
			
		}
		
		
		
		setupSettings(){
			this.settings = {
			progress: 0
			}
		
			this.gui = new GUI();
			this.gui.add(this.settings, 'progress', 0, 1, 0.01).onChange(val=>{
			this.simMaterial.uniforms.uProgress.value = val
			})
		
		}
		
		getVelocitiesOnSphere(){
			const data = new Float32Array(4 * this.number);
			for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const index = i * this.size + j;
		
				// generate point on a sphere
				let theta = Math.random() * Math.PI * 2;
				let phi = Math.acos(Math.random() * 2 - 1); // 
				// let phi = Math.random()*Math.PI; // 
				let x = Math.sin(phi) * Math.cos(theta);
				let y = Math.sin(phi) * Math.sin(theta);
				let z = Math.cos(phi);
				
				data[4 * index] = 0;
				data[4 * index + 1] = 0;
				data[4 * index + 2] = 0;
				data[4 * index + 3] = 0;
			}
			}
		
			let dataTexture = new THREE.DataTexture(
			data,
			this.size,
			this.size,
			THREE.RGBAFormat,
			THREE.FloatType
			);
			dataTexture.needsUpdate = true;
		
			return dataTexture
		}

		getPointsOnSphere(){
			const data = new Float32Array(4 * this.number);
			for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const index = i * this.size + j;
		
				// generate point on a sphere
				let theta = Math.random() * Math.PI * 2;
				let phi = Math.acos(Math.random() * 2 - 1); // 
				// let phi = Math.random()*Math.PI; // 
				let x = Math.sin(phi) * Math.cos(theta);
				let y = Math.sin(phi) * Math.sin(theta);
				let z = Math.cos(phi);
				
				data[4 * index] = x;
				data[4 * index + 1] = y;
				data[4 * index + 2] = z;
				data[4 * index + 3] = (Math.random()-0.5)*0.01;
			}
			}
			
		
			let dataTexture = new THREE.DataTexture(
			data,
			this.size,
			this.size,
			THREE.RGBAFormat,
			THREE.FloatType
			);
			dataTexture.needsUpdate = true;
		
			return dataTexture
		}
		
		getPointsOnSuzanne(){
			const data = new Float32Array(4 * this.number);
			for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const index = i * this.size + j;
		
				this.sampler.sample( this._position );
				
				data[4 * index] = this._position.x;
				data[4 * index + 1] = this._position.y;
				data[4 * index + 2] = this._position.z;
				data[4 * index + 3] = (Math.random()-0.5)*0.01;
			}
			}
			
		
			let dataTexture = new THREE.DataTexture(
			data,
			this.size,
			this.size,
			THREE.RGBAFormat,
			THREE.FloatType
			);
			dataTexture.needsUpdate = true;
		
			return dataTexture
		}
		
		mouseEvents(){
			const raycasterMesh = new THREE.Mesh(
				suzanne.geometry,
				new THREE.MeshBasicMaterial()
			)
			const dummy = new THREE.Mesh(
				new THREE.SphereGeometry(0.01, 32, 32),
				new THREE.MeshNormalMaterial()
			)
			scene.add(this.dummy)
			window.addEventListener("mousemove", (e) => {
			this.pointer.x = (e.clientX / this.width) * 2 - 1;
			this.pointer.y = -(e.clientY / this.height) * 2 + 1;
			this.raycaster.setFromCamera( this.pointer, this.camera );
		
			const intersects = this.raycaster.intersectObjects( [this.raycasterMesh] );
				if (intersects.length > 0) {
					// console.log(intersects[0].point)
					this.dummy.position.copy(intersects[0].point)
					this.simMaterial.uniforms.uMouse.value = intersects[0].point
					this.positionUniforms.uMouse.value = intersects[0].point
					this.velocityUniforms.uMouse.value = intersects[0].point
				}
			});
		}
		
		setupResize() {
			window.addEventListener("resize", this.resize.bind(this));
		}
		
		
		initGPGPU(){
			this.gpuCompute = new GPUComputationRenderer( this.size, this.size, this.renderer );
		
			this.pointsOnASphere = this.getPointsOnSuzanne()
		
			this.positionVariable = this.gpuCompute.addVariable( 'uCurrentPosition', simFragmentPosition, this.pointsOnASphere);
			this.velocityVariable = this.gpuCompute.addVariable( 'uCurrentVelocity', simFragmentVelocity, this.getVelocitiesOnSphere() );
		
			this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable,this.velocityVariable ] );
		
			this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable,this.velocityVariable ] );
		
			this.positionUniforms = this.positionVariable.material.uniforms;
			this.velocityUniforms = this.velocityVariable.material.uniforms;
		
			this.positionUniforms.uTime = { value: 0.0 };
			this.velocityUniforms.uTime = { value: 0.0 };
			this.positionUniforms.uMouse = { value: new THREE.Vector3(0,0,0) };
			this.velocityUniforms.uMouse = { value: new THREE.Vector3(0,0,0) };
			this.positionUniforms.uOriginalPosition = { value: this.pointsOnASphere };
			this.velocityUniforms.uOriginalPosition = { value: this.pointsOnASphere };
		
			this.gpuCompute.init();
		
		
		}
		
		setupFBO(){
			
		
			// create data Texture
			const data = new Float32Array(4 * this.number);
			for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const index = i * this.size + j;
				data[4 * index] = lerp(-0.5, 0.5, j / (this.size - 1));
				data[4 * index + 1] = lerp(-0.5, 0.5, i / (this.size - 1));
				data[4 * index + 2] = 0;
				data[4 * index + 3] = 1;
			}
			}
		
			this.positions = new THREE.DataTexture(
			data,
			this.size,
			this.size,
			THREE.RGBAFormat,
			THREE.FloatType
			);
			this.positions.needsUpdate = true;
		
			// create FBO scene
			this.sceneFBO = new THREE.Scene();
			this.cameraFBO = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);
			this.cameraFBO.position.z = 1;
			this.cameraFBO.lookAt(new THREE.Vector3(0,0,0));
		
			let geo = new THREE.PlaneGeometry(2,2,2,2);
			this.simMaterial = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				wireframe: true
			})
			this.simMaterial = new THREE.ShaderMaterial({
				uniforms: {
					time: { value: 0 },
					uMouse: { value: new THREE.Vector3(0,0,0) },
					uProgress: { value: 0 },
					uTime: { value: 0 },
					uCurrentPosition: { value: this.data1 },
					uOriginalPosition: { value: this.data1 },
					uOriginalPosition1: { value: this.data2 },
				},
				vertexShader: simVertex,
				fragmentShader: simFragmentPosition,
			})
			this.simMesh = new THREE.Mesh(geo, this.simMaterial);
			this.sceneFBO.add(this.simMesh);
		
			this.renderTarget = new THREE.WebGLRenderTarget(this.size, this.size, {
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter,
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
			})
		
			this.renderTarget1 = new THREE.WebGLRenderTarget(this.size, this.size, {
				minFilter: THREE.NearestFilter,
				magFilter: THREE.NearestFilter,
				format: THREE.RGBAFormat,
				type: THREE.FloatType,
			})
		}
		
		resize() {
			this.width = this.container.offsetWidth;
			this.height = this.container.offsetHeight;
		
			this.renderer.setSize(this.width, this.height);
			this.camera.aspect = this.width / this.height;
		
			this.camera.updateProjectionMatrix();
		}
		
		addObjects() {
			
			this.geometry = new THREE.BufferGeometry();
			const positions = new Float32Array(this.number * 3);
			const uvs = new Float32Array(this.number * 2);
			for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				const index = i * this.size + j;
		
				positions[3 * index] = j / this.size - 0.5;
				positions[3 * index + 1] = i / this.size - 0.5;
				positions[3 * index + 2] = 0;
				uvs[2 * index] = j / (this.size - 1);
				uvs[2 * index + 1] = i / (this.size - 1);
			}
			}
			this.geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
			);
			this.geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
		
			this.material = new THREE.MeshNormalMaterial();
		
			
		
			this.material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 },
				// uTexture: { value: new THREE.TextureLoader().load(texture) },
				uTexture: { value: this.positions },
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			depthWrite: false,
			depthTest: false,
			transparent: true,
			});
		
			this.mesh = new THREE.Points(this.geometry, this.material);
			this.scene.add(this.mesh);
		}
		
		return () => 
		{
			this.time += 0.05;
		
			this.material.uniforms.time.value = this.time;
		
			this.gpuCompute.compute();
			this.renderer.render(this.scene, this.camera);
		
		
			this.material.uniforms.uTexture.value = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture;
			this.positionUniforms.uTime.value = this.time;
		
		
			window.requestAnimationFrame(this.render.bind(this));
		}
	},
	'scene3' : () =>
	{
		const {scene, camera} = makeScene();
		const s3geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
		const s3material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0000ff') })
		const s3mesh = new THREE.Mesh(s3geometry, s3material);
		scene.add(s3mesh);
		return (time, rect) => {
			camera.aspect = rect.width / rect.height;
			camera.updateProjectionMatrix();
			s3mesh.rotation.y = time * .1;
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