import tiling.frag
import signals.frag
import polar.frag
import noise.frag
-- END IMPORTS --

mat3 noise_matrix(float offset) {
    return mat3(
        noise_lookup(0.0, offset),
        noise_lookup(1.0, offset),
        noise_lookup(2.0, offset),
        noise_lookup(3.0, offset),
        noise_lookup(4.0, offset),
        noise_lookup(5.0, offset),
        noise_lookup(6.0, offset),
        noise_lookup(7.0, offset),
        noise_lookup(8.0, offset)
    );
}

/**
 * Multiply a 3x3 matrix by a vector. use homogenous coordinates.
 */
vec2 homogeneous_mat_mult(mat3 t, vec2 v) {
    vec3 homogeneous = vec3(v, 1.0);
    vec3 transformed = t * homogeneous;
    return transformed.xy / transformed.z;
}



void main() {
    //vec2 uv = gl_FragCoord.xy / resolution;
    //vec2 centered_uv = (gl_FragCoord.xy - CENTER) / resolution;
    vec2 uv = REGULAR_UV;
    vec2 centered_uv = CENTERED_UV;

    // Randomly warp space.
    vec2 warped = homogeneous_mat_mult(noise_matrix(0.0), centered_uv);

    // make a grid of circles
    Tiling2D tile = tile_2d(warped, vec2(5.0, 7.0));
    vec2 centered_tile = tile.uv - 0.5;
    vec2 polar = rect_to_polar(centered_tile);

    // Make a circle in each warped tile. Randomly select the size of each
    // circle and whether the colors are inside or outside the circle
    float MAX_CIRCLE_SIZE = 0.45;
    float MIN_CIRCLE_SIZE = 0.2;
    float BOUNDARY_THICKNESS = 0.001;
    float boundary = mix(MIN_CIRCLE_SIZE, MAX_CIRCLE_SIZE, noise_lookup(9.0));
    float thickness = signed_signal(noise_lookup(10.0)) * BOUNDARY_THICKNESS;
    float circle_mask = smoothstep(boundary, boundary + thickness, polar.x);

    vec4 color1 = noise_color(11.0);
    vec4 color2 = noise_color(12.0);

    vec2 color_center = noise_vec2(17.0);
    float dist_from_center = distance(uv, color_center);

    vec4 color = mix(color1, color2, dist_from_center);

    gl_FragColor = circle_mask * color;
}
