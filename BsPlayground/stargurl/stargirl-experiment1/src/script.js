import * as THREE from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Object
 */

const shape = new THREE.Shape();

const outer = 1;
const inner = 0.5;
const cornerRadius = 0.05; // how round the tips are

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

  const dir1 = prev.clone().sub(curr).normalize();
  const dir2 = next.clone().sub(curr).normalize();

  const p1 = curr.clone().add(dir1.multiplyScalar(cornerRadius));
  const p2 = curr.clone().add(dir2.multiplyScalar(cornerRadius));

  if (i === 0) {
    shape.moveTo(p1.x, p1.y);
  } else {
    shape.lineTo(p1.x, p1.y);
  }

  shape.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
}

shape.closePath();

const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 0.3,
  bevelEnabled: false,
  curveSegments: 16
});

geometry.computeVertexNormals();
geometry.center();





const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


 
//animation

const clock = new THREE.Clock()
gsap.to(mesh.scale, {x: 2, y: 2, z: 2, duration:1, yoyo:true, repeat:-1, })

const tick = () => {

    // mesh.rotateY(0.01)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
// renderer.render(scene, camera)