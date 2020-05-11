uniform vec3 colorLow;
uniform vec3 colorHigh;

varying float vElevation;

void main()
{
    float strength = vElevation * 5.0 + 1.0;
    vec3 color = mix(colorLow, colorHigh, strength);
    gl_FragColor = vec4(color, 1.0);
}