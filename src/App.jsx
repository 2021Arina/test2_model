import './App.css'
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const App = () => {
  useEffect(() => {

    const camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 13;

    const scene = new THREE.Scene();

    let bee;
    let mixer;
    const loader = new GLTFLoader();
    loader.load(
      '/saturn_planet.glb', // загрузка модели
      function (gltf) {
        bee = gltf.scene;
        bee.scale.set(0.7, 0.7, 0.7)
        bee.position.y = 0;
        bee.position.x = 1;
        bee.rotation.y = 1;
        scene.add(bee);
        mixer = new THREE.AnimationMixer(bee);
        mixer.clipAction(gltf.animations[0]).play();
        console.log(gltf.animations);
      },
      undefined,
      function (err) {
        console.error(err);
      }
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container3D').appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // плавность
    controls.dampingFactor = 0.05;
    controls.enableZoom = true; // зум
    controls.rotateSpeed = 1.0;
    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    const reRender3D = () => {
      requestAnimationFrame(reRender3D);
      renderer.render(scene, camera);
      if(mixer) mixer.update(0.02)
    };
    reRender3D();
    
    return () => {
      document.getElementById('container3D').removeChild(renderer.domElement);
    };
  }, []);

  return <div id="container3D" />;
};

export default App;