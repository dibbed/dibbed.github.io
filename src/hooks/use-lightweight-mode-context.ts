import { useContext } from "react";
import { LightweightModeContext } from "./lightweight-mode-context";

export function useLightweightMode() {
  const ctx = useContext(LightweightModeContext);
  if (!ctx) throw new Error("useLightweightMode must be used within LightweightModeProvider");
  return ctx;
}
