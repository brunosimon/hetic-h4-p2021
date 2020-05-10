/**
 * Canvas
 */
const canvas = document.querySelector('.js-canvas')
canvas.width = 600
canvas.height = 400

/**
 * Context WebGL
 */
const gl = canvas.getContext('webgl')

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
// gl.clearColor(0, 0, 0, 0)
// gl.clear(gl.COLOR_BUFFER_BIT)

/**
 * Shaders
 */

// Create shader function
const createShader = (_type, _source) =>
{
    // Create and compile shader
    const shader = gl.createShader(_type)
    gl.shaderSource(shader, _source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    // Success
    if(success)
    {
        return shader
    }

    // Error
    console.warn('Error creating shader', shader)
    gl.deleteShader(shader)
}

const vertexShader = createShader(gl.VERTEX_SHADER, `
    attribute vec2 aPosition;

    varying vec2 vUv;

    void main()
    {
        gl_Position = vec4(aPosition, 1.0, 1.0);
        vUv = aPosition * vec2(0.5) + vec2(0.5);
    }
`)
const fragmentShader = createShader(gl.FRAGMENT_SHADER, `
    precision mediump float;

    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec4 uTeint;

    varying vec2 vUv;

    void main()
    {
        vec4 color = texture2D(uTexture, vec2(vUv.x, 1.0 - vUv.y));
        color.rgb *= 0.7 + sin(uTime * 0.001) * 0.3;
        
        color.rgb *= 1.0 - distance(vUv, vec2(0.5)) * 2.0 + 0.4; // Vignette
        color.rgb = mix(color.rgb, uTeint.rgb, uTeint.a);
        color.rgb *= 1.2; // Contrast

        gl_FragColor = color;
    }
`)

/**
 * Program
 */

// Create program function
const createProgram = (_vertexShader, _fragmentShader) =>
{
    // Create program, attach shaders and link it to the GL context
    const program = gl.createProgram()
    gl.attachShader(program, _vertexShader)
    gl.attachShader(program, _fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)

    // Success
    if(success)
    {
        return program
    }

    // Error
    console.warn('Error creating program', program)
    gl.deleteProgram(program)
}

const program = createProgram(vertexShader, fragmentShader)
gl.useProgram(program)

/**
 * Uniforms
 */

// Time
const timeUniformLocation = gl.getUniformLocation(program, 'uTime')
gl.uniform1f(timeUniformLocation, 0.0)

// Teint
const teintUniformLocation = gl.getUniformLocation(program, 'uTeint')
gl.uniform4f(teintUniformLocation, 1.0, 0.1, 0.4, 0.15)

// Texture
const textureImage = new Image()

textureImage.addEventListener('load', () =>
{
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
})

textureImage.src = './image-600x400.jpg'

/**
 * Attributes
 */

// Position
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition')
gl.enableVertexAttribArray(positionAttributeLocation)
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

const positions = [
    - 1, 1,
    1, - 1,
    - 1, - 1,
    1, - 1,
    - 1, 1,
    1, 1
]

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

/**
 * Loop
 */
const startTime = Date.now()
const loop = () =>
{
    // Update uniforms
    const elapsedTime = Date.now() - startTime
    gl.uniform1f(timeUniformLocation, elapsedTime)
    
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    window.requestAnimationFrame(loop)
}

loop()