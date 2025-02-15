uniform float uTime;

const float res = 512.0;
const float vect = 1.0;
const float threshold = 0.785;

const vec3 chromaKeyColor = vec3(0.0, 0.0, 0.0);

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main() {
    vec2 st = gl_FragCoord.xy/res;

    vec2 grid = vec2(100.0,50.);
    st *= grid;

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec2 vel = vec2(uTime*2.*max(grid.x,grid.y)); // time
    vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction

    // Assign a random value base on the integer coord
    vec2 offset = vec2(0.1,0.);

    vec3 color = vec3(0.);
    color.r = pattern(st+offset,vel,sin(uTime *.3) * 0.192 + 0.268);
    color.g = pattern(st,vel,sin(uTime * .3) * 0.764 );
    color.b = pattern(st-offset,vel,sin(uTime * .3) * 0.296 + 0.608);

    // Margins
    color *= step(0.2,fpos.y);
    
    float difference = length(chromaKeyColor - color.rgb);

    gl_FragColor = difference < threshold ? vec4(0.0, 0.0, 0.0, 0.0) : vec4(1.0-color,0.5);
}