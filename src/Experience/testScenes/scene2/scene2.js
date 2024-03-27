import * as THREE from 'three'
import Experience from '../../Experience.js';


export default class Scene2
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;

        this.mouse = new THREE.Vector3( 0, 0, 1);

        this.createGeometry();
        this.mouseEvent();
    }
       

    createGeometry() {
        const geometry = new THREE.CylinderGeometry(5, 5, 2);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0ff000') });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI * 0.2;
        this.scene.add(this.mesh);
    }

    mouseEvent() {
        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
		})
    }

    update() {
        this.mesh.lookAt(this.mouse);
    }
}