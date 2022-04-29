import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let camera, scene, renderer;
function init() {
          const container = document.createElement( 'div' );
          document.body.appendChild( container );
  
          camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
          //camera.position.set( - 1.8, 0.6, 2.7 );
          camera.position.setZ(30);
          camera.position.setX(-3);
  
          scene = new THREE.Scene();
  
          new RGBELoader()
            .setPath( './' )
            .load( 'royal_esplanade_1k.hdr', function ( texture ) {
  
              texture.mapping = THREE.EquirectangularReflectionMapping;
  
              scene.background = texture;
              scene.environment = texture;
  
              render();
  
              // model
  
              const loader = new GLTFLoader().setPath( './' );
              loader.load( 'Brain.gltf', function ( gltf ) {
  
                scene.add( gltf.scene );
  
                render();
  
              } );
  
            } );
  
          renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.querySelector('#bg') } );
          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.setSize( window.innerWidth, window.innerHeight );
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1;
          renderer.outputEncoding = THREE.sRGBEncoding;
          container.appendChild( renderer.domElement );
  
          const controls = new OrbitControls( camera, renderer.domElement );
          //controls.addEventListener( 'change', render ); // use if there is no animation loop
          controls.minDistance = 2;
          controls.maxDistance = 10;
          controls.target.set( 0, 0, -20 );
          controls.update();
  
          window.addEventListener( 'resize', onWindowResize );
  
        }

        init();

        function onWindowResize() {
          
                  camera.aspect = window.innerWidth / window.innerHeight;
                  camera.updateProjectionMatrix();
          
                  renderer.setSize( window.innerWidth, window.innerHeight );
          
                  render();
          
                }

                function render() {
                  
                          renderer.render( scene, camera );
                  
                        }


//const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector('#bg')
// });

// renderer.setPixelRatio( window.devicePixelRatio);
// renderer.setSize( window.innerWidth, window.innerHeight);
// camera.position.setZ(30);
// camera.position.setX(-3);

renderer.render( scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200,50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

var ring;

function addring(a, b){
  const geometry = new THREE.TorusGeometry(a,b,16,100);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
  ring = new THREE.Mesh(geometry, material);

  scene.add(ring);
}

//addring(7,1);
addring(10,1);


function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

   const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

   star.position.set(x,y,z);
   scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);


moon.position.z = 10;
moon.position.setX(0);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = t * 0.001;
  camera.position.x = t * 0.0002;
  camera.rotation.y = t * 0.0002;


}

document.body.onscroll = moveCamera;
moveCamera();



function animate(){
  requestAnimationFrame(animate);

  // torus.rotation.x +=0.01;
  // torus.rotation.y +=0.005;
  // torus.rotation.z +=0.01;

  ring.rotation.x +=0.01;
  ring.rotation.y +=0.005;
  ring.rotation.z +=0.01;

  moon.rotation.x += 0.0;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.00;

  controls.update();

  renderer.render(scene, camera);
}

animate();