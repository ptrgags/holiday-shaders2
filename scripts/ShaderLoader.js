class ShaderLoader {
    constructor() {
        this.config = {};
        this.library = {};
        this.vertex_shaders = [];
        this.fragment_shaders = [];
    }

    /**
     * Return a promise chain describing the loading
     * process at a high level.
     */
    load() {
        return this.load_config()
            .then(() => this.load_libs())
            .then(() => this.load_shaders())
    }

    /**
     * Load the main config JSON file and store it in this.config
     */
    load_config() {
        return $.getJSON('shaders.json')
            .then((x) => this.config = x)
    }

    /**
     * Load all the libraries
     */
    load_libs() {
        // TODO: Rename to shader_lib/{x}.glsl
        // Determine filenames
        let lib_urls = this.config.libs.map((x) => `shader_lib/${x}.frag`)
        // Make promises
        let fetch_libs = lib_urls.map(ShaderLoader.file_promise);
        // Load everything and then store them all at once.
        return Promise.all(fetch_libs).then((x) => this.store_libs(x));
    }

    /**
     * Store library text in an object so we can do imports later.
     */
    store_libs(lib_files) {
        for (var i = 0; i < lib_files.length; i++) {
            // TODO: Drop the .frag extension
            let id = `${this.config.libs[i]}.frag`;
            this.library[id] = lib_files[i];
        }
    }

    /**
     * Load shaders
     */
    load_shaders() {
        // TODO: Split into two directories
        let vert_urls = this.config.vertex.map((x) => `shaders/${x.id}.vert`);
        let frag_urls = this.config.fragment.map((x) => `shaders/${x.id}.frag`);

        // Get promises to fetch all the files.
        let fetch_vert = vert_urls.map(ShaderLoader.file_promise);
        let fetch_frag = frag_urls.map(ShaderLoader.file_promise);

        // Load everything and then store them all at once
        return Promise.all(fetch_vert)
            .then((x) => this.vertex_shaders = x)
            .then(() => Promise.all(fetch_frag))
            .then((x) => this.fragment_shaders = x);
    }

    /**
     * Return an Ajax promise to fetch a plaintext file
     */
    static file_promise(url) {
        return $.ajax({
            url: url,
            dataType: 'text'
        });
    }
}
