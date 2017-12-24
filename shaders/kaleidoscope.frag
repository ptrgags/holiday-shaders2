import tiling.frag
import noise.frag
import color.frag
import display.frag
-- END IMPORTS --
// Inverse warp to make rhombi which can be easily
// turned into 2 simplices
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
    vec2 uv = REGULAR_UV;

    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Skew space into rhombi
    uv = simplex() * uv;

    //  Tile space
    Tiling2D cells = tile_2d(uv, vec2(6.0));

    // Split into two triangles, one mirrored over 1.0 - x
    float is_flipped = float(cells.uv.y > 1.0 - cells.uv.x);
    vec2 flipped = mix(cells.uv, (1.0 - cells.uv).yx, is_flipped);

    // barycentric coords
    vec3 bary = vec3(flipped, 1.0 - flipped.x - flipped.y);

    // Calculate how many clockwise cycles of the triangle vertices we need to make.
    float num_cycles = cells.coords.x - cells.coords.y;
    // There are only three possible arrangements of triangle vertices
    num_cycles = mod(num_cycles, 3.0);

    // Set up correct mirroring
    vec2 corner_a = cycle_coords(num_cycles);
    vec2 corner_b = cycle_coords(num_cycles + 1.0);
    vec2 corner_c = cycle_coords(num_cycles + 2.0);
    vec2 mirrored = bary.x * corner_a + bary.y * corner_b + bary.z * corner_c;

    // Pick three random colors in the same palette
    vec3 a = noise_vec3(21.0);
    vec3 b = noise_vec3(5.0);
    vec3 c = noise_vec3(20.0);
    vec3 d = noise_vec3(18.0);
    vec3 color1 = cosine_palette(noise_lookup(1.0), a, b, c, d);
    vec3 color2 = cosine_palette(noise_lookup(17.0), a, b, c, d);
    vec3 color3 = cosine_palette(noise_lookup(2.0), a, b, c, d);

    float dist = distance(mouse_uv - 0.5, mirrored);
    float wave1 = cos(30.0 * dist - time);
    dist = distance(mouse_uv - 0.25, mirrored);
    float wave2 = sin(15.0 * dist - 2.0 * time);
    dist = distance(mouse_uv - 0.75, mirrored);
    float wave3 = sin(10.0 * dist - 3.0 * time);

    // Make the waves less blurry. Suggested by
    // DeviantArt user PonceIndustries
    vec3 blurry = vec3(wave1, wave2, wave3);
    vec3 sharp = smoothstep(0.8, 1.0, blurry);

    vec3 image = color1 * sharp.x;
    image = mix(image, color2 * sharp.y, 0.5);
    image = mix(image, color3 * sharp.z, 0.5);

    gl_FragColor = display(image);
}
