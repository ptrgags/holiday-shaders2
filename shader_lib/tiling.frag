/**
 * This file contains structs and things to 
 */

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
