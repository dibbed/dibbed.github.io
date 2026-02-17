import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

function parseValue(value: string): { prefix: string; number: number; suffix: string; isRange: boolean; decimals: number } {
  // Handle ranges like "~500-800"
  if (/\d+-\d+/.test(value)) {
    return { prefix: "", number: 0, suffix: "", isRange: true, decimals: 0 };
  }

  const match = value.match(/^([~]?)(\d+\.?\d*)(.*)/);
  if (!match) return { prefix: "", number: 0, suffix: value, isRange: true, decimals: 0 };

  const numStr = match[2];
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  return {
    prefix: match[1],
    number: parseFloat(match[2]),
    suffix: match[3],
    isRange: false,
    decimals,
  };
}

export function CountUp({ value, className = "", duration = 2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");
  const parsed = useRef(parseValue(value));

  useEffect(() => {
    if (!isInView || parsed.current.isRange) return;

    const target = parsed.current.number;
    const decimals = parsed.current.decimals;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString());

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, duration]);

  if (parsed.current.isRange) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className={className}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {parsed.current.prefix}
      {isInView ? display : "0"}
      {parsed.current.suffix}
    </span>
  );
}
