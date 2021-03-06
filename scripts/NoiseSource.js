"use strict";

// The noise buffer is always the same length
const BUFFER_LENGTH = 32;

// Radices. I never thought I'd use this word.
const RADIX_HEX = 16;
const RADIX_DEC = 10;

// Maximum ranges for different types of numbers
const MAX_DIGIT = 9;
const MAX_BYTE = 255;

class NoiseSource {
    constructor() {
        this.selected_source = "hash";
        this.sha_hash = "";
        this.time = "";
        this.time_hash = "";
        this.rand_hash = "";
        this.rand_updates = 0;
        this.rand_freq = 5;
        this.manual_hash = "";
        this.keyboard_hash = "";
        this.setup();
    }

    setup() {
        // Make sure sha_hash is the default
        $("input[name=noise-source][value=sha_hash]").prop("checked", true);

        // Create sliders for manual mode.
        this.create_manual_sliders();

        // Update everything once so we don't have blank output
        this.update_hash();
        this.update_time();
        this.update_rand();
        this.update_manual();
        this.update_keyboard(Array(BUFFER_LENGTH).fill(0.0));

        // Set up callbacks so we can respond to the user's actions
        this.setup_listeners();
    }

    create_manual_sliders() {
        let container = $("#manual-controls");
        for (let i = 0; i < BUFFER_LENGTH; i++) {
            let slider = $("<input>")
                .attr({
                    id: `manual-${i}`,
                    type: 'range',
                    value: 0,
                    min: 0,
                    max: 255,
                    step: 1
                })
                .on("input", () => this.update_manual())
                .appendTo(container);
        }
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
        // Control update speed by skipping updates
        const MAX_FREQ = 20;
        this.rand_freq = MAX_FREQ - parseInt($('#rand-freq').val()) + 1;

        let frame = this.rand_updates;
        this.rand_updates++;
        if (frame % this.rand_freq !== 0)
            return;

        // Make a buffer of 32 bytes
        let empty = Array(BUFFER_LENGTH).fill(0.0);
        let rand = empty
            .map(NoiseSource.rand_hex_byte)
            .map(NoiseSource.pad_hex_byte);

        //Convert to a hex number
        this.rand_hash = rand.join('');
        $("#rand-hash").html(this.rand_hash);
    }

    update_manual() {
        let values = [];
        for (let i = 0; i < BUFFER_LENGTH; i++) {
            let slider_val = $(`#manual-${i}`).val();
            values.push(parseInt(slider_val));
        }

        let hex = values.map((x) => x.toString(RADIX_HEX))
            .map(NoiseSource.pad_hex_byte);

        this.manual_hash = hex.join('');
        $("#manual-hash").html(this.manual_hash);
    }

    update_keyboard(keyboard_buffer) {
        let bytes = keyboard_buffer
            .map(NoiseSource.normalized_to_hex)
            .map(NoiseSource.pad_hex_byte);

        this.keyboard_hash = bytes.join('');
        $('#keyboard-hash').html(this.keyboard_hash);
    }

    setup_listeners() {
        // When the user types in the hash input, update the hash
        $("#hash-input").keyup(() => this.update_hash());

        //Periodically update the time and random hash
        const UPDATE_INTERVAL = 100;
        setInterval(() => this.update_time(), UPDATE_INTERVAL);
        setInterval(() => this.update_rand(), UPDATE_INTERVAL);

        // Listen for keyboard input
        MESSENGER.subscribe('keyboard', (x) => this.update_keyboard(x))
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
        let num_zeroes = BUFFER_LENGTH - digits.length;
        //TODO: Randomly fill the rest?
        let zeroes = '0'.repeat(num_zeroes);
        let padded = digits + zeroes;

        //Split into 32 separate characters
        let chars = [...padded];

        // Map on to hex digits.
        let all_digits = chars.map(x => parseInt(x, RADIX_DEC));
        let hex_chars = all_digits
            .map(NoiseSource.digit_to_hex)
            .map(NoiseSource.pad_hex_byte);

        // Finally, join the strings together
        return hex_chars.join('')
    }

    /**
     * Read the Noise Source radio button and return the corresponding
     * hash value
     */
    get selected_hash() {
        // Read the selected noise source radio button. The values
        // map on to variables in this instancee
        let hash_var_name = $("input[name=noise-source]:checked").val();

        // Look up the variable which contains the proper hash.
        return this[hash_var_name];
    }

    /**
     * Read the selected noise hash and convert it to a noise buffer
     * of floats from 0.0 to 1.0.
     * This getter is used to update the uniforms dict.
     */
    get noise_buffer() {
        let hash = this.selected_hash;
        return NoiseSource.make_noise_buffer(hash);
    }

    /**
     * Take a float value from [0, 1] and convert to a string
     * on ["00", "ff"]
     */
    static normalized_to_hex(norm) {
        // Scale to [0, 255] and makee sure it is an integer
        let scaled = Math.floor(norm * MAX_BYTE);

        // Convert to a 2-digit hex string
        return scaled.toString(RADIX_HEX);
    }

    /**
     * Take a digit as an int from 0-9 and map it onto a hex digit
     * map it from [0, 9] -> [0, 255] -> ["00", "ff"]
     */
    static digit_to_hex(d) {
        // Normalize to [0, 1]
        let normalized = d / MAX_DIGIT;

        return NoiseSource.normalized_to_hex(normalized);
    }

    /**
     * Calculate a random number from 0-255 but return it as a hex string.
     */
    static rand_hex_byte() {
        let rand = Math.random() * (MAX_BYTE + 1);
        let rand_int = Math.floor(rand);
        return rand_int.toString(RADIX_HEX);
    }

    /**
     * Pad a hexadecimal character with 0s to be 2 characters wide
     */
    static pad_hex_byte(x) {
        if (x.length != 2)
            return '0' + x
        else
            return x
    }

    /**
     * Convert a 32-byte hexadecimal hash to
     * a buffer of 32 floats.
     */
    static make_noise_buffer(hash) {
        let buffer = [];
        for (let i = 0; i < BUFFER_LENGTH; i++) {
            let byte_hex = hash.slice(2 * i, 2 * i + 2);
            let byte_int = parseInt(byte_hex, 16);
            let norm = byte_int / 255;
            buffer.push(norm);
        }
        return buffer;
    }
}
