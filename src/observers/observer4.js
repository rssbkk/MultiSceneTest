import * as THREE from 'three'
import Stats from 'stats.js'

import vertexShader from './shaders/basic/vertex.glsl';
import fragmentShader from './shaders/basic/fragment.glsl';
import simulationVertex from './shaders/simulation/simulationVertex.glsl';
import simulationFragment from './shaders/simulation/simulationFragment.glsl';

import texture1 from '/OKTO.png';

function lerp(a, b, n) {
	return (1 - n) * a + n * b;
}

const loadImage = path => 
{
    return new Promise((resolve, reject) => 
    {
        const image = new Image();
        image.crossOrigin = 'Annonymous';
        image.src = path;
        image.onload = () =>
        {
            resolve(image)
        }
        image.onerror = e => 
        {
            reject(e)
        }
    })
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
	'scene1' : class {
			constructor() {
				// Properties
				this.mouse = new THREE.Vector3(0, 0, 1);
		
				// Scene setup
				const { scene, camera } = this.makeScene();
				this.scene = scene;
				this.camera = camera;
		
				// Geometry setup
				this.mesh = this.createGeometry();
		
				// Event listener for mouse movement
				window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
			}
		
			makeScene() {
				// Assuming makeScene is a function that returns {scene, camera}
				// You need to implement or adjust this part according to your actual setup
				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
				camera.position.z = 5;
		
				// Your actual scene and camera setup goes here
		
				return { scene, camera };
			}
		
			createGeometry() {
				const geometry = new THREE.CylinderGeometry(5, 5, 2);
				const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0ff000') });
				const mesh = new THREE.Mesh(geometry, material);
				mesh.rotation.x = Math.PI * 0.2;
				this.scene.add(mesh);
		
				return mesh;
			}
		
			onMouseMove(event) {
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			}
		
			render(time, rect) {
				// Example update - here you can use time and rect if needed
				this.mesh.lookAt(this.mouse);
				renderer.render(this.scene, this.camera);
			}
		}
}

document.querySelectorAll('[data-diagram]').forEach((elem) => {
	const sceneName = elem.dataset.diagram;
	const sceneInitFunction = sceneInitFunctionsByName[sceneName];

	if (typeof sceneInitFunction !== "function") {
    console.error(`No valid initialization function found for scene '${sceneName}'.`);
    return;
  }
	const sceneRenderFunction = new sceneInitFunction(elem);
	addScene(elem, sceneRenderFunction);
});

function render(time) {
	time *= 0.001;
   
	stats.begin();

	renderer.setScissorTest(false);
	renderer.clear(true, true);
	renderer.setScissorTest(true);
   
	for (const {elem, foo} of sceneElements) {
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

		  foo.render()
		}
	}

	stats.end();
   
	requestAnimationFrame(render);
}

render();