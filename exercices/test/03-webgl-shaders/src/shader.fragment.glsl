uniform float uFrequency;
uniform float uTime;

varying vec4 vModelPosition;
varying float vRandom;

void main()
{
    gl_FragColor = vec4(sin(vModelPosition.x * uFrequency + uTime * 0.0) * vRandom, 0.0, 0.0, 1.0);
}