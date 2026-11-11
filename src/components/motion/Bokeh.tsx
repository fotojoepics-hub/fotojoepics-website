import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { cn, MEDIA } from '../../lib/motion';

// Soft, out-of-focus lights from Joe's original business card: blue, orange and gold.
const COLORS = ['61,107,255', '240,138,36', '194,160,89', '217,192,138', '72,150,170'];

type Particle = { x: number; y: number; r: number; a: number; c: number; vx: number; vy: number; depth: number; phase: number };

type Props = {
  className?: string;
  /** 1 = default amount of lights */
  density?: number;
  /** overall brightness, 0..1 */
  intensity?: number;
  /** lights drift toward the cursor (desktop only) */
  interactive?: boolean;
};

/** Drifting bokeh lights on a canvas. Pauses off-screen and in background tabs,
 *  holds still for reduced-motion, and uses fewer lights on phones. */
export function Bokeh({ className, density = 1, intensity = 1, interactive = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia(MEDIA.reduce).matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const sprites = COLORS.map((c) => {
      const s = document.createElement('canvas');
      s.width = s.height = 128;
      const g = s.getContext('2d')!;
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, `rgba(${c},0.95)`);
      grd.addColorStop(0.5, `rgba(${c},0.55)`);
      grd.addColorStop(0.78, `rgba(${c},0.16)`);
      grd.addColorStop(1, `rgba(${c},0)`);
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
      return s;
    });

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let t = 0;

    const seed = () => {
      const small = w < 700;
      const n = Math.max(4, Math.round((small ? 8 : 15) * density));
      particles = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (small ? 34 : 54) + Math.random() * (small ? 70 : 130),
        a: (0.09 + Math.random() * 0.2) * intensity,
        c: i % COLORS.length,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.04 - Math.random() * 0.14,
        depth: 0.3 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      for (const p of particles) {
        const pulse = 0.72 + 0.28 * Math.sin(t * 0.55 + p.phase);
        ctx.globalAlpha = p.a * pulse;
        const d = p.r * 2;
        ctx.drawImage(sprites[p.c], p.x - p.r + mx * 46 * p.depth, p.y - p.r + my * 30 * p.depth, d, d);
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      t += 1 / 60;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy * p.depth;
        if (p.y < -p.r * 2) {
          p.y = h + p.r;
          p.x = Math.random() * w;
        }
        if (p.x < -p.r * 2) p.x = w + p.r;
        else if (p.x > w + p.r * 2) p.x = -p.r;
      }
      draw();
    };

    resize();
    draw();
    if (reduce) {
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    let visible = false;
    let running = false;
    const sync = () => {
      const should = visible && !document.hidden;
      if (should && !running) gsap.ticker.add(step);
      if (!should && running) gsap.ticker.remove(step);
      running = should;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    const onPointer = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    if (interactive && fine) window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      gsap.ticker.remove(step);
    };
  }, [density, intensity, interactive]);

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} />;
}
