/**
 * I'm only supporting these specific resolutions
 * since I find them useful for my art.
 */
const RESOLUTIONS = {
    // 200x200 square image
    avatar: new THREE.Vector2(200, 200),
    // Art Trading Card @ 100 dpi
    small: new THREE.Vector2(250, 350),
    // Art Trading Card @ 300 dpi
    medium: new THREE.Vector2(750, 1050),
    // Art Trading Card @ 600 dpi
    large: new THREE.Vector2(1500, 2100),
}

class ResolutionManager {
    constructor() {
        this.resolution = RESOLUTIONS.small;

        this.attach_callbacks();
    }

    attach_callbacks() {
        $('#size-avatar').click(() => this.resize('avatar'));
        $('#size-small').click(() => this.resize('small'));
        $('#size-medium').click(() => this.resize('medium'));
        $('#size-large').click(() => this.resize('large'));
        $('#size-fill').click(() => this.fill_container());
    }

    resize(size_id) {
        this.resolution = RESOLUTIONS[size_id];
        this.publish();
    }

    fill_container() {
        // TODO: Check how to do this
        this.publish();
    }

    publish() {
        MESSENGER.publish('resize', this.resolution);
    }
}
