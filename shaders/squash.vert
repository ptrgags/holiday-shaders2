#ifdef GL_ES
precision highp float;
#endif

void main() {
    v_uv = uv;
    vec2 squashed = vec2(position.xy);
    float r = length(squashed);

    float stretch = 0.25 * sin(time) + 0.75;
    squashed *= r * stretch;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(squashed, 0.0, 1.0);
}
