// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const planets = [
//   { name: "Sun", size: 1, color: 0xf0a0a0, distance: 0, semiMajorAxis: 0 },
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

// const orbits = []; // To store orbit mesh objects
// const planetsMeshes = []; // To store planet mesh objects
// const clock = new THREE.Clock(); // For time-based animation

// // OrbitControls to interact with the scene (zoom, rotate)
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enableZoom = true;
// controls.enablePan = true;

// function createPlanet(size, distance, color) {
//   const geometry = new THREE.SphereGeometry(size, 32, 32);
//   const material = new THREE.MeshBasicMaterial({ color });
//   const planet = new THREE.Mesh(geometry, material);
//   planet.position.x = distance; // Initial position along the x-axis
//   scene.add(planet);
//   return planet;
// }

// function createEllipseOrbit(semiMajorAxis, semiMinorAxis) {
//   const points = [];
//   const segments = 64; // Number of segments to create a smooth ellipse
//   for (let i = 0; i < segments; i++) {
//     const angle = (i / segments) * Math.PI * 2; // Full circle
//     const x = semiMajorAxis * Math.cos(angle);
//     const y = semiMinorAxis * Math.sin(angle);
//     points.push(new THREE.Vector3(x, 0, y)); // Assume orbits lie on the XY plane
//   }

//   const geometry = new THREE.BufferGeometry().setFromPoints(points);
//   const material = new THREE.LineBasicMaterial({ color: 0xffffff });
//   const orbit = new THREE.LineLoop(geometry, material);
//   orbit.visible = true; // Default visibility
//   scene.add(orbit);
//   orbits.push(orbit);
//   return orbit;
// }

// // Create planets and orbits
// planets.forEach((planet) => {
//   const planetMesh = createPlanet(planet.size, planet.distance, planet.color);
//   planetsMeshes.push(planetMesh); // Store planet mesh for animation
//   if (planet.distance > 0) {
//     // No orbit for the Sun
//     createEllipseOrbit(planet.semiMajorAxis, planet.semiMinorAxis);
//   }
// });

// // Orbit toggle functionality
// const toggleOrbitsCheckbox = document.getElementById("toggleOrbits");
// toggleOrbitsCheckbox.addEventListener("change", (event) => {
//   const isChecked = event.target.checked;
//   orbits.forEach((orbit) => {
//     orbit.visible = isChecked;
//   });
// });

// // Animation loop
// function animate() {
//   requestAnimationFrame(animate);

//   const delta = clock.getDelta(); // Time elapsed since the last frame
//   planets.forEach((planet, index) => {
//     if (index === 0) return; // Skip the Sun

//     const angleSpeed = 0.5; // Speed of rotation (you can adjust this)
//     const angle = angleSpeed * delta; // Calculate angle based on time
//     const planetMesh = planetsMeshes[index];

//     // Update planet position using elliptical orbit formula
//     const semiMajorAxis = planet.semiMajorAxis;
//     const semiMinorAxis = planet.semiMinorAxis;

//     // Calculate new position
//     const currentAngle = planetMesh.rotation.y + angle; // Rotate around Y
//     const x = semiMajorAxis * Math.cos(currentAngle);
//     const z = semiMinorAxis * Math.sin(currentAngle);

//     planetMesh.position.set(x, 0, z); // Set new position
//     planetMesh.rotation.y += angle * 0.5; // Rotate the planet on its axis
//   });

//   renderer.render(scene, camera);
// }

// camera.position.z = 10; // Set camera position
// animate();




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
[

]

