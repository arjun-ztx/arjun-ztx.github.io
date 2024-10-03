const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls to interact with the scene (zoom, rotate)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true;

// Add ambient light (the Sun)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

class planet{
    
}

const planets = [
    { name: "Sun", size: 5, color: 0xffffff, distance: 0},
    { name: "Mercury", size: 0.075, color: 0xaaaaaa, distance: 10 },
    { name: "Venus", size: 0.087, color: 0xffcc99, distance: 15 },
    { name: "Earth", size: 0.092, color: 0x0000ff, distance: 20 },
    { name: "Mars", size: 0.049, color: 0xff0000, distance: 25 },
    { name: "Jupiter", size: 0.9005, color: 0xffa500, distance: 35 },
    { name: "Saturn", size: 0.837, color: 0xffff00, distance: 45 },
    { name: "Uranus", size: 0.365, color: 0x00ffff, distance: 55 },
    { name: "Neptune", size: 0.354, color: 0x0000ff, distance: 65 }
];

//sun
const SUN = createPlanet(5, 0, 0xffffff)

//mercury
//venus
//earth
//mars
//jupiter
//saturn
//uranus
//neptune

function createPlanet(size, distance, color) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    scene.add(planet);
    return planet;
}
// Loop over the planets array and create each planet
planets.forEach(planet => {
    createPlanet(planet.size, planet.distance, planet.color);
    console.log(planet.name, planet.size, planet.distance);
});

camera.position.z = 30;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // planets.forEach(planet => {
    //     planet.rotation.y += 0.1;
    // });
    // earth.rotation.y += 0.01;
    // mars.rotation.y += 0.01;

    // Update OrbitControls
    controls.update();

    renderer.render(scene, camera);
}
animate();

// Resize event handler for responsiveness
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});