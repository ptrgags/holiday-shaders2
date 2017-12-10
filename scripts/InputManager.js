class InputManager {
    constructor() {
        this.attach_callbacks();
    }

    attach_callbacks() {
        $(document).mousemove((x) => this.update_mouse(x))
    }

    update_mouse(event) {
        let canvas_pos = $('#screen').offset();
        let height = $('#screen').height();
        let canvas = new THREE.Vector2(canvas_pos.left, canvas_pos.top);
        let mouse = new THREE.Vector2(event.pageX, event.pageY);
        let offset = new THREE.Vector2().subVectors(mouse, canvas);
        offset.setY(height - offset.y);

        MESSENGER.publish('mouse', offset);
    }
}
