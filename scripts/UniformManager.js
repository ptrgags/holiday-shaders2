/**
 * This class manages uniforms for the shader material.
 */
class UniformManager {
    constructor(noise_source, animation_manager) {
        // Keep a reference to the noise source, this is needed
        // to pass the noise to the shader via uniforms.
        this.noise = noise_source;

        // Keep a reference to the animation manager so we can get the
        // elapsed time
        this.animation = animation_manager;

        this.width = 200;
        this.height = 200;

        // This object colds the uniforms for the ShaderMaterial.
        this.uniforms = {
            // Seconds since the
            time: {value: this.animation.elapsed_time},
            mouse: {value: new THREE.Vector2(0.0, 0.0)},
            resolution: {value: new THREE.Vector2(this.width, this.height)},
            scroll: {value: 0},
            noise_buffer: {
                type: "1fv",
                value: this.noise.noise_buffer
            }
        }
        this.subscribe();
    }

    /**
     * This method must be called once a frame to update
     * the time and the noise buffer
     */
    on_new_frame() {
        // Update the time
        this.animation.update();
        this.uniforms.time.value = this.animation.elapsed_time;

        // Update the noise buffer since it may have changed
        this.uniforms.noise_buffer.value = this.noise.noise_buffer;
    }

    /**
     * Subscribe to events
     */
    subscribe() {
        // Subscribe to events that update uniforms directly
        MESSENGER.subscribe('mouse',
            (x) => this.uniforms.mouse.value = x);
        MESSENGER.subscribe('resolution_changed',
            (x) => this.uniforms.resolution.value = x);
        MESSENGER.subscribe('scroll',
            (x) => this.uniforms.scroll.value = x);
    }


}
