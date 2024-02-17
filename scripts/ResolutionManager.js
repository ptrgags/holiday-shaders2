/**
 * I'm only supporting these specific resolutions
 * since I find them useful for my art.
 */
const RESOLUTIONS = {
    // 200x200 square image
    avatar: new THREE.Vector2(200, 200),
    // Art Trading Card @ 100 dpi
    small: new THREE.Vector2(250, 350),
    // Art Trading Card @ 200 dpi
    medium: new THREE.Vector2(500, 700),
    // Art Trading Card @ 300 dpi
    large: new THREE.Vector2(750, 1050),
    // Square Textures
    tex_small: new THREE.Vector2(256, 256),
    tex_medium: new THREE.Vector2(512, 512),
    tex_large: new THREE.Vector2(1024, 1024)
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
        $('#size-small-tex').click(() => this.resize('tex_small'));
        $('#size-medium-tex').click(() => this.resize('tex_medium'));
        $('#size-large-tex').click(() => this.resize('tex_large'));
    }

    resize(size_id) {
        this.resolution = RESOLUTIONS[size_id];
        this.publish();
    }

    publish() {
        MESSENGER.publish('resize', this.resolution);
    }
}
