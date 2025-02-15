uniform vec2 uResolution;
uniform float uTime;

const float threshold = 0.785;

const vec3 chromakeyColor = vec3(0.0,0.0,0.0);

float random(in float x){ return fract(sin(x)*43758.5453); }
float random(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float bin(vec2 ipos, float n){
    float remain = mod(n,33554432.);
    for(float i = 0.0; i < 25.0; i++){
        if ( floor(i/3.) == ipos.y && mod(i,3.) == ipos.x ) {
            return step(1.0,mod(remain,2.));
        }
        remain = ceil(remain/2.);
    }
    return 0.0;
}

float char(vec2 st, float n){
    st.x = st.x*2.-0.5;
    st.y = st.y*1.2-0.1;

    vec2 grid = vec2(3.,5.);

    vec2 ipos = floor(st*grid);
    vec2 fpos = fract(st*grid);

    n = floor(mod(n,10.));
    float digit = 0.0;
    if (n < 1. ) { digit = 31600.; }
    else if (n < 2. ) { digit = 9363.0; }
    else if (n < 3. ) { digit = 31184.0; }
    else if (n < 4. ) { digit = 31208.0; }
    else if (n < 5. ) { digit = 23525.0; }
    else if (n < 6. ) { digit = 29672.0; }
    else if (n < 7. ) { digit = 29680.0; }
    else if (n < 8. ) { digit = 31013.0; }
    else if (n < 9. ) { digit = 31728.0; }
    else if (n < 10. ) { digit = 31717.0; }
    float pct = bin(ipos, digit);

    vec2 borders = vec2(1.);
    borders *= step(0.0,st)*step(0.0,1.-st);            // outer

    return step(.5,1.0-pct) * borders.x * borders.y;
}
vec3 Rain(vec2 fragCoord)
    {
    fragCoord.x -= mod(fragCoord.x, 16.);
    float offset = sin(fragCoord.x * 15.);
    float speed = cos(fragCoord.x * 3.) * .1 + .15;
    float y = fract(fragCoord.y / uResolution.y + uTime * speed + offset);
    return vec3(.1, .1, .35) / (y * 3.);
}

void main(){
    vec2 st = gl_FragCoord.st/uResolution.xy ;
    st.x *= uResolution.x/uResolution.y;

    float rows = 34.0;
    vec2 ipos = floor(st*rows);
    vec2 fpos = fract(st*rows);

    ipos += vec2(0.,floor(uTime*30.*random(ipos.x+1.)));
    float pct = random(ipos);
    vec3 color = vec3(char(fpos,100.*pct));
    color = mix(vec3(color.r, 0., 0.), vec3(0., color.g,0.),step(.03,pct));
    float difference = length(chromakeyColor - color.rgb);

    gl_FragColor =difference < threshold ? vec4(0.0,0.0,0.0,.5) : vec4( smoothstep(0., 1., color * Rain(ipos)) , 1.);
}