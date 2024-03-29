import Experience from "../Experience";

export default class BaseScene {
  constructor(_options) {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.renderer = this.experience.renderer;

    this.id = _options.sceneId;
    this.elem = _options.elem;
  }

  computeScenePosition() {
    const rect = this.elem.getBoundingClientRect();
    const {
      top,
      right,
      bottom: rectBottom,
      left: rectLeft,
      width,
      height,
    } = rect;

    const isOffscreen =
      rectBottom < 0 ||
      top > this.sizes.height ||
      right < 0 ||
      rectLeft > this.sizes.width;

    const bottom = this.sizes.height - rectBottom;

    return {
      position: {
        width,
        height,
        left: rectLeft,
        top,
        bottom,
        right,
      },
      isOffscreen,
    };
  }

  update() {
    const { position, isOffscreen } = this.computeScenePosition();

    if (isOffscreen) return;

    this.renderer.instance.setScissor(
      position.left,
      position.bottom,
      position.width,
      position.height,
    );

    this.renderer.instance.setViewport(
      position.left,
      position.bottom,
      position.width,
      position.height,
    );

    // this can log each of the renderer, scene and camera
    // console.log(this.renderer , "from the base Scene");

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.05;

    this.renderer.instance.render(this.scene, this.camera);
  }
}
