import { useEffect, useState } from "react";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";

function matchesDesktop(): boolean {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(min-width: 1024px) and (min-height: 720px) and (pointer: fine)").matches;
}

/** 3D depth only on fine-pointer desktop devices, never with reduced motion. */
export function useCinematicMotion() {
  const { isLightweight } = useLightweightMode();
  const [desktop, setDesktop] = useState(matchesDesktop);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 720px) and (pointer: fine)");
    const onChange = () => setDesktop(media.matches);
    media.addEventListener("change", onChange);
    onChange();
    return () => media.removeEventListener("change", onChange);
  }, []);

  return {
    depthEnabled: desktop && !isLightweight,
    motionEnabled: !isLightweight,
  };
}
