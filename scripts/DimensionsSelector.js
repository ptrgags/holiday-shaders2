const MODE_2D = 0;
const MODE_3D = 1;

class DimensionsSelector {
    constructor(viewer_2d, viewer_3d) {
        this.viewers = [viewer_2d, viewer_3d];
        this.viewer_index = MODE_2D;
    }

    setup() {
        this.viewers.map((x) => x.setup());

        // Change the number of dimensions with the 2D and 3D buttons
        $("#mode-2d").click(() => this.viewer_index = MODE_2D);
        $("#mode-3d").click(() => this.viewer_index = MODE_3D);
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
