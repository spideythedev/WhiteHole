import * as THREE from 'three';

export default class Starfield {
    constructor() {
        this.group = new THREE.Group();
        
        // Background stars
        const starCount = 6000;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const radius = 80 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPositions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
            starPositions[i*3+2] = radius * Math.cos(phi);
            
            const colorTemp = 0.6 + Math.random() * 0.4;
            starColors[i*3] = colorTemp;
            starColors[i*3+1] = colorTemp * (0.7 + Math.random() * 0.3);
            starColors[i*3+2] = 1.0;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.group.add(this.stars);
        
        // Nebula dust
        const dustCount = 3000;
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
            size: 0.04,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending
        });
        
        this.nebulaDust = new THREE.Points(dustGeometry, dustMaterial);
        this.group.add(this.nebulaDust);
    }
    
    update(time) {
        this.group.rotation.y += 0.0002;
        this.group.rotation.x = Math.sin(time * 0.05) * 0.03;
    }
}