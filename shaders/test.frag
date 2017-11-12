#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
}
