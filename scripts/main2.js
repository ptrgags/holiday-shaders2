// TODO: Maybe make a class? idk
let holiday_shaders2 = {};

$(document).ready(() => {
    holiday_shaders2.noise_source = new NoiseSource();

    let loader = new ShaderLoader();
    holiday_shaders2.shader_loader = loader;

    // Start the program with a ES6 Promise Chain
    loader.load()
        //.then(console.log("Done!"))
        .catch(console.error);
});
