import * as THREE from 'three';

export default class Starfield {
    constructor() {
        // Background stars
        const starCount = 8000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            // Distribute stars in a sphere
            const radius = 80 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPositions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
            starPositions[i*3+2] = radius * Math.cos(phi);
            
            // Star color (slightly varied)
            const colorTemp = 0.6 + Math.random() * 0.4;
            starColors[i*3] = colorTemp;
            starColors[i*3+1] = colorTemp * (0.7 + Math.random() * 0.3);
            starColors[i*3+2] = 1.0;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        
        // Nebula dust (distant haze)
        const dustCount = 4000;
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);
        
        for (let i = 0; i < dustCount; i++) {
            dustPositions[i*3] = (Math.random() - 0.5) * 200;
            dustPositions[i*3+1] = (Math.random() - 0.5) * 100;
            dustPositions[i*3+2] = (Math.random() - 0.5) * 150 - 50;
        }
        
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        const dustMaterial = new THREE.PointsMaterial({
            color: 0x88aaff,
            size: 0.05,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        
        this.nebulaDust = new THREE.Points(dustGeometry, dustMaterial);
    }
    
    update(time) {
        // Slowly rotate starfield for sense of motion
        this.stars.rotation.y += 0.0002;
        this.stars.rotation.x = Math.sin(time * 0.05) * 0.05;
        
        this.nebulaDust.rotation.y -= 0.0001;
    }
}