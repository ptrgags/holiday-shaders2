class AnimationManager {
    constructor() {
        this.elapsed_time = 0.0;
        this.paused = false;
        this.last_update = AnimationManager.epoch_seconds();

        this.attach_callbacks();
        this.update();
    }

    attach_callbacks() {
        $('#pause').click(() => this.toggle_paused());
        $('#rewind').click(() => this.rewind_animation());
    }

    update() {
        // no-op if we are paused
        if (this.paused)
            return;

        // Calculate the time since the last update in seconds
        let now = AnimationManager.epoch_seconds();
        let delta = now - this.last_update;

        // Update the elapsed time counter
        this.elapsed_time += delta;

        // Update this last update time.
        this.last_update = now;

        // Update the output
        $('#animation-time').html(this.elapsed_time.toFixed(3));
    }

    /**
     * When the pause/unpause button is clicked, toggle the
     * paused property and the text on the button.
     */
    toggle_paused() {
        this.paused = !this.paused

        // update the button
        let display_text = this.paused ? "Play" : "Pause";
        $("#pause").html(display_text);

        // Update this value so when we unpause we don't add a huge
        // chunk of time.
        this.last_update = AnimationManager.epoch_seconds();
    }

    /**
     * Reset the animation
     */
    rewind_animation() {
        this.elapsed_time = 0.0;
    }

    /**
     * Calculate the time since Unix Epoch in seconds.
     */
    static epoch_seconds() {
        return new Date().getTime() / 1000.0;
    }
}
