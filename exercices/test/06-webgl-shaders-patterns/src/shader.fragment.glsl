varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.577);
}

vec2 rotate(vec2 v, float a)
{
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    // // 0
    // float strength = mod(vUv.x * 10.0, 1.0);

    // // 1
    // float strength = step(mod(vUv.x * 10.0, 1.0), 0.2);
    
    // // 2
    // float strength = step(mod(vUv.y * 10.0, 1.0), 0.2);
    
    // // 3
    // float strength = max(step(mod(vUv.y * 10.0, 1.0), 0.2), step(mod(vUv.x * 10.0, 1.0), 0.2));
    
    // // 4
    // float strength = min(step(mod(vUv.y * 10.0, 1.0), 0.2), step(mod(vUv.x * 10.0, 1.0), 0.2));
    
    // // 5
    // float strength = step(mod(vUv.y * 10.0, 1.0), 0.2) * step(mod(vUv.x * 10.0, 1.0), 0.5);
    
    // // 6
    // float strength = step(mod(vUv.y * 10.0, 1.0), 0.2) * step(mod(vUv.x * 10.0 + 0.15, 1.0), 0.5);
    // strength += step(mod(vUv.x * 10.0, 1.0), 0.2) * step(mod(vUv.y * 10.0 + 0.15, 1.0), 0.5);
    
    // // 7
    // float strength = mod(vUv.x * 10.0, 1.0) * mod(vUv.y * 10.0, 1.0);
    
    // // 8
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    
    // // 9
    // float strength = random(vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0));
    
    // // 10
    // float strength = random(vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y - vUv.x * 0.5) * 10.0) / 10.0));
    
    // // 11
    // float strength = 1.0 - distance(vUv, vec2(floor(vUv.x * 10.0 + 0.5) / 10.0, floor(vUv.y * 10.0 + 0.5) / 10.0)) * 30.0;
    
    // // 12
    // float strength = distance(vUv, vec2(0.5));
    
    // // 13
    // float strength = 1.0 - distance(vUv, vec2(0.5)) * 2.0;
    
    // // 14
    // float strength = 1.0 / distance(vUv, vec2(0.5)) * 0.02;
    
    // // 15
    // float strength = 1.0 / distance(vUv * vec2(1.0, 5.0), vec2(0.5, 2.5)) * 0.02;
    
    // // 16
    // float strength = 1.0 / distance(vUv, vec2(0.5)) * 0.02;
    // strength += 1.0 / distance(vUv * vec2(1.0, 10.0), vec2(0.5, 5.0)) * 0.02;
    // strength += 1.0 / distance(vUv * vec2(10.0, 1.0), vec2(5.0, 0.5)) * 0.02;
    
    // // 17
    // float pi = 3.141592653589793;
    // vec2 newUv = rotate(vUv - vec2(0.5), pi * 0.25) + vec2(0.5);
    // float strength = 1.0 / distance(newUv, vec2(0.5)) * 0.02;
    // strength += 1.0 / distance(newUv * vec2(1.0, 10.0), vec2(0.5, 5.0)) * 0.02;
    // strength += 1.0 / distance(newUv * vec2(10.0, 1.0), vec2(5.0, 0.5)) * 0.02;
    
    // // 18
    // float strength = step(distance(vUv, vec2(0.5)), 0.25);
    
    // // 19
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    
    // // 20
    // float strength = step(abs(distance(vUv, vec2(0.5)) - 0.25), 0.01);
    
    // // 21
    // vec2 newUv = vUv;
    // newUv.y += sin(newUv.x * 30.0) * 0.1;
    // float strength = step(abs(distance(newUv, vec2(0.5)) - 0.25), 0.01);
    
    // // 22
    // vec2 newUv = vUv;
    // newUv.y += sin(vUv.x * 30.0) * 0.1;
    // newUv.x += sin(vUv.y * 30.0) * 0.1;
    // float strength = step(abs(distance(newUv, vec2(0.5)) - 0.25), 0.01);

    // // 23
    // vec2 newUv = vUv;
    // newUv.y += sin(vUv.x * 100.0) * 0.1;
    // newUv.x += sin(vUv.y * 100.0) * 0.1;
    // float strength = step(abs(distance(newUv, vec2(0.5)) - 0.25), 0.01);

    // // 24
    // float pi = 3.14159;
    // float angle = (atan(vUv.x - 0.5, vUv.y - 0.5) + pi) / (pi * 2.0);
    // float strength = angle;

    // // 25
    // float pi = 3.141592653589793;
    // float angle = (atan(vUv.x - 0.5, vUv.y - 0.5) + pi) / (pi * 2.0);
    // float strength = mod(angle * 20.0, 1.0);

    // // 26
    // float pi = 3.141592653589793;
    // float angle = (atan(vUv.x - 0.5, vUv.y - 0.5) + pi) / (pi * 2.0);
    // float strength = sin(angle * pi * 20.0);

    // // 27
    // float pi = 3.141592653589793;
    // float angle = (atan(vUv.x - 0.5, vUv.y - 0.5) + pi) / (pi * 2.0);
    // float radius = sin(angle * pi * 20.0);
    // float strength = step(abs(distance(vUv, vec2(0.5)) - 0.25 + radius * 0.025), 0.01);

    // // 28
    // float pi = 3.141592653589793;
    // float angle = (atan(vUv.x - 0.5, vUv.y - 0.5) + pi) / (pi * 2.0);
    // float radius = sin(angle * pi * 20.0);
    // float strength = step(abs(distance(vUv, vec2(0.5)) - 0.25 + radius * 0.025), 0.01);
    // strength += step(abs(distance(vUv, vec2(0.5)) - 0.15 + radius * 0.025), 0.01);
    // strength += step(abs(distance(vUv, vec2(0.5)) - 0.35 + radius * 0.025), 0.01);

    // // 29
    // float strength = cnoise(vUv * 10.0) * 0.5 + 0.5;

    // 30
    float strength = step(cnoise(vUv * 10.0), - 0.25);

    // // 31
    // float strength = step(mod(cnoise(vUv * 10.0) * 4.0, 1.0), 0.1);

    gl_FragColor = vec4(vec3(strength), 1.0);
}