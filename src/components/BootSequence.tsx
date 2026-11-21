import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const CORE_PLACEHOLDER = "__SITE_HOST__";
const BOOT_LINES = [
  { text: "[BIOS] POST check .............. OK", delay: 0 },
  { text: "[KERNEL] Loading modules ........ OK", delay: 110 },
  { text: "[SYS] Initializing runtime ...... OK", delay: 220 },
  { text: "[NET] Establishing secure conn .. OK", delay: 340 },
  { text: "[AUTH] Verifying credentials ..... OK", delay: 460 },
  { text: "[DB] Mounting data stores ....... OK", delay: 580 },
  { text: "[GPU] Rendering pipeline ........ OK", delay: 700 },
  { text: `[CORE] ${CORE_PLACEHOLDER} v3.0.1 ... READY`, delay: 840 },
  { text: "", delay: 1000 },
  { text: "> ACCESS GRANTED", delay: 1100 },
];

function getCoreLineText(): string {
  const host = typeof window !== "undefined" ? window.location.host : "...";
  return BOOT_LINES[7].text.replace(CORE_PLACEHOLDER, host);
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage();
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coreText = getCoreLineText();

  const finish = useCallback(
    (immediate = false) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setDone(true);
      if (immediate) {
        onComplete();
        return;
      }
      exitTimerRef.current = setTimeout(onComplete, 420);
    },
    [onComplete]
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    timers.push(setTimeout(() => finish(false), 1650));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      timers.forEach(clearTimeout);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={() => finish(true)}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-background"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio boot sequence"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finish(true);
            }}
            className="absolute right-5 top-5 z-20 rounded-md border border-border/60 bg-card/80 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t(translations.boot.skip)}
          </button>

          <div className="w-full max-w-lg px-6" dir="ltr">
            {/* Scanline overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--foreground)/0.03)_2px,hsl(var(--foreground)/0.03)_4px)]"
            />

            <div className="space-y-1 text-left">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
                const displayText = i === 7 ? coreText : line.text;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.14 }}
                    className={`font-mono text-xs ${
                      displayText.includes("GRANTED")
                        ? "mt-2 text-sm font-bold text-primary"
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
                <span className="inline-block h-4 w-2 animate-blink-cursor bg-primary" />
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-px w-full overflow-hidden rounded bg-border/50">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min((visibleLines / BOOT_LINES.length) * 100, 100)}%` }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
