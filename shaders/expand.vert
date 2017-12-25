#ifdef GL_ES
precision highp float;
#endif

void main() {
    v_uv = uv;

    vec3 coords = position;
    float id = 3.0 * coords.x + 5.0 * coords.y + 7.0 * coords.z;
    float amp = noise_lookup(id);
    float freq = noise_lookup(id + 1.0);
    float wave = amp * sin(freq * time) + 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * wave, 1.0);
}
