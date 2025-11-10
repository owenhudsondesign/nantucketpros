"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: number;
  emoji: string;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const serviceEmojis = [
  "🔨", // Construction
  "🔧", // Plumbing
  "⚡", // Electrical
  "🎨", // Painting
  "🌿", // Landscaping
  "🧹", // Cleaning
  "🪟", // Windows
  "🚰", // Plumbing
  "🏡", // Home
  "🛠️", // Tools
  "🪴", // Gardening
  "🧰", // Repairs
  "🔌", // Electrical
  "🪜", // Ladder/Heights
  "🧼", // Cleaning
  "🌳", // Tree Work
  "💡", // Lighting
  "🏗️", // Construction
  "🪚", // Carpentry
  "🖌️", // Painting
  "🚿", // Shower/Bath
  "🔑", // Locksmith
  "🪴", // Plants
  "🪣", // Bucket/Cleaning
  "🧽", // Sponge
  "🌺", // Flowers
  "🪛", // Screwdriver
  "🎯", // Target/Goals
  "🏠", // House
  "🔩", // Bolt
];

export function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const newBubbles: Bubble[] = [];
    const avgDuration = 20; // Average duration for calculations

    for (let i = 0; i < 35; i++) {
      // Use true random for different results each time
      const x = Math.random() * 100; // 0-100%
      const startY = 100 + Math.random() * 20; // Start below viewport
      const duration = Math.random() * 10 + 15; // 15-25s duration

      // Calculate staggered delay across full animation cycle
      const baseDelay = (i / 35) * avgDuration;

      // Start animation halfway through by subtracting half the duration from delay
      // This makes bubbles appear already mid-animation on page load
      const initialOffset = -avgDuration / 2;

      newBubbles.push({
        id: i,
        emoji: serviceEmojis[Math.floor(Math.random() * serviceEmojis.length)], // Random emoji
        size: Math.random() * 40 + 40, // 40-80px
        x: x,
        y: startY,
        delay: baseDelay + initialOffset, // Negative delay starts animation partway through
        duration: duration,
      });
    }
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `calc(${bubble.x}% - ${bubble.size / 2}px)`,
            top: `calc(${bubble.y}% - ${bubble.size / 2}px)`,
            fontSize: `${bubble.size * 0.5}px`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(bubble.id) * 50, 0],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {bubble.emoji}
        </motion.div>
      ))}
    </div>
  );
}
