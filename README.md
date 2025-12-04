# Gesture Controlled Particle System

An interactive 3D particle system built with **Next.js**, **Three.js (React Three Fiber)**, and **MediaPipe**. Control a field of 4,000 glowing stars using hand gestures in real-time.

## Features

- **3D Particle System**: A dynamic sphere of star-like particles.
- **Hand Tracking**: Real-time hand detection using your webcam.
- **Interactive Gestures**:
  - **Proximity Zoom**: Move your hand closer to the camera to zoom in.
  - **Fist Rotation**: Make a **Fist** to spin the sphere. Open your hand (**Palm**) to stop.
- **Post-Processing**: Bloom effect for a premium, glowing look.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Deshmukh-Ayush/gesture-particles.git
   cd gesture-particles
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Open [http://localhost:3000](http://localhost:3000) with your browser.

5. **Allow Camera Access**:
   The application requires camera access to track your hand gestures.

## Usage

Once the application is running and camera access is granted:

- **Show your hand** to the camera.
- **Zoom**: Move your hand closer to the screen to zoom into the star field.
- **Spin**: Make a **Fist** to start spinning the stars.
- **Stop**: Open your hand to stop the rotation.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Crafted by Ayush Deshmukh with Antigravity AI**