// init();
[
  {
    e: "0.8246720759",
    i_deg: 0.07421896162576938,
    node_deg: 1.55338109816061,
    q_au_2: "5.51",
    object_name: "45P/Honda-Mrkos-Pajdusakova",
    aw: 4.140895917924068,
  },
  {
    e: "0.6592025614",
    i_deg: 0.20520079157515428,
    node_deg: 1.4340391468317388,
    q_au_2: "5.12",
    object_name: "46P/Wirtanen",
    aw: 4.785270692885809,
  },
  {
    e: "0.905552721",
    i_deg: 2.8359257310200223,
    node_deg: 4.106253394218691,
    q_au_2: "19.7",
    object_name: "55P/Tempel-Tuttle",
    aw: -1.09555565756231,
  },
  {
    e: "0.7877014869",
    i_deg: 0.3263894213312879,
    node_deg: 0.3877312632587113,
    q_au_2: "10.73",
    object_name: "66P/du Toit",
    aw: 4.102123338357491,
  },
  {
    e: "0.6409739314",
    i_deg: 0.12287468574177464,
    node_deg: 0.8751449048450606,
    q_au_2: "5.68",
    object_name: "67P/Churyumov-Gerasimenko",
    aw: -0.651993982060588,
  },
  {
    e: "0.8191545266",
    i_deg: 0.1600341935815077,
    node_deg: 0.6302243684764809,
    q_au_2: "7.89",
    object_name: "72P/Denning-Fujikawa",
    aw: 5.266510877491454,
  },
  {
    e: "0.6948269106",
    i_deg: 0.199377470680745,
    node_deg: 1.220793959073882,
    q_au_2: "5.18",
    object_name: "73P/Schwassmann-Wachmann 3",
    aw: 2.248396623360116,
  },
  {
    e: "0.6932855208",
    i_deg: 0.19891433621908816,
    node_deg: 1.2198538425337502,
    q_au_2: "5.18",
    object_name: "73P/Schwassmann-Wachmann 3-B",
    aw: 2.249851156498652,
  },
  {
    e: "0.6922258013",
    i_deg: 0.19860375679855796,
    node_deg: 1.2189940950895473,
    q_au_2: "5.18",
    object_name: "73P/Schwassmann-Wachmann 3-C",
    aw: 2.2519525102287723,
  },
  {
    e: "0.6938774628",
    i_deg: 0.19906564282620084,
    node_deg: 1.220283676636878,
    q_au_2: "5.19",
    object_name: "73P/Schwassmann-Wachmann 3-E",
    aw: 2.248963903014503,
  },
  {
    e: "0.6934129712",
    i_deg: 0.19878536232148525,
    node_deg: 1.2201317479944198,
    q_au_2: "5.19",
    object_name: "73P/Schwassmann-Wachmann 3-G",
    aw: 2.2491395105389227,
  },
  {
    e: "0.6935658067",
    i_deg: 0.1988115703600661,
    node_deg: 1.2201228782311613,
    q_au_2: "5.19",
    object_name: "73P/Schwassmann-Wachmann 3-H",
    aw: 2.2491344770093598,
  },
  {
    e: "0.6915388167",
    i_deg: 0.19862310202798705,
    node_deg: 1.2187435230557604,
    q_au_2: "5.15",
    object_name: "73P/Schwassmann-Wachmann 3-J",
    aw: 2.252183058100051,
  },
  {
    e: "0.6935434852",
    i_deg: 0.19881158292643672,
    node_deg: 1.2199387807271278,
    q_au_2: "5.19",
    object_name: "73P/Schwassmann-Wachmann 3-K",
    aw: 2.2495950241949334,
  },
  {
    e: "0.694735675",
    i_deg: 0.1989450688492219,
    node_deg: 1.2206271260177437,
    q_au_2: "5.21",
    object_name: "73P/Schwassmann-Wachmann 3-L",
    aw: 2.2481727766805,
  },
  {
    e: "0.6939409383",
    i_deg: 0.19886912329028233,
    node_deg: 1.2200776771705941,
    q_au_2: "5.2",
    object_name: "73P/Schwassmann-Wachmann 3-M",
    aw: 2.2492451558421447,
  },
  {
    e: "0.6922889938",
    i_deg: 0.19863489609040738,
    node_deg: 1.2199380722979845,
    q_au_2: "5.17",
    object_name: "73P/Schwassmann-Wachmann 3-N",
    aw: 2.2491542899870285,
  },
  {
    e: "0.6955758994",
    i_deg: 0.1990621652576662,
    node_deg: 1.220966020438328,
    q_au_2: "5.23",
    object_name: "73P/Schwassmann-Wachmann 3-P",
    aw: 2.2474244576879956,
  },
  {
    e: "0.6986472444",
    i_deg: 0.1993053973092839,
    node_deg: 1.2241370674429073,
    q_au_2: "5.3",
    object_name: "73P/Schwassmann-Wachmann 3-Q",
    aw: 2.2402575858260594,
  },
  {
    e: "0.6940882133",
    i_deg: 0.19887549129859114,
    node_deg: 1.2202135381374255,
    q_au_2: "5.2",
    object_name: "73P/Schwassmann-Wachmann 3-R",
    aw: 2.2489722167158614,
  },
  {
    e: "0.6933582332",
    i_deg: 0.19282714074039908,
    node_deg: 1.431023641999301,
    q_au_2: "5.65",
    object_name: "73P/Schwassmann-Wachmann 3-S",
    aw: 1.7378343985574904,
  },
  {
    e: "0.7119324141",
    i_deg: 0.20092753214696035,
    node_deg: 1.2300383207790766,
    q_au_2: "5.58",
    object_name: "73P/Schwassmann-Wachmann 3-T",
    aw: 2.228914184697332,
  },
  {
    e: "0.6893974588",
    i_deg: 0.1982662727785424,
    node_deg: 1.2188108882270312,
    q_au_2: "5.11",
    object_name: "73P/Schwassmann-Wachmann 3-U",
    aw: 2.2515212756734533,
  },
  {
    e: "0.6934869706",
    i_deg: 0.20336268847410555,
    node_deg: 1.138771258275703,
    q_au_2: "5.04",
    object_name: "73P/Schwassmann-Wachmann 3-V",
    aw: 2.4379228881615322,
  },
  {
    e: "0.6975732498",
    i_deg: 0.19928724396520098,
    node_deg: 1.2220269217912125,
    q_au_2: "5.27",
    object_name: "73P/Schwassmann-Wachmann 3-W",
    aw: 2.245258227102518,
  },
  {
    e: "0.6947512888",
    i_deg: 0.19895684231675706,
    node_deg: 1.2204846706733996,
    q_au_2: "5.21",
    object_name: "73P/Schwassmann-Wachmann 3-X",
    aw: 2.2483743131653533,
  },
  {
    e: "0.7195023037",
    i_deg: 0.20179219757992975,
    node_deg: 1.2334091612081852,
    q_au_2: "5.76",
    object_name: "73P/Schwassmann-Wachmann 3-Y",
    aw: 2.2218201136600895,
  },
  {
    e: "0.6933582332",
    i_deg: 0.1980856549374388,
    node_deg: 1.230352591570975,
    q_au_2: "5.2",
    object_name: "73P/Schwassmann-Wachmann 3-Z",
    aw: 2.2256811334748123,
  },
  {
    e: "0.6806338789",
    i_deg: 0.19713607242957576,
    node_deg: 1.2142729719579868,
    q_au_2: "4.94",
    object_name: "73P/Schwassmann-Wachmann 3-AA",
    aw: 2.260816139178685,
  },
  {
    e: "0.6912468087",
    i_deg: 0.19849967932460302,
    node_deg: 1.219268567487578,
    q_au_2: "5.14",
    object_name: "73P/Schwassmann-Wachmann 3-AB",
    aw: 2.250742094547384,
  },
  {
    e: "0.6953671146",
    i_deg: 0.19905969142798444,
    node_deg: 1.2205750883279638,
    q_au_2: "5.23",
    object_name: "73P/Schwassmann-Wachmann 3-AC",
    aw: 2.2483128470324214,
  },
  {
    e: "0.6933582332",
    i_deg: 0.19841541447925087,
    node_deg: 1.225556539709297,
    q_au_2: "5.19",
    object_name: "73P/Schwassmann-Wachmann 3-AD",
    aw: 2.2366761951591756,
  },
  {
    e: "0.6967256567",
    i_deg: 0.1992239356372434,
    node_deg: 1.2212474094016514,
    q_au_2: "5.25",
    object_name: "73P/Schwassmann-Wachmann 3-AE",
    aw: 2.2468639242547663,
  },
  {
    e: "0.6762990182",
    i_deg: 0.19617034370626962,
    node_deg: 1.219107482149732,
    q_au_2: "4.87",
    object_name: "73P/Schwassmann-Wachmann 3-AF",
    aw: 2.24914780626339,
  },
  {
    e: "0.6957811465",
    i_deg: 0.19909999893439462,
    node_deg: 1.2210143004342282,
    q_au_2: "5.23",
    object_name: "73P/Schwassmann-Wachmann 3-AG",
    aw: 2.2470473262450925,
  },
  {
    e: "0.6933582332",
    i_deg: 0.19775684241127886,
    node_deg: 1.2340772952369974,
    q_au_2: "5.21",
    object_name: "73P/Schwassmann-Wachmann 3-AH",
    aw: 2.217130229653212,
  },
  {
    e: "0.6982511274",
    i_deg: 0.19950254394200262,
    node_deg: 1.221225923351362,
    q_au_2: "5.28",
    object_name: "73P/Schwassmann-Wachmann 3-AI",
    aw: 2.247257064206634,
  },
  {
    e: "0.8001952857",
    i_deg: 0.2120455929432979,
    node_deg: 1.2577239634822677,
    q_au_2: "8.43",
    object_name: "73P/Schwassmann-Wachmann 3-AJ",
    aw: 2.1764845554030123,
  },
  {
    e: "0.6933582332",
    i_deg: 0.19948235920920332,
    node_deg: 1.210842955791523,
    q_au_2: "5.18",
    object_name: "73P/Schwassmann-Wachmann 3-AK",
    aw: 2.2680467598896827,
  },
];
