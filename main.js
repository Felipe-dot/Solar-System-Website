import * as THREE from "three";
import createPlanet from "./pages/lib/Planet";

import sunTexture from "/sun.jpg";
import mercuryTexture from "/mercury.jpg";
import venusTexture from "/venus.jpg";
import earthTexture from "/earth.jpg";
import marsTexture from "/mars.jpg";
import jupiterTexture from "/jupiter.jpg";
import saturnTexture from "/saturn.jpg";
import saturnRingTexture from "/saturn ring.png";
import uranusTexture from "/uranus.jpg";
import uranusRingTexture from "/uranus ring.png";
import neptuneTexture from "/neptune.jpg";
import moonTexture from "/moon.jpg";
import starsTexture from "/stars.jpg";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
camera.position.setZ(30);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x404040, Math.PI);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, Math.PI);
directionalLight.position.set(5, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const textureload = new THREE.TextureLoader();

var auraGeometry = new THREE.SphereGeometry(10, 32, 32);
var auraMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.3,
});
var aura = new THREE.Mesh(auraGeometry, auraMaterial);

//sun
const sunGeo = new THREE.SphereGeometry(12, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureload.load(sunTexture),
});

const sun = new THREE.Mesh(sunGeo, sunMat);
sun.name = "sol";
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 10, 1000);
scene.add(pointLight);

// Adicionando planetas
const mercury = new createPlanet("Mercúrio", 4, mercuryTexture, 20);
const venus = new createPlanet("Vênus", 5, venusTexture, 40);
const moon = new createPlanet("Lua", 3.5, moonTexture, 15);

const earth = new createPlanet("Terra", 5.56, earthTexture, 75);
const mars = new createPlanet("Marte", 5, marsTexture, 100);
const jupiter = new createPlanet("Júpiter", 6, jupiterTexture, 120);
const saturn = new createPlanet("Saturno", 8, saturnTexture, 160, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = new createPlanet("Urano", 8.2, uranusTexture, 220, {
  innerRadius: 10,
  outerRadius: 20,
  texture: uranusRingTexture,
});
const neptune = new createPlanet("Netuno", 5, neptuneTexture, 260);

earth.planet.add(moon.planetObj);

scene.add(
  mercury.planetObj,
  venus.planetObj,
  earth.planetObj,
  mars.planetObj,
  jupiter.planetObj,
  saturn.planetObj,
  uranus.planetObj,
  neptune.planetObj
);

function animate() {
  // sun.rotateY(0.002);
  // mercury.planet.rotateY(0.001);
  // mercury.planetObj.rotateY(0.001);
  // venus.planet.rotateY(0.0012);
  // venus.planetObj.rotateY(0.0015);
  // earth.planet.rotateY(0.012);
  // earth.planetObj.rotateY(0.0012);
  // moon.planetObj.rotateY(0.01);
  // moon.planetObj.rotateX(0.001);
  // mars.planet.rotateY(0.013);
  // mars.planetObj.rotateY(0.0019);
  // jupiter.planet.rotateY(0.04);
  // jupiter.planetObj.rotateY(0.0023);
  // saturn.planet.rotateY(0.01);
  // saturn.planetObj.rotateY(0.0021);
  // uranus.planet.rotateY(0.01);
  // uranus.planetObj.rotateY(0.0015);
  // neptune.planet.rotateY(0.01);
  // neptune.planetObj.rotateY(0.001);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  orbit.update();
}

animate();

function onMouseMove(event) {
  // Normalizar as coordenadas do mouse
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Configurar o raio a partir da câmera
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  // Verificar a interseção com os objetos da cena
  var intersects = raycaster.intersectObjects(scene.children, true);

  // Verificar se houve alguma interseção
  if (intersects.length > 0) {
    // Exibir o nome do objeto no console
    var selectedObject = intersects[0].object;

    console.log(selectedObject);
    selectedObject.add(aura);
  } else {
    var selectedObject = intersects[0].object;
    selectedObject.remove(aura);
    // Nenhum objeto selecionado, esconder a aura
    // aura.visible = false;
  }
}

// Adicionar o evento de passagem do mouse à janela
window.addEventListener("mousemove", onMouseMove, false);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
