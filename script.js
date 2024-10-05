// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;

// Create sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Add point light to represent sun
const sunLight = new THREE.PointLight(0xffffff, 1, 100);
sun.add(sunLight);

// Planet data
const planets = [
  { name: "Mercury", distance: 3, size: 0.1, color: 0x8c7853, period: 0.24 },
  { name: "Venus", distance: 4, size: 0.2, color: 0xffd700, period: 0.62 },
  { name: "Earth", distance: 5, size: 0.2, color: 0x0000ff, period: 1 },
  { name: "Mars", distance: 6, size: 0.15, color: 0xff0000, period: 1.88 },
  { name: "Jupiter", distance: 10, size: 0.5, color: 0xffa500, period: 11.86 },
  { name: "Saturn", distance: 13, size: 0.4, color: 0xffd700, period: 29.46 },
  { name: "Uranus", distance: 16, size: 0.3, color: 0x00ffff, period: 84.01 },
  { name: "Neptune", distance: 19, size: 0.3, color: 0x0000ff, period: 164.79 },
];

// Create planets
planets.forEach((planet) => {
  const planetGeometry = new THREE.SphereGeometry(planet.size, 16, 16);
  const planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

  const orbit = new THREE.Object3D();
  orbit.add(planetMesh);
  scene.add(orbit);

  // Add name tag
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ color: 0xffffff })
  );
  sprite.scale.set(0.5, 0.25, 1);
  sprite.position.set(0, planet.size + 0.5, 0);
  planetMesh.add(sprite);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "48px Arial";
  context.fillStyle = "white";
  context.fillText(planet.name, 0, 48);
  const texture = new THREE.CanvasTexture(canvas);
  sprite.material.map = texture;
  sprite.material.needsUpdate = true;

  planet.mesh = planetMesh;
  planet.orbit = orbit;
});

// Near Earth Objects (simplified)
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

// Function to create an orbit line
function createOrbit(radius, color = 0xffffff) {
  const segments = 128;
  const material = new THREE.LineBasicMaterial({
    color: color,
    opacity: 0.5,
    transparent: true,
  });
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  return new THREE.Line(geometry, material);
}

// Create orbits for planets
planets.forEach((planet) => {
  const orbit = createOrbit(planet.distance, planet.color);
  scene.add(orbit);
});

// Create orbit for NEO
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

// Create NEOs
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

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pauseButton").innerText = isPaused ? "⏵" : "⏸";
}

camera.position.z = 30;

// Time slider
const timeSlider = document.getElementById("timeSlider");
let simulationSpeed = 1;
timeSlider.addEventListener("input", (event) => {
  simulationSpeed = event.target.value / 50;
});

// Animation loop
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

// Window resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// let scene, camera, renderer, controls;
// const celestialBodies = [];
// let isPaused = false; // Variable to track the pause state

// function init() {
//   scene = new THREE.Scene();
//   camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   renderer = new THREE.WebGLRenderer();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);

//   // Add OrbitControls
//   controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true; // Smooth camera movement
//   controls.dampingFactor = 0.05;
//   controls.screenSpacePanning = false;
//   controls.minDistance = 5;
//   controls.maxDistance = 50;

//   const ambientLight = new THREE.AmbientLight(0x404040);
//   scene.add(ambientLight);
//   const pointLight = new THREE.PointLight(0xffffff, 1, 100);
//   pointLight.position.set(0, 0, 0);
//   scene.add(pointLight);

//   const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
//   const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//   const sun = new THREE.Mesh(sunGeometry, sunMaterial);
//   scene.add(sun);

//   astronomicalObjects.forEach((obj) => {
//     const bodyGeometry = new THREE.SphereGeometry(0.1, 32, 32);
//     const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
//     const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

//     const a = parseFloat(obj.q_au_1) / (1 - parseFloat(obj.e));
//     const angle = Math.random() * Math.PI * 2;
//     body.position.set(a * Math.cos(angle), 0, a * Math.sin(angle));

//     scene.add(body);
//     celestialBodies.push(body);
//   });

//   camera.position.z = 20;

//   window.addEventListener("resize", onWindowResize, false);

//   const pauseButton = document.getElementById("pauseButton");
//   pauseButton.addEventListener("click", togglePause);

