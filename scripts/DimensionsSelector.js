class DimensionsSelector {
    constructor(viewer_2d) {
        this.viewers = [viewer_2d];
        this.viewer_index = 0;
    }

    setup() {
        this.viewers.map((x) => x.setup());
    }

    get current_viewer() {
        return this.viewers[this.viewer_index];
    }

    get current_scene() {
        return this.current_viewer.scene;
    }

    get current_camera() {
        return this.current_viewer.camera;
    }

    on_new_frame() {
        this.current_viewer.on_new_frame();
    }
}
