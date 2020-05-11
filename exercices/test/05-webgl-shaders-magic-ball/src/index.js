import './style/main.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shaderVertex from './shader.vertex.glsl'
import shaderFragment from './shader.fragment.glsl'
import particlesVertex from './particles.vertex.glsl'
import particlesFragment from './particles.fragment.glsl'

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
camera.position.y = 1
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
const shaderGeometry = new THREE.SphereBufferGeometry(1, 128, 128)

// Material
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment,
    uniforms:
    {
        uTime: { value: 0.0 },
        colorLow: { value: new THREE.Color(0xff118a) },
        colorHigh: { value: new THREE.Color(0x240028) },
    }
})

// Mesh
const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
scene.add(shaderMesh)

/**
 * Particles
 */
// Geometry
const particlesCount = 1000
const particlesGeometry = new THREE.BufferGeometry()

const positionArray = new Float32Array(particlesCount * 3)
const sizeArray = new Float32Array(particlesCount * 1)

for(let i = 0; i < particlesCount; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 1 + Math.random() * 0.5
    const x = Math.cos(angle) * radius
    const y = (Math.random() - 0.5) * 5
    const z = Math.sin(angle) * radius

    positionArray[i * 3 + 0] = x
    positionArray[i * 3 + 1] = y
    positionArray[i * 3 + 2] = z

    sizeArray[i] = Math.random() * 60
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1))

// Material
// const particlesMaterial = new THREE.PointsMaterial({ sizeAttenuation: true, size: 0.1 })
const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertex,
    fragmentShader: particlesFragment,
    uniforms:
    {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xff118a) }
    },
    blending: THREE.AdditiveBlending,
    transparent: true
})

// Points
const particlesPoints = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particlesPoints)

/**
 * Loop
 */
const startTime = Date.now()
const loop = () =>
{
    const elapsedTime = Date.now() - startTime

    // Camera controls
    cameraControls.update()

    // Update shader
    shaderMaterial.uniforms.uTime.value = elapsedTime

    // Update particles
    particlesMaterial.uniforms.uTime.value = elapsedTime
    particlesPoints.rotation.y = elapsedTime * 0.0001

    // Render
    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
}

loop()