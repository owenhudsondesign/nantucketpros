"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  // Generate many paths from top-left to bottom-right
  const generatePaths = () => {
    const paths = [];
    for (let i = 0; i < 30; i++) {
      const startX = -200 + i * 60;
      const startY = -100 + i * 20;
      const controlX1 = startX + 200 + Math.random() * 100;
      const controlY1 = startY + 300 + Math.random() * 100;
      const endX = startX + 400;
      const endY = startY + 600;
      const controlX2 = endX + 200 + Math.random() * 100;
      const controlY2 = endY + 300 + Math.random() * 100;
      const finalX = endX + 400;
      const finalY = endY + 600;

      paths.push({
        path: `M${startX},${startY} Q${controlX1},${controlY1} ${endX},${endY} T${finalX},${finalY}`,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 10,
      });
    }
    return paths;
  };

  const paths = generatePaths();

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden z-0",
        className
      )}
    >
      <svg
        className="absolute h-full w-full pointer-events-none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgba(156, 163, 175, 0)" }} />
            <stop offset="50%" style={{ stopColor: "rgba(156, 163, 175, 0.3)" }} />
            <stop offset="100%" style={{ stopColor: "rgba(156, 163, 175, 0)" }} />
          </linearGradient>
        </defs>
        {paths.map((pathData, idx) => (
          <motion.path
            key={`beam-${idx}`}
            d={pathData.path}
            fill="none"
            stroke="url(#beam-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: pathData.duration,
              repeat: Infinity,
              repeatType: "loop",
              delay: pathData.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
