// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a simple sphere to represent the Sun
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

// Add a smaller blue sphere to represent Earth
const earthGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(5, 0, 0);
scene.add(earth);

// Position the camera
camera.position.z = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Earth around the Sun
    const time = Date.now() * 0.001;
    earth.position.x = Math.cos(time) * 5;
    earth.position.z = Math.sin(time) * 5;

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});