#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;

#define NOISE_BUFFER_SIZE 32
uniform float noise_buffer[NOISE_BUFFER_SIZE];

#define PI 3.1415
#define TAU (2.0 * PI)

#define CENTER (resolution / 2.0)

/**
 * look up a value in the noise buffer. The cycle_offset
 * allows you to start at an offset and cycle around the array.
 *
 * Because WebGL doesn't allow unbounded array access :P
 */
float noise_lookup(float index, float cycle_offset) {
    float cycled = mod(index + cycle_offset, float(NOISE_BUFFER_SIZE));
    int desired = int(cycled);
    for (int i = 0; i < NOISE_BUFFER_SIZE; i++) {
        if (i == desired)
            return noise_buffer[i];
    }
    return 0.0;
}

struct Tiling2D {
    // UV within the new tile
    vec2 uv;
    // (x, y) integer coordinates of the new tile
    vec2 coords;
    // (cols, rows) of the tiling
    vec2 num_tiles;
    // 1D integer index of the tile in the tiling. This assumes
    // y-major numbering.
    float id;
};

Tiling2D tile_2d(vec2 uv, vec2 num_tiles) {
    Tiling2D tile;
    vec2 scaled = uv * num_tiles;
    tile.uv = fract(scaled);
    tile.coords = floor(scaled);
    tile.num_tiles = num_tiles;
    tile.id = num_tiles.x * tile.coords.y + tile.coords.x;
    return tile;
}

struct Tiling1D {
    float uv;
    float id;
    float num_tiles;
};

Tiling1D tile_1d(float x, float num_tiles) {
    Tiling1D tile;
    float scaled = x * num_tiles;
    tile.uv = fract(scaled);
    tile.id = floor(scaled);
    tile.num_tiles = num_tiles;
    return tile;
}

/**
 * Convert from (x, y) to an unique square integer.
 *
 * Note that this assumes a row-major numbering
 */
float idx_2d_to_1d(vec2 tile_coords, float width_tiles) {
    return width_tiles * tile_coords.y + tile_coords.x;
}

void main() {
    // Convert to UV coordinates
    //vec2 uv = gl_FragCoord.xy / resolution;

    // Centered UV coordinates
    vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.x;

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

    // Get the angle around the center of the square
    float theta = atan(centered_uv.y, centered_uv.x);
    float theta_norm = theta / TAU + 0.5;
    float rotated = fract(theta_norm - 1.0 / 8.0);

    // Divide into 8 triangles fanning around the circle
    float NUM_TRIANGLES = 8.0;
    Tiling1D triangle_fan = tile_1d(rotated, NUM_TRIANGLES);

    // Assign a number from 0-31
    float triangle_num = 8.0 * quads.id + triangle_fan.id;

    // Determine how to color the triangle based on the noise buffer
    float noise = noise_lookup(triangle_num, 3.0 * tiles.id);
    float threshold = step(0.5, noise);

    // =======================================================================

    gl_FragColor = threshold * vec4(1.0, 0.0, 0.0, 1.0);
}
