class ShaderSelector {
    constructor(shader_lib) {
        this.shader_lib = shader_lib;
        this.index_frag = 0;
    }

    setup() {
        // Populate the vertex shaders dropdown
        this.populate_dropdown();

        // Attach callbacks
        $('#prev').click(() => this.cycle_shaders(-1));
        $('#next').click(() => this.cycle_shaders(1));

        // When the user selects a different vertex shader
        $('#vertex-shader').change(() =>
            MESSENGER.publish('shader_changed', 'vertex'));

        // Update the info panel.
        this.update();
    }

    /**
     * Populate the dropdown box with the vertex shader namees.
     */
    populate_dropdown() {
        let dropdown = $("#vertex-shader");
        this.shader_lib.vertex_info.map((x, i) => {
            $('<option>')
                .val(i)
                .html(x.title)
                .appendTo(dropdown);
        });
    }

    update() {
        // Get info on the current fragment shader.
        let info = this.shader_lib.fragment_info[this.index_frag];

        // Update the screen.
        $("#shader-title").html(info.title);
        $("#shader-index").html(this.index_frag + 1);
        $("#num-shaders").html(this.num_fragment_shaders);
        $("#shader-description").html(info.desc);
    }

    /**
     * Read the vertex shader dropdown and select the corresponding
     * vertex code from the library.
     */
    get vertex_shader() {
        let dropdown_val = $("#vertex-shader").find(":selected").val();
        let index = parseInt(dropdown_val);
        return this.shader_lib.vertex_shaders[index];
    }

    get fragment_shader() {
        return this.shader_lib.fragment_shaders[this.index_frag];
    }

    get num_fragment_shaders() {
        return this.shader_lib.fragment_shaders.length;
    }

    /**
     * Cycle through the shaders forwards or backwards.
     * Use +1 for forwards and -1 for backwards
     */
    cycle_shaders(offset) {
        // Increase the offset
        this.index_frag += offset;

        // Modulo the number of fragment shaders
        let n = this.num_fragment_shaders;
        this.index_frag %= n;
        // Handle negative input values:
        this.index_frag += n;
        this.index_frag %= n;

        // Publish an event saying the shader changed
        MESSENGER.publish('shader_changed', 'fragment');

        // Finally, update the info panel
        this.update();
    }
}
