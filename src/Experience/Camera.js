import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from "./Experience.js";

export default class Camera
{
    constructor()
    {
        // Setup
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setOrbitControls();
    }

    // Internal Functions
    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera( 
            fov , 
            this.sizes.width / this.sizes.height,
            near ,
            far
        );
        this.instance.position.set( 6, 4, 8 );
        this.scene.add(this.instance);
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls( this.instance, this.canvas );
        this.controls.enableDamping = true;
    }

    // External Functions
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update()
    {
        this.controls.update();
    }
}