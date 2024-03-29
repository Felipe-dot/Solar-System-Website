import * as THREE from "three";
import createPlanet from "./pages/lib/planet";

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

import showPlanetInfo from "./pages/lib/planet_info";

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

const ambientLight = new THREE.AmbientLight(0x404040, Math.PI);

const directionalLight = new THREE.DirectionalLight(0xffffff, Math.PI);
directionalLight.position.set(5, 20, 10);
directionalLight.castShadow = true;

const textureload = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(12, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureload.load(sunTexture),
});

const sun = new THREE.Mesh(sunGeo, sunMat);
sun.name = "Sol";

const pointLight = new THREE.PointLight(0xffffff, 10, 1000);

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

const backupScene = [
  ambientLight,
  directionalLight,
  pointLight,
  sun,
  mercury.planetObj,
  venus.planetObj,
  earth.planetObj,
  mars.planetObj,
  jupiter.planetObj,
  saturn.planetObj,
  uranus.planetObj,
  neptune.planetObj,
];

backupScene.forEach((obj) => scene.add(obj));

var isFocusPlanet = true;
var isClickHappen = false;

function animate() {
  sun.rotateY(0.002);
  earth.planet.rotateY(0.012);
  mercury.planet.rotateY(0.001);
  venus.planet.rotateY(0.0012);
  mars.planet.rotateY(0.013);
  jupiter.planet.rotateY(0.04);
  saturn.planet.rotateY(0.01);
  uranus.planet.rotateY(0.01);
  neptune.planet.rotateY(0.01);
  moon.planet.rotateY(0.003);

  if (isFocusPlanet) {
    mercury.planetObj.rotateY(0.001);
    venus.planetObj.rotateY(0.0015);
    earth.planetObj.rotateY(0.0012);
    moon.planetObj.rotateY(0.01);
    mars.planetObj.rotateY(0.0019);
    jupiter.planetObj.rotateY(0.0023);
    saturn.planetObj.rotateY(0.0021);
    uranus.planetObj.rotateY(0.0015);
    neptune.planetObj.rotateY(0.001);
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
orbit.update();

animate();

function handlePlanetClick(planeta) {
  // Remover todos os planetas da cena, exceto o planeta clicado
  console.log(planeta);
  planeta.parent.rotation.x = 0;
  planeta.parent.rotation.y = 0;
  planeta.parent.rotation.z = 0;
  isFocusPlanet = false;

  var novosChildren = [];
  if (planeta.name == "Lua") {
    novosChildren.push(planeta);
  } else {
    novosChildren = scene.children.filter((obj) => obj.name === planeta.name);
  }

  scene.children = novosChildren;

  scene.add(ambientLight);
  scene.add(directionalLight);
  scene.add(pointLight);

  // Ajustar a posição da câmera para exibir apenas o planeta clicado

  var newPosition = new THREE.Vector3(
    planeta.position.x + 40,
    planeta.parent.children.length == 2
      ? planeta.position.y + 40
      : planeta.position.y + 0,
    planeta.position.z
  );

  camera.position.copy(newPosition);
  const planetPosition = planeta.getWorldPosition(new THREE.Vector3());

  camera.lookAt(planetPosition);

  orbit.enabled = false;

  // Exibir informações detalhadas no lado direito
  showPlanetInfo(planeta);
}

var resetClick = document.getElementById("reset");

resetClick.addEventListener("click", () => {
  event.stopPropagation();

  var infoContainer = document.getElementById("info_container");
  isClickHappen = false;
  isFocusPlanet = true;
  infoContainer.style.display = "none";

  scene.children = [];

  backupScene.forEach((obj) => scene.add(obj));

  camera.position.copy(new THREE.Vector3(-90, 140, 140));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  orbit.enabled = true;
});

function onMouseClick(event) {
  if (!isClickHappen) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    // Atualizar as coordenadas do mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Configurar o raio a partir da câmera
    raycaster.setFromCamera(mouse, camera);

    // Verificar a interseção com os objetos da cena
    var intersects = raycaster.intersectObjects(scene.children, true);

    // Verificar se houve alguma interseção
    if (intersects.length > 0) {
      var selectedObject = intersects[0].object;
      if (selectedObject.geometry.type === "RingGeometry") {
        return;
      } else {
        isClickHappen = true;
        handlePlanetClick(selectedObject);
      }
    }
  }
}
window.addEventListener("click", onMouseClick, false);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Adicionar o evento de passagem do mouse à janela
window.addEventListener("mousemove", onMouseMove, false);

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
    document.body.style.cursor = "pointer";
    // Exibir o nome do objeto no console
  } else {
    document.body.style.cursor = "auto";
  }
}
