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
            starColors[i*3]