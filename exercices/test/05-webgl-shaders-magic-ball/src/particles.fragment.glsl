uniform vec3 uColor;

void main()
{
    float alpha = 1.0 - distance(gl_PointCoord, vec2(0.5)) * 2.0;
    alpha = pow(alpha, 3.0);
    gl_FragColor = vec4(uColor, alpha);
}