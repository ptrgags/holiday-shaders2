float min_component(vec2 v) {
    return min(v.x, v.y);
}

float min_component(vec3 v) {
    return min(v.x, min(v.y, v.z));
}

float max_component(vec2 v) {
    return max(v.x, v.y);
}

float max_component(vec3 v) {
    return max(v.x, max(v.y, v.z));
}
