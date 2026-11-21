import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCinematicMotion } from "@/hooks/use-cinematic-motion";

interface StageProps {
  children: ReactNode;
  className?: string;
}

/** Only mounted for fine-pointer desktop with motion enabled. */
function DesktopDepthStage({ children, className = "" }: StageProps) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "start 16%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 155, damping: 32, mass: 0.55 });
  const y = useTransform(smooth, [0, 1], [90, 0]);
  const rotateX = useTransform(smooth, [0, 1], [9, 0]);
  const scale = useTransform(smooth, [0, 1], [0.965, 1]);
  const opacity = useTransform(smooth, [0, 1], [0.5, 1]);

  return (
    <div ref={target} className={"relative depth-stage " + className}>
      <motion.div
        data-depth-mode="3d"
        style={{
          y, rotateX, scale, opacity,
          transformPerspective: 1300,
          transformOrigin: "center top",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Native scrolling stays intact. Desktop uses scroll-scrubbed 3D perspective.
 * Mobile only plays a one-time entrance; lightweight/reduced motion is static.
 * This prevents dozens of continuous scroll subscriptions on touch devices.
 */
export function ScrollStage({ children, className = "" }: StageProps) {
  const { depthEnabled, motionEnabled } = useCinematicMotion();

  if (!motionEnabled) {
    return <div className={"relative depth-stage " + className}><div data-depth-mode="static">{children}</div></div>;
  }

  if (!depthEnabled) {
    return (
      <div className={"relative depth-stage " + className}>
        <motion.div
          data-depth-mode="subtle"
          initial={{ opacity: 0.82, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.52, ease: [0.2, 0.75, 0.15, 1] }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return <DesktopDepthStage className={className}>{children}</DesktopDepthStage>;
}
