import * as THREE from 'three'
import Stats from 'stats.js'

// Stats Setup
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

const canvas = document.querySelector("canvas.webgl")

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false })
renderer.setSize(window.innerWidth, window.innerHeight)

function makeScene(elem) {
	const scene = new THREE.Scene();
   
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
	camera.position.z = 5
   
	return {scene, camera, elem};
}

function setupScene1() {
	const sceneInfo = makeScene(document.querySelector('#scene1'));
	const s1geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
	const s1material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff0000') })
	const s1mesh = new THREE.Mesh(s1geometry, s1material);
	sceneInfo.scene.add(s1mesh);
	sceneInfo.mesh = s1mesh;
	return sceneInfo;
}
function setupScene2() {
	const sceneInfo = makeScene(document.querySelector('#scene2'));
	const s2geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
	const s2material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#00ff00') })
	const s2mesh = new THREE.Mesh(s2geometry, s2material);
	sceneInfo.scene.add(s2mesh);
	sceneInfo.mesh = s2mesh;
	return sceneInfo;
}
function setupScene3() {
	const sceneInfo = makeScene(document.querySelector('#scene3'));
	const s3geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
	const s3material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0000ff') })
	const s3mesh = new THREE.Mesh(s3geometry, s3material);
	sceneInfo.scene.add(s3mesh);
	sceneInfo.mesh = s3mesh;
	return sceneInfo;
}

const sceneInfo1 = setupScene1();
const sceneInfo2 = setupScene2();
const sceneInfo3 = setupScene3();

function renderSceneInfo(sceneInfo) {
    const {scene, camera, elem} = sceneInfo;

    // First, ensure that 'renderer' is accessible here. It should be the Three.js renderer instance.
    // Now, get the bounding rectangle of the canvas (renderer's DOM element)
    const canvasRect = renderer.domElement.getBoundingClientRect();

    // get the viewport relative position of this element
    const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();

    const isOffscreen =
        bottom < 0 ||
        top > renderer.domElement.clientHeight ||
        right < 0 ||
        left > renderer.domElement.clientWidth;

    if (isOffscreen) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left - canvasRect.left, positiveYUpBottom, width, height);
    renderer.setViewport(left - canvasRect.left, positiveYUpBottom, width, height);

    renderer.render(scene, camera);
}

function render(time) {
	//time *= 0.001;
   
	stats.begin();

	renderer.setScissorTest(false);
	renderer.clear(true, true);
	renderer.setScissorTest(true);
   
	// sceneInfo1.mesh.rotation.y = time * .1;
	// sceneInfo2.mesh.rotation.y = time * .1;
   
	renderSceneInfo(sceneInfo1);
	renderSceneInfo(sceneInfo2);
	renderSceneInfo(sceneInfo3);

	stats.end();
   
	requestAnimationFrame(render);
}

render();