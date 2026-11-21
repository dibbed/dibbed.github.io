import { useCallback, useEffect, useState, type ReactNode } from "react";
import { LightweightModeContext } from "./lightweight-mode-context";

const STORAGE_KEY = "portfolio-lightweight";


function readSavedLightweight(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function readReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LightweightModeProvider({ children }: { children: ReactNode }) {
  const [manualLightweight, setManualLightweightState] = useState<boolean>(readSavedLightweight);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(readReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    setPrefersReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const isLightweight = manualLightweight || prefersReducedMotion;

  useEffect(() => {
    document.documentElement.classList.toggle("lightweight-mode", isLightweight);
  }, [isLightweight]);

  const setManualLightweight = useCallback((value: boolean) => {
    setManualLightweightState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Ignore storage write errors.
    }
  }, []);

  const toggleLightweight = useCallback(() => {
    setManualLightweightState((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore storage write errors.
      }
      return next;
    });
  }, []);

  return (
    <LightweightModeContext.Provider
      value={{
        manualLightweight,
        isLightweight,
        prefersReducedMotion,
        toggleLightweight,
        setManualLightweight,
      }}
    >
      {children}
    </LightweightModeContext.Provider>
  );
}
