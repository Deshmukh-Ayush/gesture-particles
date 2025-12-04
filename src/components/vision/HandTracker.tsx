"use client";

import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useHandData } from "@/context/HandContext";

export function HandTracker() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
    const { handDataRef } = useHandData();

    useEffect(() => {
        const initHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            const landmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 2,
            });
            setHandLandmarker(landmarker);
        };

        initHandLandmarker();
    }, []);

    const requestRef = useRef<number | null>(null);

    const predictWebcam = () => {
        if (!handLandmarker || !videoRef.current) return;

        const startTimeMs = performance.now();
        const results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
            const hand = results.landmarks[0];

            // 1. Proximity Calculation
            const wrist = hand[0];
            const middleMCP = hand[9];
            const size = Math.sqrt(
                Math.pow(middleMCP.x - wrist.x, 2) +
                Math.pow(middleMCP.y - wrist.y, 2)
            );
            const proximity = Math.min(Math.max((size - 0.05) * 4, 0), 1);

            // 2. Gesture Detection (Fist vs Palm)
            const tips = [8, 12, 16, 20];
            let avgTipDist = 0;

            tips.forEach(tipIdx => {
                const tip = hand[tipIdx];
                const dist = Math.sqrt(
                    Math.pow(tip.x - wrist.x, 2) +
                    Math.pow(tip.y - wrist.y, 2)
                );
                avgTipDist += dist;
            });
            avgTipDist /= 4;

            const normalizedDist = avgTipDist / size;
            const gesture = normalizedDist < 1.2 ? 'FIST' : 'PALM';

            handDataRef.current = {
                landmarks: results.landmarks,
                worldLandmarks: results.worldLandmarks,
                handedness: results.handedness,
                isPresent: true,
                gesture,
                proximity,
            };
        } else {
            handDataRef.current = {
                landmarks: [],
                worldLandmarks: [],
                handedness: [],
                isPresent: false,
                gesture: 'NONE',
                proximity: 0,
            };
        }

        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    useEffect(() => {
        if (handLandmarker && videoRef.current) {
            const video = videoRef.current;

            const enableCam = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480 }
                    });
                    video.srcObject = stream;
                    video.addEventListener("loadeddata", predictWebcam);
                } catch (err) {
                    console.error("Error accessing webcam:", err);
                }
            };

            enableCam();
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [handLandmarker]);

    return (
        <div className="absolute top-4 left-4 z-50 w-48 h-36 bg-gray-900/50 rounded-lg overflow-hidden border border-white/10 opacity-50 hover:opacity-100 transition-opacity">
            <video
                ref={videoRef}
                className="w-full h-full object-cover -scale-x-100"
                autoPlay
                playsInline
                muted
            />
        </div>
    );
}
