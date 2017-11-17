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

/**
 * Convert from (x, y) to an unique square integer.
 *
 * Note that this assumes a row-major numbering
 */
float idx_2d_to_1d(vec2 tile_coords, float width_tiles) {
    return width_tiles * tile_coords.y + tile_coords.x;
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
    tile.id = idx_2d_to_1d(tile.coords, num_tiles.x);
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
 * Convert from a signed signal of [-1, 1] to an unsigned
 * signal from [0, 1]. This squishes and shifts it up.
 * This is useful for squishing e.g. a sine wave into the range [0, 1]
 */
float unsigned_signal(float signed_sig) {
    return 0.5 * signed_sig + 0.5;
}

/**
 * Convert from an unsigned signal in the range [0, 1] to a signed signal
 * from [-1, 1]. This shifts down and expands the signal.
 * This is useeful for making a signal more like a sine wave.
 */
float signed_signal(float unsigned_sig) {
    return 2.0 *  (unsigned_sig - 0.5);
}

/**
 * Convert from rectangular to polar
 * however, the theta is converted to an angle between 0 and 1
 * since this is typically more useful.
 */
vec2 rect_to_polar(vec2 rect) {
    float r = length(rect);

    // Calculate the angle from [-pi, pi]
    float theta = atan(rect.y, rect.x);
    // Convert to [-1, 1] by dividing by pi
    theta /= PI;
    // Shift to a range of [0.0, 1.0] using the same transform I use
    // for making an unsigned signal
    theta = unsigned_signal(theta);

    return vec2(r, theta);
}

/**
 * Convert from polar coordinates with a normalized angle to (x, y)
 * coordinates.
 */
vec2 polar_to_rect(vec2 polar) {
    float theta_rad = polar.y * TAU;
    float x = polar.x * cos(theta_rad);
    float y = polar.x * sin(theta_rad);
    return vec2(x, y);
}

/**
 * Rotate a polar vector by a fraction of a circle. The result will still
 * be in the range [0, 1]
 */
vec2 polar_rotate(vec2 polar, float amount) {
    vec2 result = polar;
    result.y = fract(polar.y - amount);
    return result;
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
