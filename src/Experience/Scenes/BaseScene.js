import Experience from "../Experience";

export default class BaseScene {
    constructor(_options)
    {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.renderer = this.experience.renderer;

        this.id = _options.sceneId;
        this.elem = _options.elem;

    }

    update()
    {
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.05
        this.renderer.instance.render( this.scene, this.camera );
    }
}