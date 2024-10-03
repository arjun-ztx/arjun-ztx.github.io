const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planets = [
    { name: "Sun", size: 1, color: 0xf0a0a0, distance: 0, semiMajorAxis: 0 },
    { name: "Mercury", size: 0.038, color: 0xaaaaaa, distance: 1.5, semiMajorAxis: 1.5, semiMinorAxis: 1.4 },
    { name: "Venus", size: 0.095, color: 0xffcc99, distance: 2, semiMajorAxis: 2, semiMinorAxis: 1.9 },
    { name: "Earth", size: 0.096, color: 0x0000ff, distance: 2.5, semiMajorAxis: 2.5, semiMinorAxis: 2.4 },
    { name: "Mars", size: 0.051, color: 0xff0000, distance: 3, semiMajorAxis: 3, semiMinorAxis: 2.9 },
    { name: "Jupiter", size: 0.223, color: 0xffa500, distance: 4.5, semiMajorAxis: 4.5, semiMinorAxis: 4.3 },
    { name: "Saturn", size: 0.186, color: 0xffff00, distance: 6, semiMajorAxis: 6, semiMinorAxis: 5.8 },
    { name: "Uranus", size: 0.079, color: 0x00ffff, distance: 10, semiMajorAxis: 10, semiMinorAxis: 9.5 },
    { name: "Neptune", size: 0.076, color: 0x0000ff, distance: 12, semiMajorAxis: 12, semiMinorAxis: 11.5 }
];

const orbits = []; // To store orbit mesh objects
const planetsMeshes = []; // To store planet mesh objects
const clock = new THREE.Clock(); // For time-based animation

// OrbitControls to interact with the scene (zoom, rotate)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true;

function createPlanet(size, distance, color) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance; // Initial position along the x-axis
    scene.add(planet);
    return planet;
}

function createEllipseOrbit(semiMajorAxis, semiMinorAxis) {
    const points = [];
    const segments = 64; // Number of segments to create a smooth ellipse
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2; // Full circle
        const x = semiMajorAxis * Math.cos(angle);
        const y = semiMinorAxis * Math.sin(angle);
        points.push(new THREE.Vector3(x, 0, y)); // Assume orbits lie on the XY plane
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.LineLoop(geometry, material);
    orbit.visible = true; // Default visibility
    scene.add(orbit);
    orbits.push(orbit);
    return orbit;
}

// Create planets and orbits
planets.forEach(planet => {
    const planetMesh = createPlanet(planet.size, planet.distance, planet.color);
    planetsMeshes.push(planetMesh); // Store planet mesh for animation
    if (planet.distance > 0) { // No orbit for the Sun
        createEllipseOrbit(planet.semiMajorAxis, planet.semiMinorAxis);
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

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta(); // Time elapsed since the last frame
    planets.forEach((planet, index) => {
        if (index === 0) return; // Skip the Sun
        
        const angleSpeed = 0.5; // Speed of rotation (you can adjust this)
        const angle = angleSpeed * delta; // Calculate angle based on time
        const planetMesh = planetsMeshes[index];
        
        // Update planet position using elliptical orbit formula
        const semiMajorAxis = planet.semiMajorAxis;
        const semiMinorAxis = planet.semiMinorAxis;
        
        // Calculate new position
        const currentAngle = planetMesh.rotation.y + angle; // Rotate around Y
        const x = semiMajorAxis * Math.cos(currentAngle);
        const z = semiMinorAxis * Math.sin(currentAngle);
        
        planetMesh.position.set(x, 0, z); // Set new position
        planetMesh.rotation.y += angle * 0.5; // Rotate the planet on its axis
    });

    renderer.render(scene, camera);
}

camera.position.z = 10; // Set camera position
animate();
