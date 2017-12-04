class DimensionsSelector {
    constructor(viewer_2d) {
        this.viewers = [viewer_2d];
        this.current_viewer = 0;
    }

    setup() {
        this.viewers.map((x) => x.setup());
    }

    get current_scene() {
        return this.viewers[this.current_viewer].scene;
    }
}
