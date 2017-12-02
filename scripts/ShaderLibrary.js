/**
 * This class handles loading shader code via AJAX and
 * storing it for later access.
 */
class ShaderLibrary {
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
            .then(() => this.process_imports());
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
        let fetch_libs = lib_urls.map(ShaderLibrary.file_promise);
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
     * Load shaders and store the text in this library.
     */
    load_shaders() {
        // TODO: Split into two directories
        let vert_urls = this.config.vertex.map((x) => `shaders/${x.id}.vert`);
        let frag_urls = this.config.fragment.map((x) => `shaders/${x.id}.frag`);

        // Get promises to fetch all the files.
        let fetch_vert = vert_urls.map(ShaderLibrary.file_promise);
        let fetch_frag = frag_urls.map(ShaderLibrary.file_promise);

        // Load everything and then store them all at once.
        return Promise.all(fetch_vert)
            .then((x) => this.vertex_shaders = x)
            .then(() => Promise.all(fetch_frag))
            .then((x) => this.fragment_shaders = x);
    }

    // Handle imports in both vertex and fragment shaders.
    process_imports() {
        //this.vertex_shaders = this.vertex_shaders
        //.map((x) => this.import_libraries(x));
        this.vertex_shaders = this.vertex_shaders
            .map((x) => this.import_libraries(x));
        this.fragment_shaders = this.fragment_shaders
            .map((x) => this.import_libraries(x));
    }

    /**
     * Handle imports for one file. Imports are lines like
     * import <library>
     * at the top of a .vert or .frag file
     * up to a "-- END IMPORTS --" line where I stop processing.
     */
    import_libraries(file) {
        let header = this.library['header.frag'];
        let find_imports = file.split("-- END IMPORTS --");
        var imported = '';
        var shader = file;

        // If we have any import statemeents, import them
        if (find_imports.length == 2) {
            let [imports, shader_text] = find_imports;
            let import_lines = imports.split(/[\r\n]+/);
            imported = import_lines
                .filter((x) => x !== "")
                .map((x) => this.import_lib(x))
                .join('\n');
            shader = shader_text;
        }

        // Construct the full shader.
        return `${header}\n${imported}\n${shader}`;
    }

    /**
     * Process a single import line:
     * if it is an import line, inline the corresponding library code
     * if it is a single line comment, pass the line through unaltered.
     * Otherwise, throw an error
     */
    import_lib(import_line) {
        let line = import_line.trim();
        let comment_pattern = /^\/\//;
        let import_pattern = /^import [^\s]+$/;

        if (import_pattern.test(line)) {
            // Inline the code of the library
            let [, fname] = line.split(" ");
            let lib = this.library[fname];
            if (lib === undefined)
                throw `${fname} not a valid shader library`
        } else if (comment_pattern.test(line)) {
            // Pass single-line comments through
            return line;
        } else {
            throw `${import_line}: Imports must be 'import <filename>' or a `
                + `single-line comment`;
        }
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
