import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  depth: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
}

export function OrbitalVoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const burstRef = useRef<BurstParticle[]>([]);
  const rafRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const docHeightRef = useRef(0);

  const createParticles = useCallback((w: number, h: number) => {
    const area = w * h;
    const count = Math.max(30, Math.min(80, Math.floor(area / 18000)));
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const isHero = Math.random() < 0.15;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: isHero ? Math.random() * 1.0 + 1.8 : Math.random() * 1.2 + 0.6,
        opacity: Math.random() * 0.3 + 0.15,
        depth: Math.random() * 0.7 + 0.3,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(w, h);
      docHeightRef.current = document.documentElement.scrollHeight;
    };

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const spawnBurst = (cx: number, cy: number) => {
      const count = 12 + Math.floor(Math.random() * 7);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 4;
        burstRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.0 + Math.random() * 1.5,
          life: 80,
          maxLife: 80,
        });
      }
    };

    const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        spawnBurst(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 180;
    const REPULSE_FORCE = 0.5;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scrollY = scrollRef.current;

      // Theme detection
      const isDark = document.documentElement.classList.contains("dark");

      // Scroll-triggered color shift
      const maxScroll = docHeightRef.current - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

      let cr: number, cg: number, cb: number;
      if (isDark) {
        cr = 16;
        cg = Math.round(185 - 20 * progress);
        cb = Math.round(129 + 56 * progress);
      } else {
        cr = 16;
        cg = Math.round(120 - 10 * progress);
        cb = Math.round(90 + 30 * progress);
      }

      const glowOpacity = isDark ? 0.08 : 0.12;
      const lineAlphaBase = isDark ? 0.1 : 0.08;

      // Update positions
      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * REPULSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ay = a.y - scrollY * (1 - a.depth) * 0.15;
          const by = b.y - scrollY * (1 - b.depth) * 0.15;
          const dx = a.x - b.x;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * lineAlphaBase;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const renderY = p.y - scrollY * (1 - p.depth) * 0.15;
        const renderR = p.r * (0.5 + p.depth * 0.5);
        const renderOpacity = p.opacity * (0.4 + p.depth * 0.6);

        // Depth-of-field glow for close particles
        if (p.depth > 0.7) {
          const glowR = renderR * 4;
          const grad = ctx.createRadialGradient(p.x, renderY, 0, p.x, renderY, glowR);
          grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${glowOpacity})`);
          grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, renderY, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, renderY, renderR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${renderOpacity})`;
        ctx.fill();
      }

      // Burst particles
      const bursts = burstRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const bp = bursts[i];
        bp.vx *= 0.96;
        bp.vy *= 0.96;
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.life--;

        if (bp.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        const t = bp.life / bp.maxLife;
        const bopacity = t * 0.8;

        // Glow for burst particles
        const burstGlowR = bp.r * 3;
        const bGrad = ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, burstGlowR);
        bGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${bopacity * 0.5})`);
        bGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, burstGlowR, 0, Math.PI * 2);
        ctx.fillStyle = bGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${bopacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [createParticles]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-auto"
        style={{ zIndex: 0 }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, hsl(var(--background)) 100%)",
        }}
      />
    </>
  );
}
