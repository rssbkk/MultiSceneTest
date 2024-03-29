import Scene1 from "./scenes/Scene1.js";
import Scene2 from "./scenes/Scene2.js";
import Scene3 from "./scenes/Scene3.js";

export default class SceneFactory {
  // Private static field
  static #mapSceneToClass = {
    scene1: Scene1,
    scene2: Scene2,
    scene3: Scene3,
  };

  /**
   * @param {{sceneId: string, elem: HTMLElement}} _options
   */

  static create(_options) {
    const SceneClass = this.#mapSceneToClass[_options.sceneId];

    if (SceneClass) return new SceneClass(_options);
    else throw new Error(`Invalid scene: ${_options.sceneId}`);
  }
}
