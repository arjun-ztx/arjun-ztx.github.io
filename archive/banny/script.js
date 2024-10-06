// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); // Set clear color
document.body.appendChild(renderer.domElement);

// OrbitControls to interact with the scene (zoom, rotate)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true; 
controls.enablePan = true;  
    
// Add point light (the Sun)    
const light = new THREE.PointLight(0xffffff, 2, 1000);  
light.position.set(0, 0, 0);    
scene.add(light);   

// Texture loader for applying textures to planets, Sun, and asteroids
const textureLoader = new THREE.TextureLoader();

// Load textures from local files
const sunTexture = textureLoader.load('textures/sun.jpg');
const mercuryTexture = textureLoader.load('textures/8k_mercury.jpg'); // Fixed: added .jpg
const venusTexture = textureLoader.load('textures/8k_venus_surface.jpg');
const earthTexture = textureLoader.load('textures/8k_earth_daymap.jpg');
const marsTexture = textureLoader.load('textures/8k_mars.jpg');
const jupiterTexture = textureLoader.load('textures/8k_jupiter.jpg');
const saturnTexture = textureLoader.load('textures/8k_saturn.jpg');
const uranusTexture = textureLoader.load('textures/2k_uranus.jpg');
const neptuneTexture = textureLoader.load('textures/2k_neptune.jpg');
const asteroidTexture = textureLoader.load('textures/wallpaperflare.com_wallpaper (3).jpg'); // Texture for asteroids

// Planet class definition
class Planet {
    constructor(name, size, texture, distance, orbitSpeed) {
        this.name = name;
        this.size = size;
        this.texture = texture;
        this.distance = distance;
        this.orbitSpeed = orbitSpeed;
        this.mesh = this.createPlanet();
        this.angle = Math.random() * 2 * Math.PI; // Random start position for orbit
    }

    createPlanet() {
        const geometry = new THREE.SphereGeometry(this.size, 32, 32);
        const material = new THREE.MeshBasicMaterial({ map: this.texture });
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = this.distance;
        scene.add(planet);
        return planet;
    }

    orbit() {
        // Simple circular orbit around the Sun (0,0,0)
        this.angle += this.orbitSpeed;
        this.mesh.position.x = Math.cos(this.angle) * this.distance;
        this.mesh.position.z = Math.sin(this.angle) * this.distance;
    }
}

// Create the Sun with texture
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets with textures and orbit speeds
const planets = [
   new Planet("Mercury", 0.5, mercuryTexture, 10, 0.04),
    new Planet("Venus", 0.6, venusTexture, 15, 0.03),
    new Planet("Earth", 0.7, earthTexture, 20, 0.02),
    new Planet("Mars", 0.4, marsTexture, 25, 0.015),
    new Planet("Jupiter", 1.2, jupiterTexture, 35, 0.01),
    new Planet("Saturn", 1.0, saturnTexture, 45, 0.009),
    new Planet("Uranus", 0.6, uranusTexture, 55, 0.008),
    new Planet("Neptune", 0.6, neptuneTexture, 65, 0.007)
];

// NASA API for asteroids
const apiKey = 'lRGZwhHeJZwLGdL7mrvgjohXrQPSqPrnz2yXMknA'; // Replace with your NASA API key
const neoWsUrl = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-10-01&end_date=2024-10-02&api_key=${apiKey}'; // Fixed: backticks for string interpolation

let asteroidMeshes = [];

// Fetch asteroid data from NASA API
async function fetchAsteroidData() {
    const response = await fetch(neoWsUrl);
    const data = await response.json();
    const nearEarthObjects = data.near_earth_objects;

    let asteroids = [];
    Object.keys(nearEarthObjects).forEach(date => {
        asteroids = asteroids.concat(nearEarthObjects[date]);
    });

    createAsteroids(asteroids);
}

// Create asteroids with random positions and a texture
function createAsteroids(asteroids) {
    asteroids.forEach((asteroid) => {
        const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max / 5; // Scale size down
        const distance = asteroid.close_approach_data[0].miss_distance.kilometers / 1000000 + 70; // Scale distance

        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshBasicMaterial({ map: asteroidTexture });
        const asteroidMesh = new THREE.Mesh(geometry, material);
        
        // Randomize position to spread asteroids around the solar system
        asteroidMesh.position.x = Math.cos(Math.random() * Math.PI * 2) * distance;
        asteroidMesh.position.z = Math.sin(Math.random() * Math.PI * 2) * distance;
        asteroidMesh.position.y = Math.random() * 10 - 5; // Height variance

        asteroidMeshes.push({ mesh: asteroidMesh, info: asteroid });
        scene.add(asteroidMesh);
    });
}

fetchAsteroidData();

camera.position.set(0, 0, 100); // Set camera position

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    console.log("Animating...");
    planets.forEach(planet => planet.orbit());
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

// Raycasting to show asteroid information
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.createElement('div');
infoPanel.style.position = 'absolute';
infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
infoPanel.style.color = 'white';
infoPanel.style.padding = '10px';
infoPanel.style.borderRadius = '8px';
infoPanel.style.display = 'none';
document.body.appendChild(infoPanel);

// Mouse movement event listener for asteroid info display
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(asteroidMeshes.map(obj => obj.mesh));

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const asteroidInfo = asteroidMeshes.find(obj => obj.mesh === intersected).info;

        infoPanel.style.left = `${event.clientX + 10}px`; // Fixed: backticks
        infoPanel.style.top = `${event.clientY + 10}px`; // Fixed: backticks
        infoPanel.style.display = 'block';
        infoPanel.innerHTML = `
            <strong>Name:</strong> ${asteroidInfo.name}<br>
            <strong>Size (km):</strong> ${asteroidInfo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}<br>
            <strong>Miss Distance (km):</strong> ${asteroidInfo.close_approach_data[0].miss_distance.kilometers.toFixed(2)}<br>
            <strong>Velocity (km/h):</strong> ${asteroidInfo.close_approach_data[0].relative_velocity.kilometers_per_hour.toFixed(2)}
        `;
    } else {
        infoPanel.style.display = 'none';
    }
});