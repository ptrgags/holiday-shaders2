/**
 * Cosine palette picker
 * modified from http://www.iquilezles.org/www/articles/palettes/palettes.htm
 * by the great Íñigo Quílez
 */
vec3 cosine_palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(TAU * (c * t + d));
}

/**
 * Convert from HSV back to RGB.
 * Yes, this isn't the most efficient way, but this
 * shader isn't that involved.
 *
 * I wrote this back in the spring when I did my vision disorders project
 * https://github.com/ptrgags/vision-disorders
 */
vec3 hsv2rgb(vec3 hsv) {
    float h = hsv.x / 60.0;
    float s = hsv.y;
    float v = hsv.z;

    float chroma = s * v;
    float x = chroma * (1.0 - abs(mod(h, 2.0) - 1.0));

    vec3 rgb;
    if (h <= 1.0)
        rgb = vec3(chroma, x, 0.0);
   	else if (h <= 2.0)
        rgb = vec3(x, chroma, 0.0);
    else if (h <= 3.0)
        rgb = vec3(0, chroma, x);
    else if (h <= 4.0)
        rgb = vec3(0, x, chroma);
    else if (h <= 5.0)
        rgb = vec3(x, 0, chroma);
    else
        rgb = vec3(chroma, 0, x);

    float m = v - chroma;

    return rgb + m;
}