//   animate();
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function togglePause() {
//   isPaused = !isPaused;
//   document.getElementById("pauseButton").innerText = isPaused ? "⏵" : "⏸";
// }

// function animate() {
//   requestAnimationFrame(animate);

//   if (!isPaused) {
//     celestialBodies.forEach((body) => {
//       const speed = 0.01;
//       const x = body.position.x;
//       const z = body.position.z;
//       body.position.x = x * Math.cos(speed) + z * Math.sin(speed);
//       body.position.z = z * Math.cos(speed) - x * Math.sin(speed);
//     });
//   }

//   controls.update(); // Update camera controls

//   renderer.render(scene, camera);
// }

// const planets = [
//   {
//     name: "Sun",
//     size: 1,
//     color: 0xf0a0a0,
//     distance: 0,
//     semiMajorAxis: 0,
//     semiMinorAxis: 0,
//   },
//   {
//     name: "Mercury",
//     size: 0.038,
//     color: 0xaaaaaa,
//     distance: 1.5,
//     semiMajorAxis: 1.5,
//     semiMinorAxis: 1.4,
//   },
//   {
//     name: "Venus",
//     size: 0.095,
//     color: 0xffcc99,
//     distance: 2,
//     semiMajorAxis: 2,
//     semiMinorAxis: 1.9,
//   },
//   {
//     name: "Earth",
//     size: 0.096,
//     color: 0x0000ff,
//     distance: 2.5,
//     semiMajorAxis: 2.5,
//     semiMinorAxis: 2.4,
//   },
//   {
//     name: "Mars",
//     size: 0.051,
//     color: 0xff0000,
//     distance: 3,
//     semiMajorAxis: 3,
//     semiMinorAxis: 2.9,
//   },
//   {
//     name: "Jupiter",
//     size: 0.223,
//     color: 0xffa500,
//     distance: 4.5,
//     semiMajorAxis: 4.5,
//     semiMinorAxis: 4.3,
//   },
//   {
//     name: "Saturn",
//     size: 0.186,
//     color: 0xffff00,
//     distance: 6,
//     semiMajorAxis: 6,
//     semiMinorAxis: 5.8,
//   },
//   {
//     name: "Uranus",
//     size: 0.079,
//     color: 0x00ffff,
//     distance: 10,
//     semiMajorAxis: 10,
//     semiMinorAxis: 9.5,
//   },
//   {
//     name: "Neptune",
//     size: 0.076,
//     color: 0x0000ff,
//     distance: 12,
//     semiMajorAxis: 12,
//     semiMinorAxis: 11.5,
//   },
// ];

// const astronomicalObjects = [
//   {
//     object: "45P/Honda-Mrkos-Pajdusakova",
//     epoch_tdb: "56060",
//     tp_tdb: "2455833.282",
//     e: "0.8246720759",
//     i_deg: "4.252433261",
//     w_deg: "326.2580404",
//     node_deg: "89.0021809",
//     q_au_1: "0.5297614214",
//     q_au_2: "5.51",
//     p_yr: "5.25",
//     moid_au: "0.060071",
//     a1_au_d_2: "0.00000000388",
//     a2_au_d_2: "0.000000000433",
//   },
//   [
//     {
//       object: "P/2004 R1 (McNaught)",
//       epoch_tdb: "54629",
//       tp_tdb: "2455248.548",
//       e: "0.682526943",
//       i_deg: "4.894555854",
//       w_deg: "0.626837835",
//       node_deg: "295.9854497",
//       q_au: "0.986192006",
//       p_yr: "5.48",
//       moid_au: "0.027011",
//     },
//     {
//       object: "P/2008 S1 (Catalina-McNaught)",
//       epoch_tdb: "55101",
//       tp_tdb: "2454741.329",
//       e: "0.6663127807",
//       i_deg: "15.1007464",
//       w_deg: "203.6490232",
//       node_deg: "111.3920029",
//       q_au: "1.190641555",
//       p_yr: "6.74",
//       moid_au: "0.194101",
//     },
//     {
//       object: "1P/Halley",
//       epoch_tdb: "49400",
//       tp_tdb: "2446467.395",
//       e: "0.9671429085",
//       i_deg: "162.2626906",
//       w_deg: "111.3324851",
//       node_deg: "58.42008098",
//       q_au: "0.5859781115",
//       p_yr: "75.32",
//       moid_au: "0.063782",
//     },
//     {
//       object: "2P/Encke",
//       epoch_tdb: "56870",
//       tp_tdb: "2456618.204",
//       e: "0.8482682514",
//       i_deg: "11.77999525",
//       w_deg: "186.5403463",
//       node_deg: "334.5698056",
//       q_au: "0.3360923855",
//       p_yr: "3.3",
//       moid_au: "0.173092",
//     },
//     {
//       object: "3D/Biela",
//       epoch_tdb: "-9480",
//       tp_tdb: "2390514.115",
//       e: "0.751299",
//       i_deg: "13.2164",
//       w_deg: "221.6588",
//       node_deg: "250.669",
//       q_au: "0.879073",
//       p_yr: "6.65",
//       moid_au: "0.000518",
//     },
//     {
//       object: "7P/Pons-Winnecke",
//       epoch_tdb: "56981",
//       tp_tdb: "2457053.028",
//       e: "0.6375275046",
//       i_deg: "22.33501476",
//       w_deg: "172.5061606",
//       node_deg: "93.41632728",
//       q_au: "1.239214834",
//       p_yr: "6.32",
//       moid_au: "0.224191",
//     },
//     {
//       object: "8P/Tuttle",
//       epoch_tdb: "54374",
//       tp_tdb: "2454492.526",
//       e: "0.819799747",
//       i_deg: "54.98318484",
//       w_deg: "207.509246",
//       node_deg: "270.341652",
//       q_au: "1.027116587",
//       p_yr: "13.61",
//       moid_au: "0.09531",
//     },
//     {
//       object: "12P/Pons-Brooks",
//       epoch_tdb: "35000",
//       tp_tdb: "2434885.381",
//       e: "0.9548123942",
//       i_deg: "74.17689423",
//       w_deg: "199.0284686",
//       node_deg: "255.8911444",
//       q_au: "0.7736670873",
//       p_yr: "70.85",
//       moid_au: "0.1873",
//     },
//     {
//       object: "21P/Giacobini-Zinner",
//       epoch_tdb: "56498",
//       tp_tdb: "2455969.126",
//       e: "0.7068178874",
//       i_deg: "31.90810099",
//       w_deg: "172.5844249",
//       node_deg: "195.3970145",
//       q_au: "1.030696274",
//       p_yr: "6.59",
//       moid_au: "0.035395",
//     },
//     {
//       object: "23P/Brorsen-Metcalf",
//       epoch_tdb: "47800",
//       tp_tdb: "2447781.437",
//       e: "0.9719522579",
//       i_deg: "19.33394047",
//       w_deg: "129.6106837",
//       node_deg: "311.5854622",
//       q_au: "0.4787527107",
//       p_yr: "70.52",
//       moid_au: "0.193872",
//     },
//   ],

//   // Add more objects here
// ];

// init();
