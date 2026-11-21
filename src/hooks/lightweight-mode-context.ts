import { createContext } from "react";

export interface LightweightModeContextType {
  /** User explicitly enabled lightweight mode. */
  manualLightweight: boolean;
  /** True if either user enabled lightweight mode or OS prefers reduced motion. */
  isLightweight: boolean;
  /** OS prefers-reduced-motion setting. */
  prefersReducedMotion: boolean;
  toggleLightweight: () => void;
  setManualLightweight: (value: boolean) => void;
}

export const LightweightModeContext = createContext<LightweightModeContextType | null>(null);
