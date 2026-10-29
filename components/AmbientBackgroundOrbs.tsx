"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface SoftGlowOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string; // [r, g, b]
}

export const AmbientBackgroundOrbs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Subtle nocturnal color palette
    // Cyan: 6, 182, 212
    // Emerald: 0, 229, 153
    // Deep Slate: 30, 41, 59
    const colors = [
      "rgba(6, 182, 212,",  // Electric Cyan
      "rgba(0, 229, 153,",  // Neon Emerald
      "rgba(30, 41, 59,",   // Deep Slate
      "rgba(148, 163, 184,", // Muted Silver
    ];

    // Low particle count for minimal CPU footprint (35 particles)
    const particleCount = 36;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.35 + 0.15;
      const colorIndex =
        i % 4 === 0
          ? 0 // Cyan
          : i % 4 === 1
          ? 1 // Emerald
          : i % 4 === 2
          ? 2 // Slate
          : 3; // Silver

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: colors[colorIndex],
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // 3 large, very faint ambient background glow orbs (nebulous drift)
    const glowOrbs: SoftGlowOrb[] = [
      {
        x: width * 0.25,
        y: height * 0.3,
        vx: 0.12,
        vy: 0.08,
        radius: 220,
        color: "6, 182, 212", // Cyan
      },
      {
        x: width * 0.75,
        y: height * 0.65,
        vx: -0.1,
        vy: -0.07,
        radius: 260,
        color: "0, 229, 153", // Emerald
      },
      {
        x: width * 0.5,
        y: height * 0.85,
        vx: 0.08,
        vy: -0.1,
        radius: 200,
        color: "13, 18, 31", // Indigo/slate
      },
    ];

    let lastTime = performance.now();

    const render = (time: number) => {
      // Throttle/smooth delta
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient nebulous glows
      for (const orb of glowOrbs) {
        orb.x += orb.vx * delta;
        orb.y += orb.vy * delta;

        // Bounce gently inside boundary
        if (orb.x < -100) orb.x = width + 100;
        if (orb.x > width + 100) orb.x = -100;
        if (orb.y < -100) orb.y = height + 100;
        if (orb.y > height + 100) orb.y = -100;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, `rgba(${orb.color}, 0.045)`);
        gradient.addColorStop(0.6, `rgba(${orb.color}, 0.015)`);
        gradient.addColorStop(1, "rgba(8, 11, 17, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw connecting filaments for close particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          // Connect within 85px
          if (distSq < 7225) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 85) * 0.08;
            ctx.strokeStyle = `rgba(30, 41, 59, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw micro-particles
      for (const p of particles) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.pulsePhase += p.pulseSpeed * delta;

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle alpha pulsation
        const dynamicAlpha =
          p.baseAlpha + Math.sin(p.pulsePhase) * 0.12;

        ctx.fillStyle = `${p.color}${Math.max(0.05, dynamicAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{
        background: "transparent",
      }}
    />
  );
};

export default AmbientBackgroundOrbs;

