import * as THREE from "three";
import Experience from "./Experience.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  // Internal Functions
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.setSize(this.sizes.width, this.sizes.height, false);
  }

  // External Functions
  resize() {
    this.instance.setSize(this.sizes.width / this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  // update() {
  //   this.resize();
  // }
}
