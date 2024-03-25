import * as THREE from 'three'
import Experience from '../../Experience.js';


export default class Scene3
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.makeScene();
    }

    makeScene() 
    {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 'orange'});
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
    }
}