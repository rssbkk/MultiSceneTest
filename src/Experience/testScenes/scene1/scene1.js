import * as THREE from 'three'
import Experience from '../../Experience.js';

export default class Scene1
{
    constructor()
    {

        this.clamp = (value, min, max) =>
		{
			return Math.min(Math.max(value, min), max);
		}

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;

        this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.hovered = new Set();

        this.rotations = new Array(100).fill(0);
		this.rotationSpeed = new Array(100).fill(0);
		this.rotationAcceleration = 0.0075;
		this.rotationDecay = 0.97;

        this.createVisualGeometry();
        this.createHitboxGeometry();
        this.mouseEvent();
    }
       

    createVisualGeometry()
    {
		const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
		const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#000fff') })
        this.instancedMesh = new THREE.InstancedMesh(geometry, material, 100)
		this.scene.add(this.instancedMesh)
    }

    createHitboxGeometry()
    {
        const hitboxGeometry = new THREE.BoxGeometry(2, 2, 2)
		const hitboxMaterial = new THREE.MeshBasicMaterial({visible: false})
		this.instancedHitboxes = new THREE.InstancedMesh(hitboxGeometry, hitboxMaterial, 100)
		this.scene.add(this.instancedHitboxes);

		for (let i = 0; i < 100; i++) 
		{
			let x = (i % 10) - 5;
			let y = Math.floor(i / 10) - 5;
			const tempObject = new THREE.Object3D();
			tempObject.position.set(x, y, 0);
			tempObject.updateMatrix();
			this.instancedHitboxes.setMatrixAt(i, tempObject.matrix);
		}
    }

    mouseEvent() 
    {
        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    
            const intersects = this.raycaster.intersectObject(this.instancedHitboxes, true);
    
            let newHovered = new Set();
            intersects.forEach((intersect) => {
                newHovered.add(intersect.instanceId);
            });
            this.hovered = newHovered;
        })
    }

    update()
    {
        // Update instances
        for (let i = 0; i < 100; i++) {
            let x = (i % 10) - 5;
            let y = Math.floor(i / 10) - 5;
            const tempObject = new THREE.Object3D();
            tempObject.position.set(x, y, 0);

            if (this.hovered.has(i)) {
                this.rotationSpeed[i] += this.rotationAcceleration;
                this.rotationSpeed[i] = this.clamp(this.rotationSpeed[i], 0, 0.085);
            } else {
                this.rotationSpeed[i] *= this.rotationDecay; 
            }

            // Update rotation based on speed
            this.rotations[i] += this.rotationSpeed[i];
            tempObject.rotation.y = this.rotations[i];


            tempObject.updateMatrix();
            this.instancedMesh.setMatrixAt(i, tempObject.matrix);
        }
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }
}