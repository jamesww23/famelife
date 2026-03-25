"use client";

import { useEffect, useState } from "react";

const SPARKLE_COLORS = ["#ffd700", "#ff6b9d", "#e040fb", "#00e5ff", "#ffffff", "#f59e0b"];

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  drift: number;
}

export function Logo() {
  const [sparkles, setSparkles] = useState<Spark[]>([]);

  useEffect(() => {
    // Generate initial sparkles
    const generateSparkles = () => {
      const sparks: Spark[] = [];
      for (let i = 0; i < 12; i++) {
        sparks.push({
          id: i,
          x: 10 + Math.random() * 80,
          y: 20 + Math.random() * 60,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          size: 2 + Math.random() * 4,
          delay: Math.random() * 2,
          drift: -30 + Math.random() * 60,
        });
      }
      setSparkles(sparks);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative text-center py-4">
      {/* Sparkle particles behind text */}
      <div className="sparkle-container" style={{ height: "120px", top: "-10px" }}>
        {sparkles.map((s) => (
          <div
            key={`${s.id}-${s.delay}`}
            className="sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              animationDelay: `${s.delay}s`,
              "--drift": `${s.drift}px`,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Camera/phone icon */}
      <div className="text-4xl sm:text-5xl mb-2 animate-gentle-bounce" style={{ filter: "drop-shadow(0 0 12px rgba(255, 215, 0, 0.5))" }}>
        📱
      </div>

      {/* Main title */}
      <h1 className="logo-text text-5xl sm:text-6xl font-black tracking-tight mb-1" style={{ lineHeight: 1.1 }}>
        FAME LIFE
      </h1>

      {/* Subtitle */}
      <p className="logo-subtitle text-sm sm:text-base font-bold tracking-widest uppercase">
        Rise to Glory
      </p>

      {/* Decorative line */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#e040fb] animate-pulse" style={{ animationDelay: "0.3s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" style={{ animationDelay: "0.6s" }} />
        </div>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
      </div>
    </div>
  );
}
