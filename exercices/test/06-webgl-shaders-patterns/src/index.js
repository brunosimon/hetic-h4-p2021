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
camera.position.y = - 0.3
camera.position.x = 0.5
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
const shaderGeometry = new THREE.PlaneBufferGeometry(3.5, 3.5)

// Material
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment
})

// Mesh
const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
scene.add(shaderMesh)

/**
 * Loop
 */
const loop = () =>
{
    // Camera controls
    cameraControls.update()

    // Render
    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
}

loop()