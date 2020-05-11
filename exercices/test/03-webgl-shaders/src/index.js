import './style/main.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shaderVertex from './shader.vertex.glsl'
import shaderFragment from './shader.fragment.glsl'

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Environment
 */
// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Camera controls
 */
const cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.zoomSpeed = 0.3
cameraControls.enableDamping = true

/**
 * Shader
 */

// Geometry
const shaderGeometry = new THREE.SphereBufferGeometry(1, 64, 64)

const randomAttribute = new Float32Array(shaderGeometry.attributes.position.count)

for(let i = 0; i < shaderGeometry.attributes.position.count; i++)
{
    randomAttribute[i] = Math.random()
}

shaderGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomAttribute, 1))

// Material
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
    uniforms:
    {
        uTime: { value: 0 },
        uFrequency: { value: 30 }
    }
})

// Mesh
const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
scene.add(shaderMesh)

/**
 * Loop
 */
const startTime = Date.now()
const loop = () =>
{
    // Camera controls
    cameraControls.update()

    // Update shader
    const elapsedTime = Date.now() - startTime
    shaderMaterial.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
}

loop()