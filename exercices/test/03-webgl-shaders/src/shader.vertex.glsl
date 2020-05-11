uniform float uFrequency;
uniform float uTime;

attribute float aRandom;

varying vec4 vModelPosition;
varying float vRandom;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(position.y * uFrequency + uTime * 0.002) * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vModelPosition = modelPosition;
    vRandom = aRandom;
}