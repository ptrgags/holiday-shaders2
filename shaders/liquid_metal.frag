import hash.frag
import perlin_noise.frag
import fractal_brownian_motion.frag
import display.frag
import signals.frag
import noise.frag
import color.frag
-- END IMPORTS --

void main() {
    vec2 uv = CENTERED_UV;
    float amp = 0.8;
    float freq = 3.0;
    float gain = 0.8;
    float lacunarity = 1.8;
    int octaves = 1;
    int nesting = 3;

    const int ITERATIONS = 3;

    vec2 offset = noise_vec2(4.0);
    vec2 motion = hash22(offset) * time * 0.8;
    uv += motion;

    float metal = unsigned_signal(sin(0.5 * time));
    float max_amp = max_amp(amp, gain, octaves);
    for (int i = 0; i < ITERATIONS; i++) {
        metal = fbm(uv + metal, amp, freq, gain, lacunarity, octaves);
        metal = unsigned_signal(sin(10.0 * metal / max_amp));
    }

    vec3 a = noise_vec3(3.0);
    vec3 b = noise_vec3(14.0);
    vec3 c = noise_vec3(18.0);
    vec3 d = noise_vec3(32.0);

    vec3 color = cosine_palette(metal, a, b, c, d);

    float hue = 360.0 * noise_lookup(6.0);
    float saturation = 1.0;
    float value = 1.0;
    vec3 hsv = vec3(hue, saturation, value);
    vec3 rgb = hsv2rgb(hsv);

    gl_FragColor = display(color * metal);
}
