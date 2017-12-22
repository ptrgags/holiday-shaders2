import tiling.frag
import signals.frag
import polar.frag
import noise.frag
import patterns.frag
import display.frag
import color.frag
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
    vec2 mouse_uv = CENTERED_MOUSE_UV;

    // Randomly warp space.
    vec2 warped = homogeneous_mat_mult(noise_matrix(0.0), centered_uv);

    // make a grid of circles
    Tiling2D tile = tile_2d(warped + mouse_uv, vec2(5.0, 7.0));

    float pattern = select_pattern(tile.uv, noise_lookup(4.0), 4.0);

    // Pick two colors for the x direection and the y dirction.
    vec3 a = noise_vec3(7.0);
    vec3 b = noise_vec3(12.0);
    vec3 c = noise_vec3(9.0);
    vec3 d = noise_vec3(2.0);
    vec3 x_color = cosine_palette(tile.coords.x + tile.uv.x, a, b, c, d);
    vec3 y_color = cosine_palette(tile.coords.y + tile.uv.y, 0.5 * a + 0.5, b, c, d);

    vec3 color = mix(x_color, y_color, pattern);

    gl_FragColor = display(color);
}
