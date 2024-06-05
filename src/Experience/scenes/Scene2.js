import * as THREE from "three";
import Experience from "../Experience";
import BaseScene from "./BaseScene.js";

export default class Scene2 extends BaseScene {
  constructor(_options) {
    super(_options);

    console.log("Scene2 mounted", _options);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    );
    this.camera.position.z = 5;

    this.createMesh();
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#0ff000"),
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  updateScene() {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.05;
  }

  destroy() {}

  resize() {}
}
