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
        const rect = this.elem.getBoundingClientRect();
        const { left, right, top, bottom, width, height } = rect;

        const isOffscreen =
        bottom < 0 ||
        top > this.sizes.height ||
        right < 0 ||
        left > this.sizes.width;

        if (!isOffscreen) {
            const positiveYUpBottom = this.sizes.height - bottom;

            this.renderer.instance.setScissor(left, positiveYUpBottom, width, height);

            this.renderer.instance.setViewport(
                left,
                positiveYUpBottom,
                width,
                height,
            );
            
            // // this can log each of the renderer, scene and camera
            // console.log(this.renderer , "from the base Scene");

            this.mesh.rotation.x += 0.01
            this.mesh.rotation.y += 0.05

            this.renderer.instance.render( this.scene, this.camera );
        }
    }
}