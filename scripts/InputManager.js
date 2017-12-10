class InputManager {
    constructor() {
        this.attach_callbacks();
        this.keyboard_buffer = new Array(32).fill(0.0);
    }

    attach_callbacks() {
        $(document).mousemove((x) => this.update_mouse(x))
        $(document).keyup((x) => this.update_keyboard(x.which))
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

    update_keyboard(key_code) {
        const KEY_LOWER_A = 97;
        const KEY_LOWER_Z = 122;
        const KEY_UPPER_A = 65;
        const KEY_UPPER_Z = 90;
        const KEY_LEFT = 37;
        const KEY_DOWN = 40;
        const KEY_SEMICOLON = 186;

        const OFFSET_LETTERS = 0;
        const OFFSET_ARROWS = 26;
        const OFFSET_SEMICOLON = 30;
        const OFFSET_OTHER = 31;

        // Map keys onto the 32-float buffer
        let index;
        if (KEY_LOWER_A <= key_code && key_code <= KEY_LOWER_Z) {
            index = key_code - KEY_LOWER_A + OFFSET_LETTERS;
        } else if (KEY_UPPER_A <= key_code && key_code <= KEY_UPPER_Z) {
            index = key_code - KEY_UPPER_A + OFFSET_LETTERS;
        } else if (KEY_LEFT <= key_code && key_code <= KEY_DOWN) {
            index = key_code - KEY_LEFT + OFFSET_ARROWS;
        } else if (key_code === KEY_SEMICOLON) {
            index = OFFSET_SPACE;
        } else {
            index = OFFSET_OTHER;
        }

        // Increment by 1/10th of the max value
        this.keyboard_buffer[index] += 0.1;
        this.keyboard_buffer[index] %= 1.0;

        // Publish the keyboard changes
        MESSENGER.publish('keyboard', this.keyboard_buffer);
    }
}
