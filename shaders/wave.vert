#ifdef GL_ES
precision highp float;
#endif

void main() {
    v_uv = uv;
    float disturbance = sin(position.x - 10.0 * sin(time) * position.x);
    vec3 disturbed = position;
    disturbed.y += disturbance;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(disturbed, 1.0);
}
