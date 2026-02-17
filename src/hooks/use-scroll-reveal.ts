import { useEffect } from "react";
import { useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
    }
  }, [isInView, controls]);

  return { ref, controls };
}
