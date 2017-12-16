// Inverse warp to make two triangles
mat2 simplex() {
    return mat2(
        1.0, 0.0,
        //cot(-60°), csc(-60°)
        1.0 / tan(-PI / 3.0), -1.0 / sin(-PI / 3.0)
    );
}

vec2 cycle_coords(float x) {
    float x_index = mod(x + 2.0, 3.0);
    float y_index = mod(x + 1.0, 3.0);
    vec2 index = vec2(x_index, y_index);

    return floor(index / 2.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;


    vec2 mouse_uv = u_mouse / u_resolution.xy;

    // Skew space to the right
    st = simplex() * st;

    //  Tile space
    st *= 6.0;
    vec2 uv = fract(st);
    vec2 id = floor(st);

    // Split into two triangles, one mirrored over 1.0 - x
    float is_flipped = float(uv.y > 1.0 - uv.x);
    vec2 flipped = mix(uv, (1.0 - uv).yx, is_flipped);

    // barycentric coords
    vec3 bary = vec3(flipped, 1.0 - flipped.x - flipped.y);

    // Calculate how many clockwise cycles of the triangle vertices we need to make.
    float num_cycles = id.x - id.y;
    // There are only three possible arrangements of triangle vertices
    num_cycles = mod(num_cycles, 3.0);

    vec2 a = cycle_coords(num_cycles);
    vec2 b = cycle_coords(num_cycles + 1.0);
    vec2 c = cycle_coords(num_cycles + 2.0);
    vec2 mirrored = bary.x * a + bary.y * b + bary.z * c;

    float dist = distance(mouse_uv - 0.5, mirrored);
    float wave1 = cos(30.0 * dist - u_time);
    dist = distance(mouse_uv - 0.25, mirrored);
    float wave2 = sin(15.0 * dist - 2.0 * u_time);
    dist = distance(mouse_uv - 0.75, mirrored);
    float wave3 = sin(10.0 * dist - 3.0 * u_time);

    /*
    bary = vec3(mirrored, 1.0 - mirrored.x -mirrored.y);

    float max_component = max(bary.x, bary.y);

    vec4 color = vec4(bary, 1.0);
    */

    gl_FragColor = vec4(wave1, wave2, wave3, 1.0);
}
