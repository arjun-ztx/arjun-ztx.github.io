//neos
const neos = [
  {
    name: "45P/Honda-Mrkos-Pajdusakova",
    epoch: 56060,
    e: 0.8246720759,
    a: 3.0198,
    i: 4.252433261,
    omega: 326.2580404,
    node: 89.0021809,
    M: 0,
  },
  {
    name: "P/2004 R1 (McNaught)",
    epoch: 54629,
    e: 0.682526943,
    a: 3.08968,
    i: 4.894555854,
    omega: 0.626837835,
    node: 295.9854497,
    M: 0,
  },
  {
    name: "P/2008 S1 (Catalina-McNaught)",
    epoch: 55101,
    e: 0.6663127807,
    a: 3.560539,
    i: 15.1007464,
    omega: 203.6490232,
    node: 111.3920029,
    M: 0,
  },
  {
    name: "1P/Halley",
    epoch: 49400,
    e: 0.9671429085,
    a: 0.177419,
    i: 162.2626906,
    omega: 111.3324851,
    node: 58.42008098,
    M: 0,
  },
  {
    name: "2P/Encke",
    epoch: 56870,
    e: 0.8482682514,
    a: 0.367213,
    i: 11.77999525,
    omega: 186.5403463,
    node: 334.5698056,
    M: 0,
  },
  {
    name: "3D/Biela",
    epoch: -9480,
    e: 0.751299,
    a: 1.253401,
    i: 13.2164,
    omega: 221.6588,
    node: 250.669,
    M: 0,
  },
  {
    name: "7P/Pons-Winnecke",
    epoch: 56981,
    e: 0.6375275046,
    a: 3.331407,
    i: 22.33501476,
    omega: 172.5061606,
    node: 93.41632728,
    M: 0,
  },
  {
    name: "8P/Tuttle",
    epoch: 54374,
    e: 0.819799747,
    a: 5.122649,
    i: 54.98318484,
    omega: 207.509246,
    node: 270.341652,
    M: 0,
  },
  {
    name: "12P/Pons-Brooks",
    epoch: 35000,
    e: 0.9548123942,
    a: 1.612372,
    i: 74.17689423,
    omega: 199.0284686,
    node: 255.8911444,
    M: 0,
  },
  {
    name: "21P/Giacobini-Zinner",
    epoch: 56498,
    e: 0.7068178874,
    a: 3.501973,
    i: 31.90810099,
    omega: 172.5844249,
    node: 195.3970145,
    M: 0,
  },
  {
    name: "23P/Brorsen-Metcalf",
    epoch: 47800,
    e: 0.9719522579,
    a: 0.165193,
    i: 19.33394047,
    omega: 129.6106837,
    node: 311.5854622,
    M: 0,
  },
];

//neo orb
neos.forEach((neo) => {
  const orbitPoints = [];
  const segments = 256;
  const a = neo.a;
  const e = neo.e;
  const i = (neo.i * Math.PI) / 180;
  const omega = (neo.omega * Math.PI) / 180;
  const node = (neo.node * Math.PI) / 180;

  for (let j = 0; j <= segments; j++) {
    const theta = (j / segments) * Math.PI * 2;
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    const xh =
      x *
        (Math.cos(omega) * Math.cos(node) -
          Math.sin(omega) * Math.sin(node) * Math.cos(i)) -
      y *
        (Math.sin(omega) * Math.cos(node) +
          Math.cos(omega) * Math.sin(node) * Math.cos(i));
    const yh =
      x *
        (Math.cos(omega) * Math.sin(node) +
          Math.sin(omega) * Math.cos(node) * Math.cos(i)) +
      y *
        (Math.cos(omega) * Math.cos(node) * Math.cos(i) -
          Math.sin(omega) * Math.sin(node));
    const zh =
      x * Math.sin(omega) * Math.sin(i) + y * Math.cos(omega) * Math.sin(i);

    orbitPoints.push(new THREE.Vector3(xh, zh, yh));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbitLine);
});

//neo farm
neos.forEach((neo) => {
  const neoGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const neoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const neoMesh = new THREE.Mesh(neoGeometry, neoMaterial);

  const orbit = new THREE.Object3D();
  orbit.add(neoMesh);
  scene.add(orbit);

  // Add name tag
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ color: 0xffffff })
  );
  sprite.scale.set(0.5, 0.25, 1);
  sprite.position.set(0, 0.1, 0);
  neoMesh.add(sprite);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "24px Arial";
  context.fillStyle = "white";
  context.fillText(neo.name, 0, 24);
  context.fillText(`Epoch: ${neo.epoch}`, 0, 48);
  const texture = new THREE.CanvasTexture(canvas);
  sprite.material.map = texture;
  sprite.material.needsUpdate = true;

  neo.mesh = neoMesh;
  neo.orbit = orbit;
});

function animate(time) {
  requestAnimationFrame(animate);

  const t = time * 0.001 * simulationSpeed;

  planets.forEach((planet) => {
    const angle = t / planet.period;
    planet.mesh.position.x = Math.cos(angle) * planet.distance;
    planet.mesh.position.z = Math.sin(angle) * planet.distance;
    planet.mesh.rotation.y += 0.01;
  });

  neos.forEach((neo) => {
    const a = neo.a;
    const e = neo.e;
    const i = (neo.i * Math.PI) / 180;
    const omega = (neo.omega * Math.PI) / 180;
    const node = (neo.node * Math.PI) / 180;

    const M = (t / a ** 1.5) % (2 * Math.PI);
    let E = M;
    for (let j = 0; j < 5; j++) {
      E = M + e * Math.sin(E);
    }

    const x = a * (Math.cos(E) - e);
    const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

    const xh =
      x *
        (Math.cos(omega) * Math.cos(node) -
          Math.sin(omega) * Math.sin(node) * Math.cos(i)) -
      y *
        (Math.sin(omega) * Math.cos(node) +
          Math.cos(omega) * Math.sin(node) * Math.cos(i));
    const yh =
      x *
        (Math.cos(omega) * Math.sin(node) +
          Math.sin(omega) * Math.cos(node) * Math.cos(i)) +
      y *
        (Math.cos(omega) * Math.cos(node) * Math.cos(i) -
          Math.sin(omega) * Math.sin(node));
    const zh =
      x * Math.sin(omega) * Math.sin(i) + y * Math.cos(omega) * Math.sin(i);

    neo.mesh.position.set(xh, zh, yh);
  });

  // Make name tags face the camera
  scene.traverse(function (object) {
    if (object instanceof THREE.Sprite) {
      object.quaternion.copy(camera.quaternion);
    }
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
