import * as THREE from 'three';

export default class EnergyJets {
    constructor() {
       
        const topCount = 6000;
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
            
            // Color gradient: white at base, blue at tip
            const t = height / 5;
            topColors[i*3] = 1.0;
            topColors[i*3+1] = 0.9 - t * 0.4;
            topColors[i*3+2] = 0.7 + t * 0.3;
        }
        
        topGeometry.setAttribute('position', new THREE.BufferAttribute(topPositions, 3));
        topGeometry.setAttribute('color', new THREE.BufferAttribute(topColors, 3));
        
        const jetMaterial = new THREE.PointsMaterial({
            size: 0.022,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.topJet = new THREE.Points(topGeometry, jetMaterial);
        
       
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
        
     
        const plasmaCount = 4000;
        const plasmaGeometry = new THREE.BufferGeometry();
        const plasmaPositions = new Float32Array(plasmaCount * 3);
        this.plasmaVelocities = [];
        
        for (let i = 0; i < plasmaCount; i++) {
            const isTop = Math.random() > 0.5;
            const radius = Math.random() * 0.7;
            const angle = Math.random() * Math.PI * 2;
            const height = (isTop ? 1 : -1) * (0.5 + Math.random() * 3);
            
            plasmaPositions[i*3] = Math.cos(angle) * radius;
            plasmaPositions[i*3+1] = height;
            plasmaPositions[i*3+2] = Math.sin(angle) * radius;
            
            this.plasmaVelocities.push({
                speed: 0.02 + Math.random() * 0.03,
                isTop: isTop,
                radius: radius,
                angle: angle
            });
        }
        
        plasmaGeometry.setAttribute('position', new THREE.BufferAttribute(plasmaPositions, 3));
        const plasmaMaterial = new THREE.PointsMaterial({
            color: 0xffaa88,
            size: 0.015,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.plasmaParticles = new THREE.Points(plasmaGeometry, plasmaMaterial);
        this.plasmaPositions = plasmaPositions;
    }
    
    update(time) {
      
        this.topJet.rotation.y += 0.003;
        this.bottomJet.rotation.y += 0.003;
        
       
        for (let i = 0; i < this.plasmaVelocities.length; i++) {
            const v = this.plasmaVelocities[i];
            let y = this.plasmaPositions[i*3+1];
            
            if (v.isTop) {
                y += v.speed;
                if (y > 4.5) y = 0.6;
            } else {
                y -= v.speed;
                if (y < -4.5) y = -0.6;
            }
            
            this.plasmaPositions[i*3+1] = y;
            
          
            const t = Math.abs(y) / 4.5;
            const radius = v.radius * (1 - t * 0.5);
            this.plasmaPositions[i*3] = Math.cos(v.angle + time) * radius;
            this.plasmaPositions[i*3+2] = Math.sin(v.angle + time) * radius;
        }
        
        this.plasmaParticles.geometry.attributes.position.needsUpdate = true;
        
        
        const pulse = 0.7 + Math.sin(time * 6) * 0.2;
        this.plasmaParticles.material.opacity = pulse;
    }
}