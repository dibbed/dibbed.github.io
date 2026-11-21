import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LightweightModeProvider } from "@/hooks/use-lightweight-mode";
import { useLightweightMode } from "@/hooks/use-lightweight-mode-context";
import { CinematicShowcase } from "@/components/CinematicShowcase";
import { ScrollStage } from "@/components/ScrollStage";
import { ScrollProgress } from "@/components/ScrollProgress";

const originalMatchMedia = window.matchMedia;

function renderShowcase() {
  return render(
    <LightweightModeProvider>
      <LanguageProvider>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <CinematicShowcase />
          <ScrollStage><section>Next editorial section</section></ScrollStage>
          <ScrollProgress />
          <MotionToggle />
        </MemoryRouter>
      </LanguageProvider>
    </LightweightModeProvider>,
  );
}

function MotionToggle() {
  const { toggleLightweight } = useLightweightMode();
  return <button type="button" onClick={toggleLightweight}>Toggle lightweight mode</button>;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => {
  cleanup();
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: originalMatchMedia });
  document.documentElement.classList.remove("lightweight-mode");
});

describe("cinematic scroll chapters without scroll hijacking", () => {
  it("keeps all source-backed projects accessible in normal document flow on touch devices", () => {
    const { container } = renderShowcase();
    const showcase = container.querySelector("#depth-showcase");
    expect(showcase?.getAttribute("data-cinematic-mode")).toBe("accessible");
    const links = Array.from(showcase!.querySelectorAll("a[href]")).map((link) => link.getAttribute("href"));
    expect(links).toEqual([
      "/case-studies/computerpilot-mcp/",
      "/case-studies/tenant-rag/",
      "/case-studies/psychology-atlas/",
    ]);
    expect(screen.getByText("Three systems. Real engineering decisions.")).toBeTruthy();
    expect(container.querySelector('[data-depth-mode="subtle"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="scroll-progress"]')).toBeTruthy();
  });

  it("uses desktop perspective cards and chapter controls only for a fine pointer", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true, writable: true,
      value: (query: string) => ({
        matches: query.includes("min-width: 1024px"),
        media: query,
        addEventListener() {}, removeEventListener() {},
        addListener() {}, removeListener() {},
      }),
    });
    const { container } = renderShowcase();
    expect(container.querySelector("#depth-showcase")?.getAttribute("data-cinematic-mode")).toBe("3d");
    expect(container.querySelectorAll("[data-depth-card]")).toHaveLength(3);
    expect(container.querySelectorAll('[data-depth-card][data-active="true"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-depth-card] a[tabindex="-1"]')).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Show Psychology Atlas" })).toBeTruthy();
    expect(container.querySelector('[data-depth-mode="3d"]')).toBeTruthy();
  });

  it("respects the manual lightweight preference immediately", () => {
    const { container } = renderShowcase();
    fireEvent.click(screen.getByRole("button", { name: "Toggle lightweight mode" }));
    expect(container.querySelector("#depth-showcase")?.getAttribute("data-cinematic-mode")).toBe("accessible");
    expect(container.querySelector('[data-depth-mode="static"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="scroll-progress"]')).toBeNull();
  });

  it("respects OS reduced-motion settings, including a fine pointer device", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true, writable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion") || query.includes("min-width: 1024px"),
        media: query,
        addEventListener() {}, removeEventListener() {},
        addListener() {}, removeListener() {},
      }),
    });
    const { container } = renderShowcase();
    expect(container.querySelector("#depth-showcase")?.getAttribute("data-cinematic-mode")).toBe("accessible");
    expect(container.querySelectorAll("[data-depth-card]")).toHaveLength(0);
    expect(container.querySelector('[data-depth-mode="static"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="scroll-progress"]')).toBeNull();
  });
});
