"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

interface HandData {
    landmarks: any[]; // Using any for now, ideally typed from MediaPipe
    worldLandmarks: any[];
    handedness: any[];
    isPresent: boolean;
    gesture: 'FIST' | 'PALM' | 'NONE';
    proximity: number; // 0 (far) to 1 (close)
}

interface HandContextType {
    handDataRef: React.MutableRefObject<HandData>;
}

const HandContext = createContext<HandContextType | null>(null);

export function HandProvider({ children }: { children: ReactNode }) {
    const handDataRef = useRef<HandData>({
        landmarks: [],
        worldLandmarks: [],
        handedness: [],
        isPresent: false,
        gesture: 'NONE',
        proximity: 0,
    });

    return (
        <HandContext.Provider value={{ handDataRef }}>
            {children}
        </HandContext.Provider>
    );
}

export function useHandData() {
    const context = useContext(HandContext);
    if (!context) {
        throw new Error("useHandData must be used within a HandProvider");
    }
    return context;
}
