#define TOTAL_PATTERNS 1.0
/**
 * Return horizontal stripes like this:
 *
 * 111111111
 * 000000000
 * 111111111
 * 000000000
 */
float stripes(vec2 uv, float num_stripes) {
    float y = uv.y * num_stripes;
    float stripe_id = floor(y);
    return mod(stripe_id, 2.0);
}

/**
 * Return circular waves out from the bottom-left corner
 */
float waves(vec2 uv, float num_waves) {
    float r = length(uv) * num_waves;
    float wave_id =  floor(r);
    return mod(wave_id, 2.0);
}

/**
 * Return a checkerboard pattern.
 */
 float checkered(vec2 uv, float scale) {
     vec2 scaled = uv * scale;
     vec2 cell_coords = floor(scaled);
     float id = cell_coords.x + cell_coords.y;
     return mod(id, 2.0);
 }

/**
 * Draw chevron shapes that look like corners of a square
 */
float corners(vec2 uv, float scale) {
    vec2 scaled = uv * scale;
    vec2 cell_uv = fract(scaled);
    float maximum = max(cell_uv.x, cell_uv.y);
    float big_square = 1.0 - step(0.85, maximum);
    float small_square = 1.0 - step(0.7, maximum);
    return big_square - small_square;
}

float select_pattern(vec2 uv, float select) {
    int index = int(select * TOTAL_PATTERNS);
    if (index == 0) {
        // TODO: Select via noise buffer
        return stripes(uv, 3.0);
    } else if (index == 1) {
        return waves(uv, 4.0);
    } else if (index == 2) {
        return checkered(uv, 4.0);
    } else if (index == 3) {
        return 0.8;
    } else if (index == 4) {
        return corners(uv, 5.0);
    } else {
        return 0.5;
    }
}
