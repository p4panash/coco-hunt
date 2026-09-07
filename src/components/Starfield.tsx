import { useEffect, useRef } from "react";

/**
 * Fixed, full-viewport night sky behind everything. Twinkling dots on a
 * <canvas>. Purely atmospheric — no meaning, no spoilers. Respects
 * prefers-reduced-motion (renders a still field).
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let W = 0;
    let H = 0;
    let stars: { x: number; y: number; r: number; tw: number; sp: number }[] = [];

    const paint = (twinkle: boolean) => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        if (twinkle) s.tw += s.sp;
        const a = twinkle ? 0.5 + Math.sin(s.tw) * 0.4 : 0.7;
        ctx.globalAlpha = a < 0 ? 0 : a;
        ctx.fillStyle = "#dfe6ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      paint(true);
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((W * H) / 6000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.004,
      }));
      if (reduce) paint(false);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden />;
}
