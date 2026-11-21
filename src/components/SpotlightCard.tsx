import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";

interface SpotlightCardProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ id, children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isLightweight } = useLightweightMode();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLightweight || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    // Update 3D tilt with CSS variables, never triggering React renders.
    if (window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) {
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.setProperty("--card-tilt-x", (-relativeY * 7).toFixed(2) + "deg");
      ref.current.style.setProperty("--card-tilt-y", (relativeX * 8).toFixed(2) + "deg");
    }
  };

  const resetTilt = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--card-tilt-x", "0deg");
    ref.current.style.setProperty("--card-tilt-y", "0deg");
  };

  return (
    <div
      id={id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      data-tilt-card="true"
      className={cn(
        "group/spotlight relative overflow-hidden rounded-lg border border-border/60 bg-card/65 backdrop-blur-sm transition-colors hover:border-primary/40",
        className
      )}
    >
      {!isLightweight && (
        <>
          {/* Spotlight surface glow (CSS-variable driven, zero React re-renders) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
            style={{
              background:
                "radial-gradient(560px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), hsl(var(--primary) / 0.14), transparent 42%)",
            }}
          />
          {/* Border glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
            style={{
              background:
                "radial-gradient(280px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), hsl(var(--primary) / 0.32), transparent 45%)",
              mask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
