import tiling.frag
import signals.frag
import polar.frag
-- END IMPORTS --

void main() {
    // Convert to UV coordinates
    //vec2 uv = gl_FragCoord.xy / resolution;

    // Centered UV coordinates
    //vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.x;
    vec2 uv = CENTERED_UV;

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
    float noise = noise_lookup(triangle_num, 3.0 * tiles.id);
    float threshold = step(0.5, noise);

    // =======================================================================
    gl_FragColor = threshold * vec4(1.0, 0.0, 0.0, 1.0);
}
