class MaterialManager {
    constructor(uniform_manager, shader_selector) {
        this.uniforms = uniform_manager;
        this.shaders = shader_selector;

        // This gets initialized  in setup()
        this.material = null;

        // Subscribe to events
        this.subscribe();
    }

    /**
     * Set up the material. This has to be called after the
     * shader selector is loaded.
     */
    setup() {
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms.uniforms,
            fragmentShader: this.shaders.fragment_shader,
            vertexShader: this.shaders.vertex_shader
        });
    }

    /**
     * Subscribe to custom events.
     */
    subscribe() {
        // When one of the shaders is updated, we
        MESSENGER.subscribe('shader_changed', (x) => this.update_shaders(x));
    }

    update_shaders(shader_type) {
        // Update the appropriate part of the material
        if (shader_type === 'fragment')
            this.material.fragmentShader = this.shaders.current_frag;
        else if (shader_type === 'vertex')
            this.material.vertexShader = this.shaders.current_vert;
        else
            throw `Invalid shader type ${shader_type}`;

        // Set this flag so the renderer knows to recompile the shaders
        this.material.needsUpdate = true;
    }

    on_new_frame() {
        // Update the uniforms.
        this.uniforms.on_new_frame();
    }
}
