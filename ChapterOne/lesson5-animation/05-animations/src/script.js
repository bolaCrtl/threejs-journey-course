import * as THREE from 'three'
import gsap from 'gsap'

//Debug
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


//animation

const clock = new THREE.Clock()
gsap.to(mesh.position, { duration: 3, delay: 1, x: 2 })
const tick =() => {
//     const elapsedTime = clock.getElapsedTime()
//    camera.position.x = Math.cos(elapsedTime)
//     camera.position.y = Math.sin(elapsedTime)
//     camera.lookAt(mesh.position)
    renderer.render(scene, camera)
    
    window.requestAnimationFrame(tick)
}

tick()




// Renderer

// renderer.render(scene, camera)
