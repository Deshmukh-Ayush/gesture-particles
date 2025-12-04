"use client";

import { ParticleScene } from "@/components/scene/ParticleScene";
import { HandTracker } from "@/components/vision/HandTracker";
import { HandProvider } from "@/context/HandContext";

export default function Home() {
  return (
    <HandProvider>
      <main className="relative w-full h-screen overflow-hidden bg-black">
        <HandTracker />
        <ParticleScene />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none font-mono text-center">
          <p>✊ Fist: Spin | ✋ Palm: Stop</p>
          <p>↕️ Move Closer: Zoom In</p>
          <p>Made by Ayush with the help of Antigravity AI</p>
        </div>
      </main>
    </HandProvider>
  );
}
