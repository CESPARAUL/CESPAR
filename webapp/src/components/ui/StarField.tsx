"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  depth: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
};

const DRIFT_ANGLE = (200 * Math.PI) / 180; // slow down-and-left drift
const DRIFT_SPEED = 16; // px/sec at depth = 1 (nearest stars)

/**
 * Lightweight canvas starfield with gentle depth-based drift (nearer/bigger
 * stars move faster) plus twinkle, to read as slowly moving through space.
 * Density is derived from viewport area so it stays cheap on mobile.
 * Respects prefers-reduced-motion by freezing drift and twinkle.
 */
export function StarField({
  className,
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let animationFrame: number;
    let lastTime = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const driftX = Math.cos(DRIFT_ANGLE) * DRIFT_SPEED;
    const driftY = Math.sin(DRIFT_ANGLE) * DRIFT_SPEED;

    function makeStar(randomizeX = true): Star {
      const depth = Math.random() * 0.8 + 0.2; // 0.2 (far/dim) – 1 (near/bright)
      return {
        x: randomizeX ? Math.random() * width : Math.random() * width,
        y: Math.random() * height,
        radius: depth * 1.7 + 0.3,
        depth,
        baseAlpha: depth * 0.75 + 0.35,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
      };
    }

    function resize() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rawCount = (width * height) / 9000;
      const count = Math.min(
        520,
        Math.max(60, Math.round(rawCount * density))
      );
      stars = Array.from({ length: count }, () => makeStar());
    }

    function draw(time: number) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;

      ctx!.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!reduceMotion && dt > 0) {
          star.x += driftX * star.depth * dt;
          star.y += driftY * star.depth * dt;

          if (star.x < -10) star.x = width + 10;
          if (star.x > width + 10) star.x = -10;
          if (star.y < -10) star.y = height + 10;
          if (star.y > height + 10) star.y = -10;
        }

        const alpha = reduceMotion
          ? star.baseAlpha
          : star.baseAlpha *
            (0.65 + 0.55 * Math.sin(time * star.twinkleSpeed + star.phase));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 1)})`;
        if (star.depth > 0.55) {
          ctx!.shadowBlur = star.radius * 3.5;
          ctx!.shadowColor = `rgba(255, 255, 255, ${Math.min(alpha, 1) * 0.8})`;
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.fill();
      }
      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    animationFrame = requestAnimationFrame(draw);

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
