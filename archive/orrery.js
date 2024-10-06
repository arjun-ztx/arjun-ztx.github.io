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


const planets = [
    { name: "Sun", size: 1, color: 0xf0a0a0, distance: 0 }, // Size = 1 for scale reference
    { name: "Mercury", size: 0.038, color: 0xaaaaaa, distance: 1.5 }, // Adjusted for scale
    { name: "Venus", size: 0.095, color: 0xffcc99, distance: 2 }, // Adjusted for scale
    { name: "Earth", size: 0.096, color: 0x0000ff, distance: 2.5 }, // Adjusted for scale
    { name: "Mars", size: 0.051, color: 0xff0000, distance: 3 }, // Adjusted for scale
    { name: "Jupiter", size: 0.223, color: 0xffa500, distance: 4.5 }, // Adjusted for scale
    { name: "Saturn", size: 0.186, color: 0xffff00, distance: 6 }, // Adjusted for scale
    { name: "Uranus", size: 0.079, color: 0x00ffff, distance: 10 }, // Adjusted for scale
    { name: "Neptune", size: 0.076, color: 0x0000ff, distance: 12 } // Adjusted for scale
];

//sun
//const SUN = createPlanet(5, 0, 0xffffff)

//mercury
//venus
//earth
//mars
//jupiter
//saturn
//uranus
//neptune

const orbits = []; // To store orbit mesh objects

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


function createOrbit(distance) {
    const orbitGeometry = new THREE.RingGeometry(distance - 0.01, distance + 0.01, 64); // Thin ring
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate to lie flat in the xy-plane
    orbit.visible = true; // Default visibility
    scene.add(orbit);
    orbits.push(orbit);
    return orbit;   
}

// Create planets and orbits
planets.forEach(planet => {
    createPlanet(planet.size, planet.distance, planet.color);
    if (planet.distance > 0) { // No orbit for the Sun
        createOrbit(planet.distance);
    }
});

// Orbit toggle functionality
const toggleOrbitsCheckbox = document.getElementById('toggleOrbits');
toggleOrbitsCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    orbits.forEach(orbit => {
        orbit.visible = isChecked;
    });
});

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