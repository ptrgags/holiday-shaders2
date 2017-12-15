// The Messenger is a pub/sub system to handle communication between
// components. This is used like a singleton
let MESSENGER = new Messenger();

// Throw variables here for debugging;
let debug = {};

$(document).ready(() => {
    // Build a tree of objects that manage the web page ===================

    // The NoiseSource selects which hash to use.
    let noise_source = new NoiseSource();

    // The AnimationManager handles keeping track of the animation's elapsed
    // time and allows play/pause/rewind functionality
    let animation_manager = new AnimationManager();

    // The UniformManager manages the uniforms that are passed to each shader.
    // This needs to be able to access the noise buffer.
    let uniform_manager = new UniformManager(noise_source, animation_manager);

    // The ShaderLibrary loads and stores the shader code
    let shader_lib = new ShaderLibrary();

    // The ShaderSelector handles selecting vertex/fragment shaders
    // and also displays shader information. Thus, it needs access to the
    // library.
    let shader_selector = new ShaderSelector(shader_lib);

    // The MaterialManager combines the UniformManager with the ShaderSelector
    // and creates a Three.js ShaderMaterial that is shared by all models.
    let material_manager = new MaterialManager(
        uniform_manager, shader_selector);

    // This handles the default 2D scene
    let viewer_2d = new ShaderViewer2D(material_manager);

    // This handles all 3D-only settings on the page
    let models = new ModelSelector();

    // This manages the 3D scene.
     let viewer_3d = new ShaderViewer3D(material_manager, models);

    // This class selects between 2D/3D
    let dimension_selector = new DimensionsSelector(viewer_2d, viewer_3d);

    // This class handles rendering to the canvas.
    let renderer = new ShaderRenderer(dimension_selector);

    // This class sets up callbacks for global mouse/keyboard/other inputs
    // and sends events via the Messenger to whatever else needs it
    let input_manager = new InputManager();

    // This class handles changing the size of the canvas and publishing
    // events
    let res_manager = new ResolutionManager();

    // Set up the page ====================================================
    shader_lib.load()
        .then(() => shader_selector.setup())
        .then(() => material_manager.setup())
        .then(() => dimension_selector.setup())
        .then(() => renderer.setup())
        .then(() => res_manager.resize('small'))
        .catch(console.error);
});
