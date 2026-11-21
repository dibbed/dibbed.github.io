import { describe, expect, it, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { LightweightModeProvider } from "@/hooks/use-lightweight-mode";
import { projects } from "@/data/resume-data";
import { caseStudies, caseStudyForSlug, caseStudyUrl, evidenceUrl } from "@/data/case-studies";
import CaseStudyPage from "@/pages/CaseStudy";
import { HiringTrail } from "@/components/HiringTrail";

afterEach(() => cleanup());

function renderCase(slug: string) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark">
      <LightweightModeProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={[caseStudyUrl(slug)]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
      </LightweightModeProvider>
    </ThemeProvider>,
  );
}

describe("source-backed flagship case studies", () => {
  it("keeps one complete, shareable case for each featured source project", () => {
    expect(caseStudies.map((study) => study.projectName)).toEqual(
      projects.filter((project) => project.featured).map((project) => project.name),
    );
    expect(new Set(caseStudies.map((item) => item.slug)).size).toBe(3);
    for (const study of caseStudies) {
      expect(study.challenge.en.length).toBeGreaterThan(100);
      expect(study.challenge.fa.length).toBeGreaterThan(100);
      expect(study.implementation.en.length).toBeGreaterThan(100);
      expect(study.decisions).toHaveLength(3);
      expect(study.evidence.length).toBeGreaterThanOrEqual(4);
      expect(study.flow.length).toBeGreaterThanOrEqual(5);
      expect(study.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
      for (const entry of study.evidence) {
        expect(evidenceUrl(study, entry.path)).toMatch(
          /^https:\/\/github\.com\/dibbed\/[a-z-]+\/blob\/[0-9a-f]{40}\/[\w./-]+$/,
        );
      }
    }
  });

  it("does not present the psychology atlas as open-source clinical software", () => {
    const study = caseStudyForSlug("psychology-atlas")!;
    expect(study.honestLimit.en).toMatch(/educational/i);
    expect(study.honestLimit.en).toMatch(/not a diagnostic/i);
    expect(study.honestLimit.en).toMatch(/no general open-source license/i);
    expect(study.stats.map((stat) => stat.value)).toEqual(["87", "70", "5"]);
    expect(study.evidence.some((source) => source.kind === "rights")).toBe(true);
  });

  it("renders the engineering decisions and their actual code evidence", () => {
    renderCase("tenant-rag");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Retrieval boundaries matter more than a clever answer.",
    );
    expect(screen.getByRole("heading", { name: "Engineering decisions" })).toBeTruthy();
    const links = screen.getAllByRole("link");
    expect(links.some((link) => link.getAttribute("href")?.endsWith("/tests/integration/test_multi_tenant_isolation.py"))).toBe(true);
    expect(links.some((link) => link.getAttribute("href")?.endsWith("/tests/security/test_phase2_ssrf_protection.py"))).toBe(true);
  });

  it("supports Persian and conserves the evidence without generic placeholder content", () => {
    renderCase("computerpilot-mcp");
    fireEvent.click(screen.getByRole("button", { name: "تغییر زبان به فارسی" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "اتوماسیونی که می‌داند چه زمانی نباید دوباره اجرا شود.",
    );
    expect(screen.getByText(/عملیات تغییردهنده نامطمئن/)).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /مشاهده پیاده‌سازی/ }).length).toBeGreaterThan(0);
  });

  it("adds a mobile reading index with deep links to the engineering evidence", () => {
    renderCase("computerpilot-mcp");
    const nav = screen.getByRole("navigation", { name: /Case study sections|فهرست بخش‌های نمونه‌کار/ });
    const anchors = Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(anchors).toEqual(["#case-architecture", "#case-decisions", "#case-evidence", "#case-constraints"]);
    for (const anchor of anchors) {
      expect(document.querySelector(anchor!)).toBeTruthy();
    }
  });

  it("makes the short hiring route navigate to each real case study", () => {
    render(
      <LanguageProvider>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <HiringTrail />
        </MemoryRouter>
      </LanguageProvider>,
    );
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/case-studies/computerpilot-mcp/");
    expect(hrefs).toContain("/case-studies/tenant-rag/#case-evidence");
    expect(hrefs).toContain("/case-studies/psychology-atlas/");
  });
});
