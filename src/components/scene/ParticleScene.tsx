"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Particles } from "./Particles";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function ParticleScene() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#000000"]} />
          <Particles count={8000} />
          <Environment preset="city" />
          <OrbitControls makeDefault enableZoom={false} />

          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.5}
              radius={0.4}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
