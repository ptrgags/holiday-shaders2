class ShaderLoader {
    constructor() {
        this.config = {};
        this.library = {};
    }

    /**
     * Return a promise chain describing the loading
     * process at a high level.
     */
    load() {
        return this.load_config()
            .then(() => this.load_libs())
            .then(() => this.load_vertex_shaders())
            .then(() => this.load_fragment_shaders())
    }

    /**
     * Load the main config JSON file and store it in this.config
     */
    load_config() {
        return $.getJSON('shaders.json').then((x) => this.config = x);
    }

    /**
     * Load all the libraries
     */
    load_libs() {
        // TODO: Rename to {x}.glsl
        // Determine filenames
        let lib_urls = this.config.libs.map((x) => `shader_lib/${x}.frag`)
        // Make promises
        let fetch_libs = lib_urls.map(ShaderLoader.shader_promise);
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

    load_vertex_shaders() {

    }

    load_fragment_shaders() {

    }

    /**
     * Return an Ajax promise to fetch a shader from one of the folders
     */
    static shader_promise(url) {
        return $.ajax({
            url: url,
            dataType: 'text'
        });
    }
}
