uniform vec3 colorLow;
uniform vec3 colorHigh;

varying float vElevation;

void main()
{
    float strength = vElevation * 1.3 + 0.5;
    vec3 color = mix(colorLow, colorHigh, strength);
    gl_FragColor = vec4(color, 1.0);
}