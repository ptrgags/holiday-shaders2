-- END IMPORTS --

/*
 * skew spacee from squares into rhombi.
 * Essentially we are rotating the y-axis
 * 60 degrees counterclockwise while keeping
 * the x-axis still.
 *
 * Transform derivation: screen(x, y) -> skewed(x', y')
 * x' = x - ycos(60°)
 * y' =     ysin(60°)
 *
 * Inverse (the transform we want): skewed(x', y')
 * y = y'csc(60°)
 * x = x' + ycos(60°)
 *   = x' + y'cos(60°)csc(60°)
 *   = x' + y'cot(60°)
 */

vec2 rhombi(vec2 point) {
    mat2 transform = mat2(
        1.0, 0.0,
        //cot(60°), csc(60°)
        1.0 / tan(PI / 3.0), 1.0 / sin(PI / 3.0)
    );
    return transform * point;
}

void main() {
    // Centered coordinates
    vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.x;

    // Zoom out on the grid and compensate for the skewing
    vec2 scaled = uv * 5.0 * sin(PI / 3.0);

    // Skew so we have rhombus coordinates
    vec2 skewed = rhombi(scaled);

    // Convert to a variation of cube coordinates where
    // x + y + z = 1
    //
    // x is at 0 degrees (east)
    // y is pointing at 120 degrees (roughly northwest)
    // and z points at 240 degrees (roughly southwest)
    vec3 cube_coords = vec3(skewed, 1.0 - skewed.x - skewed.y);

    // Tile space
    vec3 cube_id = floor(cube_coords);
    vec3 cube_uvw = fract(cube_coords);

    // Recalculate the cube coordinates
    vec3 triangle_uvw = vec3(cube_uvw.xy, 1.0 - cube_uvw.x - cube_uvw.y);

    // Calculate distance from center to sides
    vec3 to_border = abs(2.0 * triangle_uvw - 1.0);

    gl_FragColor = to_border.z * vec4(1.0, 0.5, 0.0, 1.0);
}
