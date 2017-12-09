vec4 display(float x) {
    return x * vec4(1.0);
}

vec4 display(vec2 v) {
    return vec4(v, 0.0, 1.0);
}

vec4 display(vec3 v) {
    return vec4(v, 1.0);
}

vec4 display(vec4 v) {
    return v;
}
