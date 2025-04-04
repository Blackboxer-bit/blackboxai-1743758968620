// Three.js 3D Game Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Basic lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3a5f0b,
    roughness: 0.8
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Player
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

// Weapons
const weapons = {
    sword: createWeapon(0xcccccc, new THREE.BoxGeometry(0.2, 1, 0.1)),
    axe: createWeapon(0x8B4513, new THREE.BoxGeometry(0.3, 1, 0.1)),
    spear: createWeapon(0xC0C0C0, new THREE.CylinderGeometry(0.05, 0.05, 1.5)),
    hellbeard: createWeapon(0xFF4500, new THREE.BoxGeometry(0.4, 0.4, 0.4))
};

function createWeapon(color, geometry) {
    const material = new THREE.MeshStandardMaterial({ color });
    const weapon = new THREE.Mesh(geometry, material);
    weapon.castShadow = true;
    return weapon;
}

let currentWeapon = weapons.sword;
player.add(currentWeapon);
currentWeapon.position.set(0.5, 0, -0.5);

// Controls
const keyStates = {};
window.addEventListener('keydown', (e) => {
    keyStates[e.key.toLowerCase()] = true;
    e.preventDefault();
});
window.addEventListener('keyup', (e) => {
    keyStates[e.key.toLowerCase()] = false;
    e.preventDefault();
});

// Touch controls for mobile
if ('ontouchstart' in window) {
    const touchArea = document.createElement('div');
    touchArea.style.position = 'fixed';
    touchArea.style.bottom = '0';
    touchStyle();
    document.body.appendChild(touchArea);
    
    function touchStyle() {
        touchArea.style.width = '100%';
        touchArea.style.height = '150px';
        touchArea.style.backgroundColor = 'rgba(0,0,0,0.5)';
        touchArea.style.zIndex = '100';
    }
}

// Weapon switching
document.getElementById('swordBtn').addEventListener('click', () => switchWeapon('sword'));
document.getElementById('axeBtn').addEventListener('click', () => switchWeapon('axe'));
document.getElementById('spearBtn').addEventListener('click', () => switchWeapon('spear'));
document.getElementById('hellbeardBtn').addEventListener('click', () => switchWeapon('hellbeard'));

function switchWeapon(type) {
    player.remove(currentWeapon);
    currentWeapon = weapons[type];
    player.add(currentWeapon);
    currentWeapon.position.set(0.5, 0, -0.5);
}

// Game loop
function animate() {
    requestAnimationFrame(animate);
    
    // Player movement with normalized diagonal movement
    const moveSpeed = 0.1;
    const moveX = (keyStates['d'] ? 1 : 0) - (keyStates['a'] ? 1 : 0);
    const moveZ = (keyStates['w'] ? 1 : 0) - (keyStates['s'] ? 1 : 0);
    
    if (moveX !== 0 || moveZ !== 0) {
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        const normalizedX = moveX / length;
        const normalizedZ = moveZ / length;
        
        player.position.x += normalizedX * moveSpeed;
        player.position.z += normalizedZ * moveSpeed;
    }
    
    // Camera follows player
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
