import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isLightweight } = useLightweightMode();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLightweight || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
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
