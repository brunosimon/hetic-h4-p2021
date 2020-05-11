uniform float uTime;

attribute float size;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y = - (mod(modelPosition.y + uTime * 0.0003, 5.0) - 2.5);

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = size;
    gl_PointSize *= (1.0 / - viewPosition.z);
}