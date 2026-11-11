import { useRef } from 'react';
import { INK } from '../brand/ink';
import { SIGNATURE_HEIGHT, SIGNATURE_WIDTH } from '../brand/signature';
import { INTRO_FRAMES } from '../content/photos';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { markIntroDone } from '../lib/intro';
import { useLenis } from '../lib/smooth-scroll';
import { CameraIcon, Signature } from './Brand';
import { photoSrc } from './Photo';

// Loaded only when the intro actually plays (first homepage visit per session).
export default function IntroPlayer({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useGSAP(
    () => {
      const html = document.documentElement;
      clearTimeout((window as unknown as { __fjSafety?: number }).__fjSafety);
      html.classList.add('intro-playing', 'intro-hold');
      html.classList.remove('intro');
      try {
        sessionStorage.setItem('fj-intro', '1');
      } catch {
        /* private mode: the intro may replay, which is fine */
      }

      const el = root.current!;
      const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T & Element>(s)!;
      const bg = q('[data-bg]');
      const stage = q('[data-stage]');
      const canvas = q<HTMLCanvasElement>('canvas');
      const vector = q('[data-vector]');
      const nib = q('[data-nib]');
      const flash = q('[data-flash]');
      const cameraParts = el.querySelectorAll('[data-camera] rect, [data-camera] path, [data-camera] circle');
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', el);
      const camera = q('[data-camera]');
      gsap.set(cameraParts, { strokeDashoffset: 1 });

      // Size the writing area to the screen
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const boxW = Math.min(vw * (vw < 700 ? 0.84 : 0.56), 820);
      const k = boxW / SIGNATURE_WIDTH;
      const boxH = SIGNATURE_HEIGHT * k;
      gsap.set(stage, { width: boxW, height: boxH });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(boxW * dpr);
      canvas.height = Math.round(boxH * dpr);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#C2A059';

      // Pen: stamp the traced stroke points up to the current moment
      const total = INK.length / 4;
      let drawn = 0;
      const pen = { p: 0 };
      const paint = () => {
        while (drawn < total && INK[drawn * 4 + 3] <= pen.p) {
          const o = drawn * 4;
          ctx.beginPath();
          ctx.arc(INK[o] * k, INK[o + 1] * k, Math.max(INK[o + 2] * k * 0.78, 0.9), 0, Math.PI * 2);
          ctx.fill();
          drawn++;
        }
        if (drawn) gsap.set(nib, { x: INK[(drawn - 1) * 4] * k, y: INK[(drawn - 1) * 4 + 1] * k });
      };

      // Where the signature lands: the header logo
      const toLogo = () => {
        const logo = document.querySelector('[data-logo] svg');
        const s = stage.getBoundingClientRect();
        if (!logo) return { x: 0, y: -vh * 0.4, scale: 0.15 };
        const l = logo.getBoundingClientRect();
        return {
          x: l.left + l.width / 2 - (s.left + s.width / 2),
          y: l.top + l.height / 2 - (s.top + s.height / 2),
          scale: l.width / s.width,
        };
      };
      let flight = { x: 0, y: 0, scale: 1 };
      const reach = Math.max(vw, vh) * 0.78;
      const headerItems = '[data-intro-item]';

      const finish = () => {
        html.classList.remove('intro-playing', 'intro-hold');
        gsap.set(['[data-logo]', headerItems], { clearProps: 'opacity,transform' });
        lenisRef.current?.start();
        markIntroDone();
        ScrollTrigger.refresh();
        onDone();
      };

      const tl = gsap.timeline({ onComplete: finish });
      tl.set(nib, { opacity: 1 })
        .to(pen, { p: 1, duration: 1.3, ease: 'power1.inOut', onUpdate: paint })
        .to(nib, { opacity: 0, duration: 0.2 })
        .to(vector, { opacity: 1, duration: 0.3 }, '-=0.25')
        .to(canvas, { opacity: 0, duration: 0.3 }, '<')
        .set(camera, { opacity: 1 }, '-=0.2')
        .fromTo(cameraParts, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'power2.out', stagger: 0.05 }, '<')
        .to(flash, { opacity: 0.18, duration: 0.05 })
        .to(flash, { opacity: 0, duration: 0.4 })
        .addLabel('burst', '-=0.3')
        .add(() => {
          flight = toLogo();
        }, 'burst')
        .to(stage, { x: () => flight.x, y: () => flight.y, scale: () => flight.scale, duration: 0.95, ease: 'expo.inOut' }, 'burst')
        .to(cards, { opacity: 1, duration: 0.12, stagger: 0.025 }, 'burst+=0.05')
        .to(
          cards,
          {
            x: (i: number) => Math.cos((i / cards.length) * Math.PI * 2 - Math.PI / 2 + 0.35) * reach,
            y: (i: number) => Math.sin((i / cards.length) * Math.PI * 2 - Math.PI / 2 + 0.35) * reach * 0.72,
            rotation: (i: number) => (i % 2 ? 1 : -1) * (8 + (i % 3) * 5),
            scale: 1.15,
            duration: 1.05,
            ease: 'expo.out',
            stagger: 0.025,
          },
          'burst+=0.05',
        )
        .to(cards, { opacity: 0, duration: 0.35 }, 'burst+=0.6')
        .to(bg, { opacity: 0, duration: 0.75, ease: 'power2.inOut' }, 'burst+=0.25')
        .add(() => {
          html.classList.remove('intro-hold');
          markIntroDone();
        }, 'burst+=0.3')
        .fromTo(headerItems, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }, 'burst+=0.55')
        .set('[data-logo]', { opacity: 1 }, 'burst+=0.9')
        .to(stage, { opacity: 0, duration: 0.15 }, 'burst+=0.9');

      // Any intent to move on fast-forwards the rest
      const skip = () => tl.timeScale(6);
      const opts = { passive: true } as const;
      window.addEventListener('pointerdown', skip, opts);
      window.addEventListener('wheel', skip, opts);
      window.addEventListener('touchmove', skip, opts);
      window.addEventListener('keydown', skip);
      return () => {
        window.removeEventListener('pointerdown', skip);
        window.removeEventListener('wheel', skip);
        window.removeEventListener('touchmove', skip);
        window.removeEventListener('keydown', skip);
        html.classList.remove('intro-playing', 'intro-hold');
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-[95] overflow-hidden">
      <p className="sr-only">Foto Joe — J.L. Robinson Imaging</p>
      <div data-bg="" className="absolute inset-0 bg-ink-deep" />
      <div className="absolute inset-0 grid place-items-center">
        {INTRO_FRAMES.map((name) => (
          <img
            key={name}
            data-card=""
            src={photoSrc(name, 480)}
            alt=""
            className="absolute aspect-[4/5] w-[30vw] rounded-[2px] object-cover opacity-0 shadow-2xl shadow-black md:w-[13vw]"
            style={{ transform: 'scale(0.35)' }}
          />
        ))}
        <div data-stage="" className="relative origin-center">
          <canvas className="absolute inset-0 h-full w-full" />
          <span data-vector="" className="absolute inset-0 opacity-0">
            <Signature className="h-full w-full text-brass" />
          </span>
          <span data-camera="" className="absolute -right-[9%] bottom-[8%] w-[9%] text-brass opacity-0">
            <CameraIcon drawable strokeWidth={2.6} />
          </span>
          <span
            data-nib=""
            className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-light opacity-0 shadow-[0_0_18px_6px_rgba(217,192,138,0.55)]"
          />
        </div>
      </div>
      <div data-flash="" className="pointer-events-none absolute inset-0 bg-paper opacity-0" />
      <button
        type="button"
        className="absolute right-4 bottom-4 rounded-full px-4 py-3 text-[0.7rem] font-semibold tracking-[0.2em] text-mist uppercase hover:text-paper md:right-8 md:bottom-8"
      >
        Skip intro
      </button>
    </div>
  );
}
