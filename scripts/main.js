'use strict';

// TODO: Move these to a class
var uniforms = {};

var library = {};
var vert_shaders = [];
var frag_shaders = [];


// TODO: Move these to shader_index.json ================================
var shader_lib = [
    "header.frag",
    "tiling.frag",
    "signals.frag",
    "polar.frag",
    "noise.frag"
];

var vert_shader_list = [
    "default.vert"
];

var frag_shader_list = [
    "plaid.frag",
    "tile.frag",
    "newton.frag",
    "warp.frag",
    "spirals.frag"
];

var shader_titles = [
    "Plaid",
    "Tiles",
    "Newton's Method Fractal",
    "Warped Space",
    "Spirals"
];

var shader_descriptions = [
    "Make some plaid patterns",
    "Make some triangle tile patterns",
    "A fractal made with Newton's Method",
    "Let's take space and warp it",
    "Spirals."
];

// TODO: Move these to a class

var current_vert = 0;
var current_frag = 4;

var camera = null;
var renderer = null;
var material = null;

let preload_lib = (fname) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `shader_lib/${fname}`,
            dataType: 'text',
            success: resolve,
            error: reject
        });
    });
};

let load_lib = () => {
    return Promise.all(shader_lib.map(preload_lib));
}

let store_lib = (shader_text) => {
    for (var i = 0; i < shader_lib.length; i++)
        library[shader_lib[i]] = shader_text[i];
}

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

let import_lib = (import_line) => {
    let [, fname] = import_line.trim().split(" ");
    return library[fname];
}

var store_frag_shaders = (shader_text) => {
    let header = library['header.frag'];
    for (var i = 0; i < frag_shader_list.length; i++) {
        let text = shader_text[i];
        let [imports, shader] = text.split("-- END IMPORTS --");
        let import_lines = imports.split(/[\r\n]+/);
        let imported = import_lines.map(import_lib).join('\n');
        let full_shader = `${header}\n${imported}\n${shader}`
        frag_shaders.push(full_shader);
    }
};

var setup_shaders = () => {
    // Set the scene
    var scene = new THREE.Scene();

    // lights, Camera, action! except there's no
    // lights or action yet...
    var width = 500; //1500; //$('#wrapper').width();
    var height = 700; //2100; //$('#wrapper').height();
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
        scroll: {value: 0},
        noise_buffer: {
            type: "1fv",
            value: Array(32).fill(0.0).map((x) => Math.random())
        }
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

let normalize_hash = (hash) => {
    let SHA_LENGTH_BYTES = 32;
    let buffer = [];
    for (let i = 0; i < SHA_LENGTH_BYTES; i++) {
        let byte_hex = hash.slice(2 * i, 2 * i + 2);
        let byte_int = parseInt(byte_hex, 16);
        let norm = byte_int / 255;
        buffer.push(norm);
    }
    return buffer;
}

var attach_callbacks = () => {
    $('#three').mousemove((event) => {
        event.preventDefault();
        var offset = $('#three').offset();
        uniforms.mouse.value.x = event.clientX - offset.left;
        uniforms.mouse.value.y = event.clientY - offset.top;
    });

    /*$(window).resize(() => {
        var width = $('#wrapper').width();
        var height = $('#wrapper').height();
        console.log(width, height);
        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });*/

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

    $('#to-hash').change(() => {
        let text = $("#to-hash").val();
        let hash = sha256(text);
        $("#hash").html(hash);
        let noise_buffer = normalize_hash(hash);
        uniforms.noise_buffer.value = noise_buffer;
    })
};

$(document).ready(() => {
    load_lib()
        .then(store_lib)
        .then(load_vert_shaders)
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
