/**
 * This is a list of a bunch of reusable binary patterns that return
 * either 0.0 or 1.0. There are also functions to select the patterns
 */

#define TOTAL_PATTERNS 16.0
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
    float max_coord = max(cell_uv.x, cell_uv.y);
    float big_square = 1.0 - step(0.85, max_coord);
    float small_square = 1.0 - step(0.7, max_coord);
    return big_square - small_square;
}

/**
 * Make a brick wall texture
 */
float bricks(vec2 uv, float scale) {
    vec2 scaled = uv * vec2(scale, scale * 2.0);
    vec2 cell_id = floor(scaled);
    float shift = 0.5 * mod(cell_id.y, 2.0);
    scaled.x += shift;
    vec2 cell_uv = fract(scaled);
    vec2 border = step(vec2(0.1, 0.2), cell_uv);
    return min(border.x, border.y);
}

/**
 * Make some parallel curves
 */
float curves(vec2 uv, float num_curves) {
    float y = uv.y * num_curves;
    y += smoothstep(0.0, 1.0, uv.x);
    float curve_id = floor(y);
    return mod(curve_id, 2.0);
}

float interference(vec2 uv, float freq) {
    // This needs to be a larger number than
    float scaled_freq = 10.0 * freq;
    float dist1 = length(uv);
    float dist2 = length(1.0 - uv);
    float wave1 = sin(dist1 * scaled_freq);
    float wave2 = sin(dist2 * scaled_freq);
    float superposition = wave1 + wave2;
    return step(0.0, superposition);
}

/**
 * Make a bunch of horizontal spikes
 * pointing to the left.
 */
float spikes(vec2 uv, float num_spikes) {
    float y = uv.y * num_spikes;
    float y_uv = fract(y);
    float thickness = 0.5 * uv.x;
    float dist_center = abs(y_uv - 0.5);
    return float(dist_center < thickness);
}

float select_pattern(vec2 uv, float select, float parameter) {
    int index = int(select * TOTAL_PATTERNS);
    if (index == 0) {
        // TODO: Select via noise buffer
        return stripes(uv, parameter);
    } else if (index == 1) {
        return waves(uv, parameter);
    } else if (index == 2) {
        return checkered(uv, parameter);
    } else if (index == 3) {
        return 0.3;
    } else if (index == 4) {
        return corners(uv, parameter);
    } else if (index == 5) {
        return 0.3;
    } else if (index == 6) {
        return bricks(uv, parameter);
    } else if (index == 7) {
        return curves(uv, parameter);
    } else if (index == 11) {
        return interference(uv, parameter);
    } else if (index == 12) {
        return spikes(uv, parameter);
    } else {
        return 0.5;
    }
}
