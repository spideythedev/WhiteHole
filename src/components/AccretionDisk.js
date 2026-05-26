import * as THREE from 'three';

export default class AccretionDisk {
    constructor() {
        this.group = new THREE.Group();
        
        const particleCount = 20000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const radius = 1.4 + Math.pow(Math.random(), 1.5) * 4.2;
            const angle = Math.random() * Math.PI * 2;
            
            // Spiral arm effect
            const spiralStrength = 3.5;
            const spiralAngle = angle + (radius - 1.4) * spiralStrength;
            
            // Thickness decreases with radius
            const thickness = 0.08 * (1 - (radius - 1.4) / 5);
            const yOffset = (Math.random() - 0.5) * thickness;
            
            // Warp the disk slightly
            const warp = Math.sin(radius * 3) * 0.03;
            
            const x = Math.cos(spiralAngle) * radius;
            const z = Math.sin(spiralAngle) * radius;
            const y = yOffset + warp * Math.sin(angle * 2);
            
            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;
            
            // Color based on radius and temperature
            const t = (radius - 1.4) / 4.2;
            
            const r = 1.0;
            const g = 0.95 - t * 0.3;
            const b = 0.85 - t * 0.55;
            
            colors[i*3] = r;
            colors[i*3+1] = g;
            colors[i*3+2] = b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        
        this.disk = new THREE.Points(geometry, material);
        this.group.add(this.disk);
        
        // Inner bright ring
        const innerRingCount = 5000;
        const ringGeometry = new THREE.BufferGeometry();
        const ringPositions = new Float32Array(innerRingCount * 3);
        for (let i = 0; i < innerRingCount; i++) {
            const radius = 1.15 + Math.random() * 0.35;
            const angle = Math.random() * Math.PI * 2;
            ringPositions[i*3] = Math.cos(angle) * radius;
            ringPositions[i*3+1] = (Math.random() - 0.5) * 0.04;
            ringPositions[i*3+2] = Math.sin(angle) * radius;
        }
        ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
        const ringMaterial = new THREE.PointsMaterial({
            color: 0xffaa88,
            size: 0.012,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        this.innerRing = new THREE.Points(ringGeometry, ringMaterial);
        this.group.add(this.innerRing);
    }
    
    update(time) {
        this.group.rotation.y += 0.008;
        this.innerRing.rotation.y -= 0.005;
        
        const pulse = 0.75 + Math.sin(time * 5) * 0.1;
        if (this.disk.material) {
            this.disk.material.opacity = pulse;
        }
    }
}