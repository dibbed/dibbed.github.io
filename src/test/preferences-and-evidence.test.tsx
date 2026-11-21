import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { LightweightModeProvider, useLightweightMode } from "@/hooks/use-lightweight-mode";
import { getBasePath, getResumeUrl } from "@/lib/utils";
import { projects } from "@/data/resume-data";

function LanguageProbe() {
  const { lang, toggleLang } = useLanguage();
  return (
    <div>
      <output data-testid="language">{lang}</output>
      <button onClick={toggleLang}>Switch language</button>
    </div>
  );
}

function MotionProbe() {
  const { isLightweight, toggleLightweight } = useLightweightMode();
  return (
    <div>
      <output data-testid="motion">{isLightweight ? "lite" : "full"}</output>
      <button onClick={toggleLightweight}>Toggle motion</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.documentElement.classList.remove("lightweight-mode");
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});
afterEach(() => cleanup());

describe("saved user preferences", () => {
  it("remembers Persian, including the document direction after remount", () => {
    const view = render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
    expect(screen.getByTestId("language").textContent).toBe("fa");
    expect(localStorage.getItem("portfolio-lang")).toBe("fa");
    expect(document.documentElement.dir).toBe("rtl");
    view.unmount();
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("language").textContent).toBe("fa");
    expect(document.documentElement.lang).toBe("fa");
  });

  it("remembers manual lightweight mode on reload", () => {
    const view = render(
      <LightweightModeProvider>
        <MotionProbe />
      </LightweightModeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle motion" }));
    expect(screen.getByTestId("motion").textContent).toBe("lite");
    expect(localStorage.getItem("portfolio-lightweight")).toBe("true");
    expect(document.documentElement.classList.contains("lightweight-mode")).toBe(true);
    view.unmount();
    render(
      <LightweightModeProvider>
        <MotionProbe />
      </LightweightModeProvider>
    );
    expect(screen.getByTestId("motion").textContent).toBe("lite");
  });
});

describe("routing and evidence links", () => {
  it("keeps the root GitHub Pages deployment route stable", () => {
    expect(getBasePath("/")).toBe("");
    expect(getBasePath("/demo-project/")).toBe("/demo-project");
    expect(getResumeUrl("/")).toMatch(/\/resume\.pdf$/);
    expect(getResumeUrl("/demo-project/")).toMatch(/\/demo-project\/resume\.pdf$/);
  });

  it("links each flagship engineering note to actual repository file paths", () => {
    const featured = projects.filter((project) => project.featured);
    expect(featured).toHaveLength(3);
    for (const project of featured) {
      expect(project.caseStudy?.problem).toBeTruthy();
      expect(project.caseStudy?.problemFa).toBeTruthy();
      expect(project.caseStudy?.evidence.length).toBeGreaterThanOrEqual(2);
      for (const evidence of project.caseStudy!.evidence) {
        expect(evidence.url).toMatch(/^https:\/\/github\.com\/dibbed\/[\w.-]+\/blob\/main\/.+$/);
      }
    }
  });

  it("does not advertise the non-existent diagnostic or tenant-test command", () => {
    const previews = projects.map((p) => p.terminalPreview?.command ?? "").join(" | ");
    expect(previews).not.toContain("computerpilot.doctor --capabilities");
    expect(previews).not.toContain("tests/test_tenant_isolation.py");
    expect(previews).toContain("scripts/doctor.py --check");
    expect(previews).toContain("tests/integration/test_multi_tenant_isolation.py");
  });
});
