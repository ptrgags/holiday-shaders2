

/**
 * Fractal brownian motion as a summation of Perlin Noise functions.
 * Modified  from The Book of Shaders
 * https://thebookofshaders.com/13/
 */
#define MAX_OCTAVES 100
float fbm(
        vec2 uv,
        float amplitude,
        float frequency,
        float gain,
        float lacunarity,
        int octaves) {
    // Initial values
    float value = 0.0;

    // Sum a bunch of
    for (int i = 0; i < MAX_OCTAVES; i++) {
        // Only do the specified number of octaves.
        if (i >= octaves)
            break;
        value += amplitude * perlin_noise(frequency * uv);
        frequency *= lacunarity;
        amplitude *= gain;
    }
    return value;
}

/**
 * Fractal Brownian Motion within Fractal Brownian motion.
 * Basically:
 * fbm_ception(uv) = fbm(uv + fbm(uv + fbm(uv)))
 * except the  number of fbm calls is variable.
 */
#define NESTING_LIMIT 10
float fbm_ception(
        vec2 uv,
        float amplitude,
        float frequency,
        float gain,
        float lacunarity,
        int octaves,
        int nest_amount) {
    float result = 0.0;
    for (int i = 0; i < NESTING_LIMIT; i++) {
        if (i >=nest_amount)
            break;
        result = fbm(
            uv + result, amplitude, frequency, gain, lacunarity, octaves);
    }
    return result;
}
