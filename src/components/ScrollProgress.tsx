import { motion, useScroll, useSpring } from "framer-motion";
import { useLightweightMode } from "@/hooks/use-lightweight-mode";

function AnimatedProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 35, mass: 0.2 });
  return (
    <motion.div
      data-testid="scroll-progress"
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-emerald-500 via-teal-300 to-cyan-400 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
      style={{ scaleX }}
      dir="ltr"
    />
  );
}

/** No scroll observers in lightweight or reduced-motion modes. */
export function ScrollProgress() {
  const { isLightweight } = useLightweightMode();
  return isLightweight ? null : <AnimatedProgress />;
}
