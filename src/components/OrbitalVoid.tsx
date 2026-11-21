import { useEffect, useRef, useCallback } from "react";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";

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
  const { isLightweight } = useLightweightMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const glowPosRef = useRef({ x: -9999, y: -9999, alpha: 0 });
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
        opacity: Math.random() * 0.3 + 0.18,
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
    let running = false;

    const getPalette = (scrollY: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      const maxScroll = docHeightRef.current - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

      if (isDark) {
        return {
          isDark: true,
          cr: 16,
          cg: Math.round(185 - 20 * progress),
          cb: Math.round(129 + 56 * progress),
          glowOpacity: 0.12,
          lineAlphaBase: 0.12,
        };
      }
      return {
        isDark: false,
        cr: 7,
        cg: Math.round(115 - 10 * progress),
        cb: Math.round(81 + 24 * progress),
        glowOpacity: 0.1,
        lineAlphaBase: 0.09,
      };
    };

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const { cr, cg, cb, lineAlphaBase } = getPalette(window.scrollY);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * lineAlphaBase * 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const renderR = p.r * (0.5 + p.depth * 0.5);
        const renderOpacity = p.opacity * (0.4 + p.depth * 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, renderR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${renderOpacity})`;
        ctx.fill();
      }
    };

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
      if (isLightweight) {
        drawStaticFrame();
      }
    };

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    // Lightweight / prefers-reduced-motion mode: static frame only, zero rAF loop.
    if (isLightweight) {
      const themeObserver = new MutationObserver(() => drawStaticFrame());
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      window.addEventListener("resize", onResize);
      return () => {
        clearTimeout(resizeTimer);
        themeObserver.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }

    const onMouseMove = (e: MouseEvent) => {
      const wasActive = mouseRef.current.active;
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (!wasActive) {
        glowPosRef.current.x = e.clientX;
        glowPosRef.current.y = e.clientY;
      }
    };

    const deactivatePointer = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
      docHeightRef.current = document.documentElement.scrollHeight;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const wasActive = mouseRef.current.active;
        mouseRef.current = { x: touch.clientX, y: touch.clientY, active: true };
        if (!wasActive) {
          glowPosRef.current.x = touch.clientX;
          glowPosRef.current.y = touch.clientY;
        }
      }
    };

    const spawnBurst = (cx: number, cy: number) => {
      const count = 12 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2.6 + Math.random() * 3.8;
        burstRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.0 + Math.random() * 1.4,
          life: 70,
          maxLife: 70,
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      spawnBurst(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        spawnBurst(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 190;
    const MOUSE_CONNECT_DIST = 175;
    const REPULSE_FORCE = 0.48;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const pointer = mouseRef.current;
      const glow = glowPosRef.current;
      const scrollY = scrollRef.current;
      const { isDark, cr, cg, cb, glowOpacity, lineAlphaBase } = getPalette(scrollY);

      // Smooth cursor glow interpolation
      if (pointer.active) {
        glow.x += (pointer.x - glow.x) * 0.16;
        glow.y += (pointer.y - glow.y) * 0.16;
        glow.alpha = Math.min(1, glow.alpha + 0.08);
      } else {
        glow.alpha = Math.max(0, glow.alpha - 0.05);
      }

      // Live ambient cursor glow halo
      if (glow.alpha > 0.01) {
        const haloRadius = isDark ? 360 : 300;
        const haloStrength = isDark ? 0.16 : 0.11;
        const cursorGrad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, haloRadius);
        cursorGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${haloStrength * glow.alpha})`);
        cursorGrad.addColorStop(0.35, `rgba(${cr}, ${cg}, ${cb}, ${haloStrength * 0.45 * glow.alpha})`);
        cursorGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = cursorGrad;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update particle positions
      for (const p of particles) {
        const renderY = p.y - scrollY * (1 - p.depth) * 0.15;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = renderY - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * REPULSE_FORCE;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Gentle drift floor so particles stay subtly alive
        p.vx *= 0.975;
        p.vy *= 0.975;
        if (Math.abs(p.vx) < 0.06) p.vx += (Math.random() - 0.5) * 0.015;
        if (Math.abs(p.vy) < 0.06) p.vy += (Math.random() - 0.5) * 0.015;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ay = a.y - scrollY * (1 - a.depth) * 0.15;

        // Soft illumination line from cursor to nearby particles
        if (pointer.active) {
          const mdx = a.x - glow.x;
          const mdy = ay - glow.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < MOUSE_CONNECT_DIST) {
            const mAlpha = (1 - mDist / MOUSE_CONNECT_DIST) * (isDark ? 0.24 : 0.16) * glow.alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(glow.x, glow.y);
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${mAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const by = b.y - scrollY * (1 - b.depth) * 0.15;
          const dx = a.x - b.x;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            let alpha = (1 - dist / CONNECTION_DIST) * lineAlphaBase;
            if (pointer.active) {
              const midX = (a.x + b.x) * 0.5;
              const midY = (ay + by) * 0.5;
              const cursorDist = Math.hypot(midX - glow.x, midY - glow.y);
              if (cursorDist < 220) {
                alpha *= 1 + (1 - cursorDist / 220) * 1.4;
              }
            }
            ctx.beginPath();
            ctx.moveTo(a.x, ay);
            ctx.lineTo(b.x, by);
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      // Draw particles with proximity glow
      for (const p of particles) {
        const renderY = p.y - scrollY * (1 - p.depth) * 0.15;
        let boost = 0;
        if (pointer.active) {
          const distToCursor = Math.hypot(p.x - glow.x, renderY - glow.y);
          if (distToCursor < 220) {
            boost = (1 - distToCursor / 220) * glow.alpha;
          }
        }

        const renderR = p.r * (0.5 + p.depth * 0.5) + boost * 1.1;
        const renderOpacity = Math.min(0.95, p.opacity * (0.45 + p.depth * 0.55) + boost * 0.45);

        if (p.depth > 0.65 || boost > 0.2) {
          const glowR = renderR * (4 + boost * 2.5);
          const grad = ctx.createRadialGradient(p.x, renderY, 0, p.x, renderY, glowR);
          grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${glowOpacity + boost * 0.16})`);
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

    const startLoop = () => {
      if (running || document.hidden) return;
      running = true;
      rafRef.current = requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", deactivatePointer, { passive: true });
    window.addEventListener("blur", deactivatePointer);
    document.addEventListener("mouseleave", deactivatePointer);
    document.addEventListener("visibilitychange", onVisibilityChange);

    startLoop();

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", deactivatePointer);
      window.removeEventListener("blur", deactivatePointer);
      document.removeEventListener("mouseleave", deactivatePointer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [createParticles, isLightweight]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, hsl(var(--background) / 0.85) 100%)",
        }}
      />
    </>
  );
}
