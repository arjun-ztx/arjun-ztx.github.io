// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls for interactivity
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 20);
controls.update();

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create a planet with orbit and rotation axis
function createPlanet(radius, color, orbitRadius, orbitSpeed) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const planet = new THREE.Mesh(geometry, material);

  return { planet, orbitRadius, orbitSpeed, angle: 0 };
}

// Add Earth and Mars with their orbits
const earthData = createPlanet(0.3, 0x0000ff, 5, 0.01); // Earth
const marsData = createPlanet(0.2, 0xff0000, 7, 0.008); // Mars
scene.add(earthData.planet);
scene.add(marsData.planet);

// Define NEOs
const neos = [
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

// Convert degrees to radians
function degToRad(deg) {
  return deg * (Math.PI / 180);
}

// Calculate NEO positions using the given equation
function calculateNEOPosition(neo, anomaly) {
  const e = parseFloat(neo.e);
  const i = degToRad(neo.i_deg);
  const om = degToRad(neo.node_deg);
  const wa = neo.aw;
  const u = anomaly; // True anomaly
  const r = parseFloat(neo.q_au_2);

  const x =
    r *
    (Math.cos(om) * Math.cos(wa + u) -
      Math.sin(om) * Math.sin(wa + u) * Math.cos(i));
  const y =
    r *
    (Math.sin(om) * Math.cos(wa + u) +
      Math.cos(om) * Math.sin(wa + u) * Math.cos(i));
  const z = r * Math.sin(wa + u) * Math.sin(i);

  return { x, y, z };
}

// Add NEOs to the scene
const neoMeshes = [];
const labels = [];

neos.forEach((neo) => {
  const pos = calculateNEOPosition(neo, Math.random() * 2 * Math.PI);

  const geometry = new THREE.SphereGeometry(0.1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const neoMesh = new THREE.Mesh(geometry, material);

  neoMesh.position.set(pos.x, pos.y, pos.z);
  scene.add(neoMesh);
  neoMeshes.push({ mesh: neoMesh, data: neo, anomaly: 0 });

  // Add label for NEO
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  labelDiv.textContent = neo.object_name;
  document.body.appendChild(labelDiv);
  labels.push(labelDiv);
});

// Update positions for planets, NEOs, and apply rotation
let time = 0;
function animate() {
  requestAnimationFrame(animate);

  // Move Earth and Mars along their orbits
  time += 0.01;
  earthData.angle += earthData.orbitSpeed;
  marsData.angle += marsData.orbitSpeed;

  earthData.planet.position.set(
    Math.cos(earthData.angle) * earthData.orbitRadius,
    0,
    Math.sin(earthData.angle) * earthData.orbitRadius
  );
  marsData.planet.position.set(
    Math.cos(marsData.angle) * marsData.orbitRadius,
    0,
    Math.sin(marsData.angle) * marsData.orbitRadius
  );

  // Make planets spin on their axes
  earthData.planet.rotation.y += 0.02;
  marsData.planet.rotation.y += 0.01;

  // Move NEOs along their elliptical orbits
  neoMeshes.forEach((neo, index) => {
    neo.anomaly += 0.01; // Simulate motion in the orbit
    const pos = calculateNEOPosition(neo.data, neo.anomaly);
    neo.mesh.position.set(pos.x, pos.y, pos.z);

    // Update label position for NEO
    const vector = new THREE.Vector3(pos.x, pos.y, pos.z);
    vector.project(camera);
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
    labels[index].style.left = `${x}px`;
    labels[index].style.top = `${y}px`;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
