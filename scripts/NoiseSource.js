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
        let now = new Date();
        $("#time").html(now.toISOString());
        this.time_hash = this.hash_time(now);
        $("#time-hash").html(this.time_hash);
    }

    update_rand() {

    }

    update_manual() {

    }

    setup_listeners() {
        // When the user types in the hash input, update the hash
        $("#hash-input").keyup(() => this.update_hash());

        //Periodically update the time and random hash
        const UPDATE_INTERVAL = 100;
        setInterval(() => this.update_time(), UPDATE_INTERVAL);

    }

    /**
     * Take a timestamp and turn it into a hash. Take each digit
     * of the timestamp (padded with 0s on the right to 32 characters
     * and map it from [0, 9] -> [0, 255] -> ["00", "ff"]
     */
    hash_time(time) {
        //Remove all non-digits from  the timestamp
        let digits = time.toISOString().replace(/[^\d]/g, '');

        //Pad with zeros until we have 32 characters
        const BUFFER_LENGTH = 32;
        let num_zeroes = BUFFER_LENGTH - digits.length;
        let zeroes = '0'.repeat(num_zeroes);
        let padded = digits + zeroes;

        //Split into 32 separate characters
        let chars = [...padded];

        // Map on to hex digits.
        const RADIX_DEC = 10;
        let all_digits = chars.map(x => parseInt(x, RADIX_DEC));
        let hex_chars = all_digits.map(this.digit_to_hex);

        // Finally, join the strings together
        return hex_chars.join('')
    }

    /**
     * Take a digit as an int from 0-9 and map it onto a hex digit
     * map it from [0, 9] -> [0, 255] -> ["00", "ff"]
     */
    digit_to_hex(d) {
        // Normalize to [0, 1]
        const MAX_DIGIT = 9;
        let normalized = d / MAX_DIGIT;

        // Scale to [0, 255] and makee sure it is an integer
        const MAX_BYTE = 255;
        let scaled = Math.floor(normalized * MAX_BYTE);

        // Convert to a 2-digit hex string
        const RADIX_HEX = 16;
        return scaled.toString(RADIX_HEX);
    }
}
