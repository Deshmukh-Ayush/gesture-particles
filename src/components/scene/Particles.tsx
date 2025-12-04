"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useHandData } from "@/context/HandContext";

export function Particles({ count = 4000 }) {
    const mesh = useRef<THREE.Points>(null);
    const { handDataRef } = useHandData();

    // Create a star-like texture programmatically
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
        }
        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, []);

    const { positions, originalPositions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Sphere distribution
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            const r = 4 + (Math.random() - 0.5) * 0.5; // Slight variation in radius
            const x = r * Math.cos(theta) * Math.sin(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            // Star colors (white, blueish, yellowish)
            const starType = Math.random();
            if (starType > 0.9) color.setHex(0xffaaaa); // Reddish
            else if (starType > 0.7) color.setHex(0xaaccff); // Blueish
            else color.setHex(0xffffff); // White

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random();
        }
        return { positions, originalPositions, colors, sizes };
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const handData = handDataRef.current;

        if (mesh.current) {
            const positionsAttribute = mesh.current.geometry.attributes.position;

            // Default state
            let targetScale = 1;
            let rotationSpeed = 0.05;

            // Interaction Logic
            if (handData.isPresent) {
                // 1. Proximity Zoom
                // Map proximity (0-1) to scale (1-3)
                targetScale = 1 + handData.proximity * 2;

                // 2. Fist Rotation
                if (handData.gesture === 'FIST') {
                    rotationSpeed = 2.0; // Fast spin
                } else if (handData.gesture === 'PALM') {
                    rotationSpeed = 0; // Stop
                }
            }

            // Smoothly interpolate scale
            mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // Rotate
            mesh.current.rotation.y += rotationSpeed * 0.01;
            mesh.current.rotation.x += rotationSpeed * 0.005;

            // Star twinkling and movement
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const ox = originalPositions[i3];
                const oy = originalPositions[i3 + 1];
                const oz = originalPositions[i3 + 2];

                // Gentle floating
                const noise = Math.sin(time * 0.5 + ox) * 0.05;

                positionsAttribute.array[i3] = ox + noise;
                positionsAttribute.array[i3 + 1] = oy + noise;
                positionsAttribute.array[i3 + 2] = oz;
            }

            positionsAttribute.needsUpdate = true;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={sizes.length}
                    array={sizes}
                    itemSize={1}
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                map={texture}
                sizeAttenuation
                transparent
                alphaTest={0.01}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
