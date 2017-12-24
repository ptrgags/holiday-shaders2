import tiling.frag
import signals.frag
import polar.frag
import noise.frag
import color.frag
import display.frag
-- END IMPORTS --

void main() {
    vec2 uv = CENTERED_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Mirror the UV space
    vec2 mirrored_uv = abs(uv);

    // Divide into many small UV spaces
    vec2 NUM_TILES = vec2(4.0);
    Tiling2D tiles = tile_2d(mirrored_uv, NUM_TILES);

    // Make a tile ==========================================================

    //Divide into a 2x2 grid and number each square from 0-3
    vec2 QUADRANTS_NUM_TILES = vec2(2.0);
    Tiling2D quads = tile_2d(tiles.uv, QUADRANTS_NUM_TILES);

    // Subdivide each bucket into 4 triangles that meet in the center
    vec2 centered_uv = quads.uv - 0.5;

    // We want to work with the angle around the circle.
    float NUM_TRIANGLES = 8.0;
    vec2 polar = rect_to_polar(centered_uv);
    vec2 rotated = polar_rotate(polar, 0.25);//1.0 / NUM_TRIANGLES);

    // Divide into 8 triangles fanning around the circle
    Tiling1D triangle_fan = tile_1d(rotated.y, NUM_TRIANGLES);

    // pretend the quadrant is the "row" and the position in the
    // triangle fan is the "column". Then we can assign an ID to each triangle.
    vec2 triangle_coords = vec2(triangle_fan.id, quads.id);
    float triangle_num = idx_2d_to_1d(triangle_coords, NUM_TRIANGLES);

    // Determine how to color the triangle based on the noise buffer
    float noise = noise_lookup(triangle_num - 8.0 * mouse_uv.x, 3.0 * tiles.id);
    float threshold = step(0.5, noise);

    // =======================================================================

    // Add a random color
    vec3 a = noise_vec3(7.0);
    vec3 b = noise_vec3(13.0);
    vec3 c = noise_vec3(17.0);
    vec3 d = noise_vec3(23.0);
    vec3 color = cosine_palette(0.5, a, b, c, d);

    gl_FragColor = display(threshold * color);
}
