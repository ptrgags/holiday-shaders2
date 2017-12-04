class ShaderRenderer {
    constructor(scene_selector) {
        // TODO: This will be overwritten with the ResolutionManager
        this.width = 200;
        this.height = 200;

        this.scene_selector = scene_selector;

        this.renderer = new THREE.WebGLRenderer({canvas: $('#screen')[0]});
        this.renderer.setSize(this.width, this.height);
    }

    setup() {
        this.render();
    }

    render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(
            this.scene_selector.current_scene,
            this.scene_selector.current_camera);

        // Update the scenes and the shader material
        // by sending a message down the tree. This is done
        // synchronously so the Messenger is not used.
        // TODO: Will the messenger work? might be a frame behind
        // but as long as it's consistent...
        this.scene_selector.on_new_frame();
    }
}
