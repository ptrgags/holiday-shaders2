#ifdef GL_ES
precision highp float;
#endif

void main() {
    v_uv = uv;

    // Use floor to make the model boxy. add 0.5 to re-center the model.
    vec3 boxy = floor(position) + 0.5;

    // Morph back and forth between normal and boxy.
    float morph_factor = 0.5 + 0.5 * sin(time);
    vec3 morph = mix(boxy, position, morph_factor);

    // The rest is the usual position calculation.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(morph, 1.0);
}
