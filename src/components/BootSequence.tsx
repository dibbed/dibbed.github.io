import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CORE_PLACEHOLDER = "__SITE_HOST__";
const BOOT_LINES = [
  { text: "[BIOS] POST check .............. OK", delay: 0 },
  { text: "[KERNEL] Loading modules ........ OK", delay: 150 },
  { text: "[SYS] Initializing runtime ...... OK", delay: 300 },
  { text: "[NET] Establishing secure conn .. OK", delay: 500 },
  { text: "[AUTH] Verifying credentials ..... OK", delay: 650 },
  { text: "[DB] Mounting data stores ....... OK", delay: 800 },
  { text: "[GPU] Rendering pipeline ........ OK", delay: 950 },
  { text: `[CORE] ${CORE_PLACEHOLDER} v3.0.1 ... READY`, delay: 1150 },
  { text: "", delay: 1400 },
  { text: "> ACCESS GRANTED", delay: 1500 },
];

function getCoreLineText(): string {
  const host = typeof window !== "undefined" ? window.location.host : "...";
  return BOOT_LINES[7].text.replace(CORE_PLACEHOLDER, host);
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);
  const coreText = getCoreLineText();

  const finish = useCallback(() => {
    setDone(true);
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });

    timers.push(setTimeout(finish, 2200));

    return () => timers.forEach(clearTimeout);
  }, [finish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="w-full max-w-lg px-6">
            {/* Scanline overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--foreground)/0.03)_2px,hsl(var(--foreground)/0.03)_4px)]" />

            <div className="space-y-1">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
                const displayText = i === 7 ? coreText : line.text;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`font-mono text-xs ${
                      displayText.includes("GRANTED")
                        ? "text-primary font-bold text-sm mt-2"
                        : displayText.includes("READY")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {displayText}
                  </motion.div>
                );
              })}

              {visibleLines < BOOT_LINES.length && (
                <span className="inline-block w-2 h-4 bg-primary animate-blink-cursor" />
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-px w-full overflow-hidden rounded bg-border/50">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min((visibleLines / BOOT_LINES.length) * 100, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
