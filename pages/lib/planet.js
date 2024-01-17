import * as THREE from "three";

export default function createPlanet(name, size, texture, position, ring) {
  const geometry = new THREE.SphereGeometry(size, 25, 20);
  const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(texture),
  });
  const planet = new THREE.Mesh(geometry, material);
  planet.name = name;
  const planetObj = new THREE.Object3D();
  planetObj.name = name;
  planetObj.add(planet);
  planetObj.receiveShadow = true;

  planet.position.x = position;

  if (ring) {
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(ring.texture),
      side: THREE.DoubleSide,
    });
    const Ring = new THREE.Mesh(RingGeo, RingMat);
    planetObj.add(Ring);

    Ring.position.x = position;
    Ring.rotation.x = -0.5 * Math.PI;
  }
  return { planet, planetObj };
}
