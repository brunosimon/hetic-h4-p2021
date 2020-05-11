import './style/main.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import doorColorSource from './images/house/door/color.jpg'
import doorAmbientOcclusionSource from './images/house/door/ambientOcclusion.jpg'
import doorHeightSource from './images/house/door/height.png'
import doorMetalnessSource from './images/house/door/metalness.jpg'
import doorNormalSource from './images/house/door/normal.jpg'
import doorAlphaSource from './images/house/door/alpha.jpg'
import doorRoughnessSource from './images/house/door/roughness.jpg'
import matcapSource from './images/matcaps/4.jpg'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load(doorColorSource)
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusionSource)
const doorHeightTexture = textureLoader.load(doorHeightSource)
const doorMetalnessTexture = textureLoader.load(doorMetalnessSource)
const doorNormalTexture = textureLoader.load(doorNormalSource)
const doorAlphaTexture = textureLoader.load(doorAlphaSource)
const doorRoughnessTexture = textureLoader.load(doorRoughnessSource)
const matcapTexture = textureLoader.load(matcapSource)

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
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

/**
 * Lights
 */
const pointLight = new THREE.PointLight(0xffffff, 1, 10)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Objects
 */
const objectsGroup = new THREE.Group()
scene.add(objectsGroup)

// Material
// const material = new THREE.MeshBasicMaterial({
//     map: doorColorTexture,
//     alphaMap: doorAlphaTexture,
//     transparent: true,
//     opacity: 0.8,
//     color: 0xaaffaa,
//     wireframe: true,
//     side: THREE.FrontSide
// })
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshMatcapMaterial({
//     matcap: matcapTexture
// })
// const material = new THREE.MeshLambertMaterial({})
// const material = new THREE.MeshPhongMaterial({})
// const material = new THREE.MeshToonMaterial({})
const material = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    transparent: true
})

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), material)
sphere.position.x = - 6
objectsGroup.add(sphere)

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 4, 4), material)
objectsGroup.add(plane)

// Torus Knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.5, 128, 16), material)
torusKnot.position.x = 6
objectsGroup.add(torusKnot)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Camera controls
 */
const cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.zoomSpeed = 0.3
cameraControls.enableDamping = true

/**
 * Loop
 */
const loop = () =>
{
    // Update objects
    sphere.rotation.y += 0.002
    plane.rotation.y += 0.002
    torusKnot.rotation.y += 0.002

    // Update camera controls
    cameraControls.update()

    // Render
    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
}

loop()