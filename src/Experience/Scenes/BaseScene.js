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

  applyScissor(position) {
    this.renderer.instance.setViewport(
      position.left,
      position.bottom,
      position.width,
      position.height,
    );

    this.renderer.instance.setScissor(
      position.left,
      position.bottom,
      position.width,
      position.height,
    );
  }

  update(time, deltaTime) {
    const { position, isOffscreen } = this.computeScenePosition();

    if (isOffscreen) return;

    this.applyScissor(position);

    this.renderer.instance.render(this.scene, this.camera);

    this.updateScene();
  }

  updateScene()
  {
    throw new Error(
        `BaseScene chidlren class: ${this.id} does not implement updateScene method.`
    )
  }
}