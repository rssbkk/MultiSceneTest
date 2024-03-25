import * as THREE from 'three'
import Stats from 'stats.js'

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
	camera.position.z = 5
   
	return {scene, camera, elem};
}

const sceneInitFunctionsByName = {
	'scene1' : () => 
	{
		const {scene, camera} = makeScene();
		const s1geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
		const s1material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff0000') })
		const s1mesh = new THREE.Mesh(s1geometry, s1material);
		scene.add(s1mesh);
		return (time, rect) => {
			camera.aspect = rect.width / rect.height;
			camera.updateProjectionMatrix();
			s1mesh.rotation.y = time * .1;
			renderer.render(scene, camera);
		};
	},
	'scene2' : () =>
	{
		const {scene, camera} = makeScene();
		const s2geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
		const s2material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#00ff00') })
		const s2mesh = new THREE.Mesh(s2geometry, s2material);
		scene.add(s2mesh);
		return (time, rect) => {
			camera.aspect = rect.width / rect.height;
			camera.updateProjectionMatrix();
			s2mesh.rotation.y = time * .1;
			renderer.render(scene, camera);
		};
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