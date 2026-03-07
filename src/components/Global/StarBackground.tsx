"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  alpha: number;
  // twinkle
  twinklePhase: number;
  twinkleSpeed: number;
  // drift
  driftX: number;
  driftY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  // colour
  hue: number;
  saturation: number;
}

class ShootingStar {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  length = 0;
  alpha = 0;
  life = 0;
  totalDuration = 0;
  active = false;
  startTime = 0;
  lastFired: number;
  interval: number;

  constructor(delay: number = 0) {
    this.lastFired = performance.now() - (4200 - delay);
    this.interval = 5000 + Math.random() * 4000;
    this.reset();
  }

  reset() {
    const startX = Math.random() * 0.75 + 0.05;
    const startY = Math.random() * 0.5;
    const angleDeg = 25 + Math.random() * 25;
    const angle = (angleDeg * Math.PI) / 180;
    const speed = 0.55 + Math.random() * 0.35;

    this.x = startX;
    this.y = startY;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.length = 0.12 + Math.random() * 0.1;
    this.alpha = 0;
    this.life = 0;
    this.totalDuration = 1800 + Math.random() * 600;
  }

  tick(now: number, dt: number) {
    if (!this.active) {
      if (now - this.lastFired > this.interval) {
        this.active = true;
        this.lastFired = now;
        this.startTime = now;
        this.reset();
      }
      return;
    }

    const elapsed = now - this.startTime;
    this.life = Math.min(elapsed / this.totalDuration, 1);

    const fadeEdge = 0.18;
    if (this.life < fadeEdge) {
      this.alpha = this.life / fadeEdge;
    } else if (this.life > 1 - fadeEdge) {
      this.alpha = (1 - this.life) / fadeEdge;
    } else {
      this.alpha = 1;
    }

    const dtSec = dt / 1000;
    this.x += this.vx * dtSec;
    this.y += this.vy * dtSec;

    if (this.life >= 1 || this.x > 1.1 || this.y > 1.1) {
      this.active = false;
      this.interval = 5000 + Math.random() * 4000;
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!this.active || this.alpha <= 0) return;

    const x = this.x * w;
    const y = this.y * h;
    const tailX = x - this.vx * this.length * w * 0.9;
    const tailY = y - this.vy * this.length * w * 0.9;

    const grad = ctx.createLinearGradient(tailX, tailY, x, y);
    grad.addColorStop(0, `rgba(255,255,255,0)`);
    grad.addColorStop(0.6, `rgba(200,230,255,${this.alpha * 0.45})`);
    grad.addColorStop(1, `rgba(255,255,255,${this.alpha})`);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = "lighter";
    ctx.stroke();

    const glow = ctx.createRadialGradient(x, y, 0, x, y, 5);
    glow.addColorStop(0, `rgba(255,255,255,${this.alpha})`);
    glow.addColorStop(1, `rgba(180,220,255,0)`);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.restore();
  }
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width: number;
    let height: number;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ─── Build stars ──────────────────────────────────────────
    const STAR_COUNT = 280;
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const isTinted = Math.random() < 0.18;
      return {
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.25,
        baseAlpha: Math.random() * 0.5 + 0.2,
        alpha: 0,

        // twinkle — independent sin wave per star
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.012 + 0.004,

        // drift — each axis has its own sin wave so the path is a
        // smooth Lissajous-like curve, never a straight line
        driftX: 0,
        driftY: 0,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeedX: Math.random() * 0.0006 + 0.0002,
        driftSpeedY: Math.random() * 0.0006 + 0.0002,
        driftAmpX: Math.random() * 0.006 + 0.002,
        driftAmpY: Math.random() * 0.004 + 0.001,

        // subtle colour tint for ~18% of stars
        hue: isTinted ? (Math.random() < 0.5 ? 210 : 275) : 0,
        saturation: isTinted ? 75 : 0,
      };
    });

    // ─── Shooting stars ───────────────────────────────────────
    const shootingStars: ShootingStar[] = [
      new ShootingStar(0),
      new ShootingStar(2800),
      new ShootingStar(5200),
    ];

    // ─── Render loop ──────────────────────────────────────────
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        // — twinkle —
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
        s.alpha = s.baseAlpha * (0.45 + 0.55 * twinkle);

        // — drift — advance each phase independently
        s.driftPhaseX += s.driftSpeedX;
        s.driftPhaseY += s.driftSpeedY;
        // cos on Y so the two axes are naturally out of phase
        s.driftX = Math.sin(s.driftPhaseX) * s.driftAmpX;
        s.driftY = Math.cos(s.driftPhaseY) * s.driftAmpY;

        const sx = (s.x + s.driftX) * width;
        const sy = (s.y + s.driftY) * height;

        ctx.save();

        // pulsing outer glow for larger stars
        if (s.r > 0.9) {
          const glowR = s.r * (3.5 + 1.5 * twinkle);
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
          glow.addColorStop(
            0,
            `hsla(${s.hue},${s.saturation}%,97%,${s.alpha * 0.55})`,
          );
          glow.addColorStop(1, `hsla(${s.hue},${s.saturation}%,97%,0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // core dot — radius pulses gently with twinkle
        const pulseR = s.r * (0.85 + 0.15 * twinkle);
        ctx.beginPath();
        ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},${s.saturation}%,98%,${s.alpha})`;
        ctx.fill();

        ctx.restore();
      }

      for (const ss of shootingStars) {
        ss.tick(now, dt);
        ss.draw(ctx, width, height);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
