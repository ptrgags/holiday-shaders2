import hash.frag
import perlin_noise.frag
import fractal_brownian_motion.frag
import display.frag
import signals.frag
import noise.frag
-- END IMPORTS --

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.x;
    uv -= noise_vec2(4.0);
    uv *= 4.0 * noise_lookup(3.0);
    float amp = 0.5;
    float freq = 2.0;
    float gain = 0.2;
    float lacunarity = 2.0;
    int octaves = 2;
    float swirl = fbm(
        uv, amp, freq, gain, lacunarity, octaves);
    float num_ripples = mix(100.0, 500.0, noise_lookup(1.0));
    float phase_speed = noise_lookup(2.0);
    float ripples = sin(num_ripples * swirl + phase_speed * time);



    gl_FragColor = display(ripples);
}
