import * as THREE from 'three';
import Sizes from "./utils/Sizes.js";
import Time from "./utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';

import SceneProcessor from './SceneProcessor.js';

let instance = null;

export default class Experience
{
    constructor(canvas)
    {
        if(instance)
        {
            return instance;
        }
        
        instance = this;

        // Global Access
        window.experience = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.sizes = new Sizes();
        this.time = new Time();
        // this.scene = new THREE.Scene();
        // this.camera = new Camera();
        this.renderer = new Renderer();

        // Test Parts
        this.SceneProcessor = new SceneProcessor();

        // Sizes Resize Event
        this.sizes.on('resize', ()=>
        {
            this.resize();
        })

        // Time Tick Event
        this.time.on('tick', ()=>
        {
            this.update();
        })
    }

    resize()
    {
        this.camera.resize();
        this.renderer.resize();
    }

    update() // Order May Matter
    {
        this.SceneProcessor.update();
    }
}