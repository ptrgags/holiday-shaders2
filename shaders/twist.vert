#ifdef GL_ES
precision highp float;
#endif

mat3 rotate_y(float theta) {
    return mat3(
        cos(theta), 0, -sin(theta),
        0, 1, 0,
        sin(theta), 0, cos(theta)
    );
}

void main() {
    v_uv = uv;
    mat3 twist = rotate_y(position.y * 5.0 * sin(time));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(twist * position, 1.0);
}
