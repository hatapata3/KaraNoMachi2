
uniform float uTime;
varying vec2 vUv;

const float PI = 3.141592653589793238;

vec2 fixAspect(vec2 uv) {
    uv -= 0.5;
    uv.y /= vUv.x / vUv.y;
    uv += 0.5;
    return uv;
}

void main() {
    vec2 uv = gl_FragCoord.xy / 512.0;

    vec3 color = vec3(uv, sin(uTime * .2) * .5 + .5);

    gl_FragColor = vec4(color, 1.0);
}