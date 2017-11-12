'use strict';

var uniforms = {};

var vert_shaders = [];
var frag_shaders = [];

var vert_shader_list = [
    "default.vert"
];

var frag_shader_list = [
    "quasicrystal.frag",
    "orange.frag",
    "rainbow_pulse.frag",
    "mandelbrot.frag",
    "purple_twist.frag",
    "ghost_cells.frag",
    "interference.frag",
    "voronoi_pulse.frag",
    "simplex_magnify.frag",
    "barrel_pincushion.frag",
    "wavy_eye.frag",
    "triangle_flash.frag"
];

var shader_titles = [
    "Quasicrystal",
    "Bell Gradient",
    "Rainbow Pulse",
    "Mandelbrot Set",
    "Purple Twist",
    "Ghost Cells",
    "Interference",
    "Voronoi Pulse",
    "Triangles",
    "Barrel and Pincushion Distortion",
    "Wavy Eye",
    "Triangle Flash"
];

var shader_descriptions = [
    "\"Quasicrystal\", a variation of the shader from taken from <a href=\"http://pixelshaders.com/examples/quasicrystal.html\">this tutorial</a>. <br />Mouse x: color. Mouse y: wave frequency",
    "Bell-curve gradient with pulsing width",
    "Okay, not technically a rainbow but it sounded cool at the time...",
    "the Mandelbrot set fractal. <br /> Mouse x: zoom in/out. Scrollwheel: select point of interest",
    "You are getting very sleepy...",
    "Worley Noise with distortion. Unlike on ShaderToy, I used a better noise function",
    "Simulation of the interference patterns of two waves. <br/> Mouse: Move the waves. Scrollwheel: toggle third point",
    "Voronoi diagram with pulsing animation. <br/> Mouse: Move one of the points",
    "Grid of triangles. <br />Mouse: Move the magnifying glass",
    "This is the same effect used to make a magnifying glass! <br/> Mouse: pan around",
    "It's watching you...",
    "Triangles."
];

var current_vert = 0;
var current_frag = 0;

var camera = null;
var renderer = null;
var material = null;

var preload_shader = (fname) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `shaders/${fname}`,
            dataType: 'text',
            success: resolve,
            error: reject
        });
    });
};

var load_vert_shaders = () => {
    return Promise.all(vert_shader_list.map(preload_shader));
};

var load_frag_shaders = () => {
    return Promise.all(frag_shader_list.map(preload_shader));
};

var store_vert_shaders = (shader_text) => {
    for (var i = 0; i < vert_shader_list.length; i++)
        vert_shaders.push(shader_text[i]);
};

var store_frag_shaders = (shader_text) => {
    for (var i = 0; i < frag_shader_list.length; i++)
        frag_shaders.push(shader_text[i]);
};

var setup_shaders = () => {
    // Set the scene
    var scene = new THREE.Scene();

    // lights, Camera, action! except there's no
    // lights or action yet...
    var width = $('#wrapper').width();
    var height = $('#wrapper').height();
    camera = new THREE.OrthographicCamera(
        -width / 2, width / 2, height/2, -height/2, 1, 1000);
    camera.position.z = 5;

    //Initialize the renderer
    renderer = new THREE.WebGLRenderer({canvas: $('#three')[0]});
    renderer.setSize(width, height);
    //document.body.appendChild(renderer.domElement);

    //Create the plane that we will shade
    var geometry = new THREE.PlaneGeometry(width, height);
    uniforms = {
        time: {value: 1.0},
        mouse: {value: new THREE.Vector2(0.0, 0.0)},
        resolution: {value: new THREE.Vector2(width, height)},
        scroll: {value: 0}
    }
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert_shaders[current_vert],
        fragmentShader: frag_shaders[current_frag]
    });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    function render() {
        requestAnimationFrame(render);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
    }
    render();
};

var attach_callbacks = () => {
    $('#three').mousemove((event) => {
        event.preventDefault();
        var offset = $('#three').offset();
        uniforms.mouse.value.x = event.clientX - offset.left;
        uniforms.mouse.value.y = event.clientY - offset.top;
    });

    $(window).resize(() => {
        var width = $('#wrapper').width();
        var height = $('#wrapper').height();
        console.log(width, height);
        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    $(window).on('wheel', (event) => {
        if (event.deltaY < 0)
            uniforms.scroll.value--;
        else
            uniforms.scroll.value++;
    });

    $('#prev').click(() => {
        var len = frag_shaders.length;
        current_frag = (current_frag - 1 + len) % len;
        material.fragmentShader = frag_shaders[current_frag];
        material.needsUpdate = true;
        $("#desc").html(shader_descriptions[current_frag]);
        $("#title").html(shader_titles[current_frag]);
        $("#current").html(current_frag + 1);
    });

    $('#next').click(() => {
        current_frag = (current_frag + 1) % frag_shaders.length;
        material.fragmentShader = frag_shaders[current_frag];
        material.needsUpdate = true;
        $("#desc").html(shader_descriptions[current_frag]);
        $("#title").html(shader_titles[current_frag]);
        $("#current").html(current_frag + 1);
    });
};

$(document).ready(() => {
    load_vert_shaders()
        .then(store_vert_shaders)
        .then(load_frag_shaders)
        .then(store_frag_shaders)
        .then(setup_shaders)
        .then(attach_callbacks)
        .catch(console.error);

    $("#desc").html(shader_descriptions[current_frag]);
    $("#title").html(shader_titles[current_frag]);
    $("#current").html(current_frag + 1);
    $("#all").html(frag_shader_list.length);
});
