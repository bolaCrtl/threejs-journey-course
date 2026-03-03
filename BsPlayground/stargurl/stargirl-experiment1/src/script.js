import * as THREE from 'three'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//GUI
const gui = new GUI()

//Texture 
const textureLoader = new THREE.TextureLoader()

const scratchTexture = textureLoader.load('/grunge_style_background_with_scratched_texture_overlay_1506')

//Environment map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./moonless_golf_4k.hdr', (environmentMap) => {
     environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = new THREE.Color(0x0f0f14); 
    scene.environment = environmentMap
})

/**
 * Object
 */

const shape = new THREE.Shape();

const outer = 1.2;
const inner = 0.5;
const cornerRadius = outer * 0.05; // how round the tips are

// Generate star points
const pts = [];
for (let i = 0; i < 10; i++) {
  const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
  const radius = i % 2 === 0 ? outer : inner;

  pts.push(new THREE.Vector2(
    Math.cos(angle) * radius,
    -Math.sin(angle) * radius
  ));
}

// Create rounded corners
for (let i = 0; i < 10; i++) {

  const prev = pts[(i - 1 + 10) % 10];
  const curr = pts[i];
  const next = pts[(i + 1) % 10];


  if (i % 2 === 0) {
    // 🔵 OUTER TIP → rounded

    const dir1 = prev.clone().sub(curr).normalize();
    const dir2 = next.clone().sub(curr).normalize();

    const p1 = curr.clone().add(dir1.multiplyScalar(cornerRadius));
    const p2 = curr.clone().add(dir2.multiplyScalar(cornerRadius));

    if (i === 0) shape.moveTo(p1.x, p1.y);
    else shape.lineTo(p1.x, p1.y);

    shape.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);

  } else {
    // 🔴 INNER VALLEY → sharp
    if (i === 0) shape.moveTo(curr.x, curr.y);
    else shape.lineTo(curr.x, curr.y);
  }
}

shape.closePath();

const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 0.3,
  bevelEnabled: true,
  curveSegments: 16
});

geometry.computeVertexNormals();
geometry.center();


const material = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.1, color: 0xdcdcdc})
const textMaterial = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.1, color: 0xdcdcdc, map:scratchTexture})


//fonts
const fontloader = new FontLoader()
fontloader.load(
  '/Madina_Regular.json', 
  (font) => {
     const textGeometry = new TextGeometry ('Not Everyone Can Be A Star', 
      {
        font: font,
        size: 1,
        depth: 0.5,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    } )
    const text = new THREE.Mesh(textGeometry, material)
    textGeometry.center()
    scene.add(text)
  }
)

const textZ = 0
const textBuffer = 3

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
geometry.center()
for (let i = 0; i < 70; i++ ) {
  const mesh = new THREE.Mesh(geometry, material)

  const scale = Math.random()
  mesh.scale.set(scale, scale, scale)
  mesh.position.x = (Math.random() - 0.5) * 10
  mesh.position.y = (Math.random() - 0.5) * 10
  let z = (Math.random() - 0.5) * 10;
  if (z > textZ - textBuffer && z < textZ + textBuffer) {
    z += (z < 0 ? -textBuffer : textBuffer);
  }
  mesh.position.z = z
  mesh.rotation.y =+ 0.5
  scene.add(mesh)
}




//lights

const ambientLights = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLights)

const pointLight = new THREE.PointLight(0xffffff, 20)
pointLight.position.set(0, 0, 0)





/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('dblclick', () =>
    {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    
        if(!fullscreenElement)
        {
            if(canvas.requestFullscreen)
            {
                canvas.requestFullscreen()
            }
            else if(canvas.webkitRequestFullscreen)
            {
                canvas.webkitRequestFullscreen()
            }
        }
        else
        {
            if(document.exitFullscreen)
            {
                document.exitFullscreen()
            }
            else if(document.webkitExitFullscreen)
            {
                document.webkitExitFullscreen()
            }
        }
    }) 

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 7
camera.add(pointLight) 
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

renderer.outputColorSpace = THREE.SRGBColorSpace;

 
//animation

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
 
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
// renderer.render(scene, camera)