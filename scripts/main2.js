// The Messenger is a pub/sub system to handle communication between
// components. This is used like a singleton
// let MESSENGER = new Messenger();

$(document).ready(() => {
    // Build a tree of objects that manage the web page ===================

    // The NoiseSource selects which hash to use.
    let noise_source = new NoiseSource();

    // The UniformManager manages the uniforms that are passed to each shader.
    // This needs to be able to access the noise buffer.
    // let uniform_manager = new UniformManager(noise_source)

    // The ShaderLibrary loads and stores the shader code
    let shader_lib = new ShaderLibrary();

    // The ShaderSelector handles selecting vertex/fragment shaders
    // and also displays shader information. Thus, it needs access to the
    // library.
    // let shader_selector = new ShaderSelector(shader_lib);

    // The MaterialManager combines the UniformManager with the ShaderSelector
    // and creates a Three.js ShaderMaterial that is shared by all models.
    // let material_manager = new MaterialManager(uniform_manager, shader_lib);

    // This handles the default 2D scene
    // let viewer_2d = new ShaderViewer2D();

    // This handles all 3D-only settings on the page
    // let settings_3d = new Settings3D();

    // This manages the 3D scene.
    // let viewer_3d = new ShaderViewer3D(settings_3d);

    // This class selects between 2D/3D
    // let dimension_selector = new DimensionsSelector(viewer_2d, viewer_3d);

    // This class handles rendering to the canvas.
    // let renderer = new ShaderRenderer(material_manager, dimension_selector);

    // This class sets up callbacks for global mouse/keyboard/other inputs
    // and sends events via the Messenger to whatever else needs it
    // let input_manager = new InputManager();

    // Set up the page ====================================================
    shader_lib.load()
        .then(() => console.log("Done!"))
        .catch(console.error);
});
