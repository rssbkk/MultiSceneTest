import Experience from "./Experience";
import SceneFactory from "./SceneFacrory";

export default class SceneProcessor {
  #scenes = [];

  constructor() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    document.querySelectorAll("[data-diagram]").forEach((elem) => {
      const sceneId = elem.dataset.diagram;

      const sceneOptions = {
        sceneId,
        elem,
      };

      this.#scenes.push(SceneFactory.create(sceneOptions));
    });

    console.log("All scens mounted", this.#scenes);
  }

  update() {
    // this.renderer.instance.setScissorTest(false);
    // this.renderer.instance.clear(true, true);
    // this.renderer.instance.setScissorTest(true);

    this.renderer.instance.setClearColor(0xffffff);
    this.renderer.instance.setScissorTest(false);
    this.renderer.instance.clear();

    this.renderer.instance.setClearColor(0xff00ff);
    this.renderer.instance.setScissorTest(true);

    // Update all scenes
    this.#scenes.forEach((scene) => {
      scene.update();
    });
  }
}
