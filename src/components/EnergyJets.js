import * as THREE from 'three';

export default class EnergyJets {
    constructor() {
        this.group = new THREE.Group();
        
        // Top jet particles
        const topCount = 4000;
        const topGeometry = new THREE.BufferGeometry();
        const topPositions = new Float32Array(topCount * 3);
        const topColors = new Float32Array(topCount * 3);
        
        for (let i = 0; i < topCount; i++) {
            const radius = Math.pow(Math.random(), 1.2) * 0.9;
            const angle = Math.random() * Math.PI * 2;
            const height = 0.8 + Math.pow(Math.random(), 1.5) * 4.2;
            
            const spread = radius * (1 - height / 5.5);
            const x = Math.cos(angle) * spread;
            const z = Math.sin(angle) * spread;
            const y = height;
            
            topPositions[i*3] = x;
            topPositions[i*3+1] = y;
            topPositions[i*3+2] = z;
            
            const t = height / 5;
            topColors[i*3] = 1.0;
            topColors[i*3+1] = 0.9 - t * 0.4;
            topColors[i*3+2] = 0.7 + t * 0.3;
        }
        
        topGeometry.setAttribute('position', new THREE.BufferAttribute(topPositions, 3));
        topGeometry.setAttribute('color', new THREE.BufferAttribute(topColors, 3));
        
        const jetMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.topJet = new THREE.Points(topGeometry, jetMaterial);
        this.group.add(this.topJet);
        
        // Bottom jet particles
        const bottomGeometry = new THREE.BufferGeometry();
        const bottomPositions = new Float32Array(topCount * 3);
        for (let i = 0; i < topCount; i++) {
            const radius = Math.pow(Math.random(), 1.2) * 0.9;
            const angle = Math.random() * Math.PI * 2;
            const height = -0.8 - Math.pow(Math.random(), 1.5) * 4.2;
            
            const spread = radius * (1 - Math.abs(height) / 5.5);
            const x = Math.cos(angle) * spread;
            const z = Math.sin(angle) * spread;
            const y = height;
            
            bottomPositions[i*3] = x;
            bottomPositions[i*3+1] = y;
            bottomPositions[i*3+2] = z;
        }
        bottomGeometry.setAttribute('position', new THREE.BufferAttribute(bottomPositions, 3));
        bottomGeometry.setAttribute('color', new THREE.BufferAttribute(topColors, 3));
        
        this.bottomJet = new THREE.Points(bottomGeometry, jetMaterial);
        this.group.add(this.bottomJet);
    }
    
    update(time) {
        this.group.rotation.y += 0.003;
        
        const pulse = 0.7 + Math.sin(time * 6) * 0.2;
        if (this.topJet.material) {
            this.topJet.material.opacity = pulse;
            this.bottomJet.material.opacity = pulse;
        }
    }
}