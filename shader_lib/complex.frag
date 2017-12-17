/**
 * Complex multiplication:
 * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 */
vec2 complex_mult(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x);
}

/**
 * Complex division:
 * (a + bi) / (c + di) =
 * let divisor = c^2 + d^2 in
 * (ac + bd)/divisor + ((bc - ad)/divisor)i
 */
vec2 complex_div(vec2 a, vec2 b) {
    float divisor = dot(b, b);

    // Handle divide by 0
    if (divisor == 0.0)
        return vec2(0.0);
    else {
        return vec2(
            (a.x * b.x + a.y * b.y) / divisor,
            (a.y * b.x - a.x * b.y) / divisor
        );
    }
}


/**
 * Raise complex z to a real integer power.
 * This is done naively; I'm used to doing fast exponentiation
 * but GLSL doesn't have recursion :(
 */
#define MAX_POWER 10
vec2 complex_power(vec2 z, int power) {
    vec2 val = vec2(1.0, 0.0);
    for (int i = 0; i < MAX_POWER; i++) {
        if (i >= power)
            break;
        val = complex_mult(val, z);
    }
    return val;
}
