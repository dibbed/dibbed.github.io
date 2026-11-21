import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LightweightModeProvider } from "@/hooks/use-lightweight-mode";
import { OrbitalVoid } from "@/components/OrbitalVoid";
import { getBasePath } from "@/lib/utils";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <LightweightModeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <OrbitalVoid />
          <Toaster />
          <Sonner />
          <BrowserRouter basename={getBasePath() || "/"}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </LightweightModeProvider>
  </ThemeProvider>
);

export default App;
