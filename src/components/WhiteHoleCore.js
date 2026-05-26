import * as THREE from 'three';

export default class WhiteHoleCore {
    constructor() {
        // Create a group to hold everything
        this.group = new THREE.Group();
        
        // Main core (extremely bright)
        const coreGeometry = new THREE.SphereGeometry(0.85, 128, 128);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffee,
            emissive: 0xffcc88,
            emissiveIntensity: 2.8,
            roughness: 0.05,
            metalness: 0.95,
            transparent: true,
            opacity: 0.98
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.core.castShadow = false;
        this.core.receiveShadow = false;
        this.group.add(this.core);
        
        // Inner glow (translucent shell)
        const innerGlowGeometry = new THREE.SphereGeometry(1.05, 96, 96);
        const innerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd99,
            transparent: true,
            opacity: 0.35,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
        this.group.add(this.innerGlow);
        
        // Outer glow (corona)
        const outerGlowGeometry = new THREE.SphereGeometry(1.45, 64, 64);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa66,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        this.group.add(this.outerGlow);
        
        // Surface detail particles
        const surfaceParticleCount = 2000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(surfaceParticleCount * 3);
        for (let i = 0; i < surfaceParticleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 0.88;
            positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i*3+2] = r * Math.cos(phi);
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffdd99,
            size: 0.008,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        this.surfaceParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.group.add(this.surfaceParticles);
    }
    
    update(time) {
        const pulse = 1 + Math.sin(time * 4.2) * 0.025;
        const secondaryPulse = 1 + Math.sin(time * 7.3) * 0.015;
        
        this.core.scale.set(pulse, pulse, pulse);
        this.innerGlow.scale.setScalar(1 + Math.sin(time * 3.8) * 0.03);
        this.outerGlow.scale.setScalar(1 + Math.sin(time * 2.5) * 0.05);
        
        // Update material intensities
        if (this.core.material) {
            this.core.material.emissiveIntensity = 2.6 + Math.sin(time * 4.5) * 0.4;
        }
        if (this.innerGlow.material) {
            this.innerGlow.material.opacity = 0.35 + Math.sin(time * 3.2) * 0.08;
        }
        
        // Rotate surface particles
        this.surfaceParticles.rotation.y += 0.01;
        this.surfaceParticles.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
}