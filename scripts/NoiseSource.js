"use strict";

class NoiseSource {
    constructor() {
        this.selected_source = "hash";
        this.sha_hash = "";
        this.time = "";
        this.time_hash = "";
        this.rand_hash = "";
        this.manual_hash = "";
        this.setup();
    }

    setup() {
        // Update everything once so we don't have blank output
        this.update_hash();
        this.update_time();
        this.update_rand();
        this.update_manual();

        // Set up callbacks so we can respond to the user's actions
        this.setup_listeners();
    }

    update_hash() {
        let text = $("#hash-input").val();
        this.sha_hash = sha256(text);
        $("#hash-output").html(this.sha_hash);
    }

    update_time() {

    }

    update_rand() {

    }

    update_manual() {

    }

    setup_listeners() {
        // When the user types in the hash input, update the hash
        $("#hash-input").keyup(() => this.update_hash());
    }
}
