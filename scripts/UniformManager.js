/**
 * This class manages uniforms for the shader material.
 */
class UniformManager {
    constructor(noise_source) {
        // Keep a reference to the noise source, this is needed
        // to pass the noise to the shader via uniforms.
        this.noise_source = noise_source;

        // This is used to keep track of the animation
        // TODO: Move to AnimationManager
        this.elapsed_time = 0.0;
        this.paused = false;
        this.last_update = UniformManager.epoch_seconds();

        // This object colds the uniforms for the ShaderMaterial.
        this.uniforms = {
            // Seconds since the
            time: {value: this.elapsed_time},
            mouse: {value: new THREE.Vector2(0.0, 0.0)},
            resolution: {value: new THREE.Vector2(1.0, 1.0)},
            scroll: {value: 0},
            noise_buffer: {
                type: "1fv",
                value: this.noise_source.noise_buffer
            }
        }
        this.subscribe();
    }

    /**
     * This method must be called once a frame to update
     * the time and the noise buffer
     */
    on_new_frame() {
        this.update_time();

        // Update the noise buffer since it may have changed
        this.uniforms.noise_buffer.value = this.noise_source.noise_buffer;
    }

    update_time() {
        // no-op if we are paused
        if (this.paused)
            return;

        // Calculate the time since the last update in seconds
        let now = UniformManager.epoch_seconds();
        let delta = now - this.last_update;

        // Update the elapsed time counter
        this.elapsed_time += delta;

        //Update the uniform.
        this.uniforms.time.value = this.elapsed_time;

        this.last_update = now;

    }

    toggle_paused() {
        this.paused = !paused

        // Update this value so when we unpause we don't add a huge
        // chunk of time.
        this.last_update = UniformManager.epoch_seconds();
    }

    rewind_animation() {
        this.elapsed_time = 0.0;
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

        // Subscribe to events that control the animation.
        MESSENGER.subscribe('play_pause', () => this.toggle_paused());
        MESSENGER.subscribe('rewind', () => this.reset_animation());
    }

    static epoch_seconds() {
        return new Date().getTime() / 1000.0;
    }
}
