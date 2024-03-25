import * as THREE from 'three'

// Setup the scene, camera, and renderer
const canvas = document.querySelector('canvas.webgl')
const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()
const scene3 = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false })
renderer.setSize(window.innerWidth, window.innerHeight)

// Create geometry and material scene 1
const s1geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
const s1material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff0000') })
const s1mesh = new THREE.Mesh(s1geometry, s1material);
scene1.add(s1mesh);

// Create geometry and material scene 2
const s2geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
const s2material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#000fff') })
const s2mesh = new THREE.Mesh(s2geometry, s2material);
scene2.add(s2mesh);

// Create geometry and material scene 3
const s3geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
const s3material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#00ff00') })
const s3mesh = new THREE.Mesh(s3geometry, s3material);
scene3.add(s3mesh);

let renderOut = null;
let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
    	// Element is entering the viewport
    	renderOut = entry.target.id;
    	// console.log(renderOut);

    } else {
      // Element is leaving the viewport
      // console.log(entry.target.id + 'out');
      renderOut = 0;
    }
  });
});

document.querySelectorAll('.scene').forEach(item => {
  observer.observe(item);
});

function animate()
{
	requestAnimationFrame(animate);

	if (renderOut === 'scene1') {
		renderer.render(scene1, camera);
	} else if (renderOut === 'scene2') {
		renderer.render(scene2, camera);
	} else if (renderOut === 'scene3') {
		renderer.render(scene3, camera);
	} else {
		console.log('Eilidh Smells');
	}
}

animate();