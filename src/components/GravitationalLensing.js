import * as THREE from 'three';

export default class GravitationalLensing {
    constructor() {
        this.group = new THREE.Group();
        this.rings = [];
        
        // Einstein ring effect
        for (let i = 0; i < 3; i++) {
            const radius = 1.9 + i * 0.35;
            const geometry = new THREE.TorusGeometry(radius, 0.02, 64, 200);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffaa77,
                transparent: true,
                opacity: 0.25 - i * 0.05,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2;
            this.rings.push(ring);
            this.group.add(ring);
        }
        
        // Distortion field particles
        const distortionCount = 4000;
        const distortionGeometry = new THREE.BufferGeometry();
        const distortionPositions = new Float32Array(distortionCount * 3);
        
        for (let i = 0; i < distortionCount; i++) {
            const radius = 1.2 + Math.random() * 2.5;
            const angle = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 1.2;
            
            distortionPositions[i*3] = Math.cos(angle) * radius;
            distortionPositions[i*3+1] = y;
            distortionPositions[i*3+2] = Math.sin(angle) * radius;
        }
        
        distortionGeometry.setAttribute('position', new THREE.BufferAttribute(distortionPositions, 3));
        const distortionMaterial = new THREE.PointsMaterial({
            color: 0x88aaff,
            size: 0.008,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        this.distortionField = new THREE.Points(distortionGeometry, distortionMaterial);
        this.group.add(this.distortionField);
    }
    
    update(time) {
        this.rings.forEach((ring, idx) => {
            ring.rotation.z += 0.002 * (idx + 1);
            if (ring.material) {
                ring.material.opacity = 0.2 + Math.sin(time * 1.5 + idx) * 0.08;
            }
        });
        
        this.group.rotation.y += 0.001;
    }
}