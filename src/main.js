import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import WhiteHoleCore from './components/WhiteHoleCore.js';
import AccretionDisk from './components/AccretionDisk.js';
import EnergyJets from './components/EnergyJets.js';
import GravitationalLensing from './components/GravitationalLensing.js';
import Starfield from './components/Starfield.js';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.0003);

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2.5, 12);
camera.lookAt(0, 0, 0);

// --- RENDERER (High Quality) ---
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    powerPreference: "high-performance",
    alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- POST PROCESSING (Cinematic Quality) ---
const renderScene = new RenderPass(scene, camera);

// Bloom effect for intense brightness
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.8, 0.5, 0.85);
bloomPass.threshold = 0.05;
bloomPass.strength = 1.4;
bloomPass.radius = 0.8;

// Film grain for cinematic feel
const filmPass = new FilmPass(0.25, 0.5, 2048, false);
filmPass.renderToScreen = false;

// FXAA for anti-aliasing
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
fxaaPass.renderToScreen = true;

const effectComposer = new EffectComposer(renderer);
effectComposer.addPass(renderScene);
effectComposer.addPass(bloomPass);
effectComposer.addPass(filmPass);
effectComposer.addPass(fxaaPass);

// --- CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.enableZoom = true;
controls.enablePan = false;
controls.zoomSpeed = 1.2;
controls.rotateSpeed = 1.0;
controls.target.set(0, 0, 0);

// --- LIGHTING SYSTEM (Dynamic & Volumetric) ---
// Ambient
const ambientLight = new THREE.AmbientLight(0x111122);
scene.add(ambientLight);

// Main directional light
const mainLight = new THREE.DirectionalLight(0xffeedd, 1.2);
mainLight.position.set(2, 3, 4);
mainLight.castShadow = true;
mainLight.receiveShadow = false;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

// Fill light from below
const fillLight = new THREE.PointLight(0x88aaff, 0.6);
fillLight.position.set(0, -2, 0);
scene.add(fillLight);

// Back rim light for edge definition
const rimLight = new THREE.PointLight(0xffaa66, 1.0);
rimLight.position.set(0, 1, -3);
scene.add(rimLight);

// Pulsing core light
const coreLight = new THREE.PointLight(0xffaa88, 2.5, 15);
coreLight.position.set(0, 0, 0);
scene.add(coreLight);

// Volumetric light helper (spherical glow)
const glowGeometry = new THREE.SphereGeometry(1.8, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa77,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
});
const volumetricGlow = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(volumetricGlow);

// --- WHITE HOLE COMPONENTS ---
const whiteHoleCore = new WhiteHoleCore();
scene.add(whiteHoleCore.core);
scene.add(whiteHoleCore.innerGlow);
scene.add(whiteHoleCore.outerGlow);

const accretionDisk = new AccretionDisk();
scene.add(accretionDisk.disk);
scene.add(accretionDisk.innerRing);
scene.add(accretionDisk.spiralArm);

const energyJets = new EnergyJets();
scene.add(energyJets.topJet);
scene.add(energyJets.bottomJet);
scene.add(energyJets.plasmaParticles);

const gravitationalLensing = new GravitationalLensing();
scene.add(gravitationalLensing.lensRing);
scene.add(gravitationalLensing.distortionField);

const starfield = new Starfield();
scene.add(starfield.stars);
scene.add(starfield.nebulaDust);

// --- ADDITIONAL REALISTIC EFFECTS ---

// Floating particles (spacetime foam)
const spacetimeFoamCount = 8000;
const foamGeometry = new THREE.BufferGeometry();
const foamPositions = new Float32Array(spacetimeFoamCount * 3);
for (let i = 0; i < spacetimeFoamCount; i++) {
    foamPositions[i*3] = (Math.random() - 0.5) * 30;
    foamPositions[i*3+1] = (Math.random() - 0.5) * 20;
    foamPositions[i*3+2] = (Math.random() - 0.5) * 25 - 5;
}
foamGeometry.setAttribute('position', new THREE.BufferAttribute(foamPositions, 3));
const foamMaterial = new THREE.PointsMaterial({
    color: 0x88aaff,
    size: 0.012,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
});
const spacetimeFoam = new THREE.Points(foamGeometry, foamMaterial);
scene.add(spacetimeFoam);

// Energy arcs (lightning-like effects around the hole)
const arcCount = 12;
const arcs = [];
for (let i = 0; i < arcCount; i++) {
    const arcPoints = [];
    const angle = (i / arcCount) * Math.PI * 2;
    for (let r = 1.2; r <= 2.8; r += 0.1) {
        const offset = Math.sin(r * 15) * 0.05;
        const x = Math.cos(angle + offset) * r;
        const z = Math.sin(angle + offset) * r;
        const y = Math.sin(r * 8) * 0.15;
        arcPoints.push(new THREE.Vector3(x, y, z));
    }
    const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0xffaa77, transparent: true, opacity: 0.4 });
    const arc = new THREE.Line(arcGeometry, arcMaterial);
    scene.add(arc);
    arcs.push(arc);
}

// --- ANIMATION VARIABLES ---
let time = 0;
let energyPulse = 0;

// Energy level UI update
const energyElement = document.getElementById('energyLevel');
let energyValue = 100;
let energyDirection = -1;

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    time += 0.016;
    energyPulse = Math.sin(time * 3) * 0.15 + 0.85;
    
    // Update UI energy level (pulsing)
    energyValue += energyDirection * 0.5;
    if (energyValue >= 100) energyDirection = -1;
    if (energyValue <= 85) energyDirection = 1;
    if (energyElement) energyElement.textContent = Math.floor(energyValue);
    
    // Update white hole core
    whiteHoleCore.update(time);
    
    // Update accretion disk
    accretionDisk.update(time);
    
    // Update energy jets
    energyJets.update(time);
    
    // Update gravitational lensing
    gravitationalLensing.update(time);
    
    // Update starfield
    starfield.update(time);
    
    // Dynamic lighting
    coreLight.intensity = 2.2 + Math.sin(time * 4.5) * 0.6;
    rimLight.intensity = 0.9 + Math.sin(time * 3.2) * 0.3;
    fillLight.intensity = 0.5 + Math.sin(time * 2.1) * 0.15;
    
    // Volumetric glow pulse
    volumetricGlow.scale.setScalar(1 + Math.sin(time * 3) * 0.05);
    volumetricGlow.material.opacity = 0.08 + Math.sin(time * 2.5) * 0.03;
    
    // Rotate spacetime foam
    spacetimeFoam.rotation.y += 0.0005;
    spacetimeFoam.rotation.x = Math.sin(time * 0.1) * 0.1;
    
    // Update energy arcs
    arcs.forEach((arc, idx) => {
        arc.rotation.y += 0.005;
        arc.material.opacity = 0.3 + Math.sin(time * 3 + idx) * 0.2;
    });
    
    // Update controls
    controls.update();
    
    // Render with post-processing
    effectComposer.render();
    
    // Bloom strength modulation
    bloomPass.strength = 1.3 + Math.sin(time * 2) * 0.1;
}

// --- RESIZE HANDLER ---
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effectComposer.setSize(window.innerWidth, window.innerHeight);
    
    // Update FXAA resolution
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
}

console.log('✨ Hyper-realistic White Hole initialized | Gravitational Singularity Active');
animate();