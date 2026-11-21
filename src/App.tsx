import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LightweightModeProvider } from "@/hooks/use-lightweight-mode";
import { OrbitalVoid } from "@/components/OrbitalVoid";
import { getBasePath } from "@/lib/utils";
import { MotionConfig } from "framer-motion";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";
import { lazy, Suspense, type ReactNode } from "react";
import Index from "./pages/Index";
const CaseStudyPage = lazy(() => import("./pages/CaseStudy"));
const NotFound = lazy(() => import("./pages/NotFound"));

function MotionPreferences({ children }: { children: ReactNode }) {
  const { isLightweight } = useLightweightMode();
  return <MotionConfig reducedMotion={isLightweight ? "always" : "user"}>{children}</MotionConfig>;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <LightweightModeProvider>
      <MotionPreferences>
        <LanguageProvider>
          <OrbitalVoid />
          <Sonner />
          <BrowserRouter basename={getBasePath() || "/"} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/case-studies/:slug" element={<Suspense fallback={<div role="status" className="min-h-screen pt-24 text-center font-mono text-sm text-muted-foreground">Loading case study…</div>}><CaseStudyPage /></Suspense>} />
              <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </MotionPreferences>
    </LightweightModeProvider>
  </ThemeProvider>
);

export default App;
