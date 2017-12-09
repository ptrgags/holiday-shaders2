/**
 * Hash vec2 -> float
 * Borrowed from https://thebookofshaders.com/11/
 */
float hash21(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453123);
}

/**
 * Hash vec2 -> vec2
 * Modified from https://www.shadertoy.com/view/ldl3W8 by the great
 * Inigo Quilez
 */
vec2 hash22(vec2 uv) {
    // Project UV in two different directions that are close to prime numbers
    float dot1 = dot(uv, vec2(127.1,311.7));
    float dot2 = dot(uv, vec2(269.5, 183.3));

    // Store in a vec2
    vec2 dots = vec2(dot1, dot2);

    // Scramble the vector
    return fract(sin(dots) * 43758.5453);
}
