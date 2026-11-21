import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { DeferredSection } from "@/components/DeferredSection";
import {
  mustPrepareSection, navigateToPortfolioSection, PREPARE_SECTION_NAVIGATION,
} from "@/lib/portfolio-navigation";

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
  document.documentElement.style.scrollBehavior = "";
});

function renderDeferredSections() {
  return render(
    <LanguageProvider>
      <DeferredSection id="projects" label="Projects" minHeight={100}>
        <section id="projects">Loaded projects</section>
      </DeferredSection>
      <DeferredSection id="skills" label="Skills" minHeight={100}>
        <section id="skills">Loaded skills</section>
      </DeferredSection>
      <DeferredSection id="github-activity" label="Activity" minHeight={100}>
        <section id="github-activity">Loaded GitHub activity</section>
      </DeferredSection>
      <DeferredSection id="contact" label="Contact" minHeight={100}>
        <footer id="contact">Loaded contact</footer>
      </DeferredSection>
    </LanguageProvider>
  );
}

describe("reliable scrolling with deferred content", () => {
  it("knows exactly which earlier sections need mounting before a jump", () => {
    expect(mustPrepareSection("projects", "contact")).toBe(true);
    expect(mustPrepareSection("github-activity", "contact")).toBe(true);
    expect(mustPrepareSection("contact", "contact")).toBe(true);
    expect(mustPrepareSection("contact", "projects")).toBe(false);
    expect(mustPrepareSection("skills", "project-tenantrag")).toBe(false);
    expect(mustPrepareSection("projects", "project-tenantrag")).toBe(true);
    expect(mustPrepareSection("education", "github-activity")).toBe(false);
  });

  it("loads previous sections along with the destination to avoid shifting the target", () => {
    renderDeferredSections();
    expect(screen.queryByText("Loaded contact")).toBeNull();
    expect(screen.queryByText("Loaded GitHub activity")).toBeNull();

    act(() => {
      window.dispatchEvent(new CustomEvent(PREPARE_SECTION_NAVIGATION, { detail: "contact" }));
    });

    expect(screen.getByText("Loaded projects")).toBeTruthy();
    expect(screen.getByText("Loaded skills")).toBeTruthy();
    expect(screen.getByText("Loaded GitHub activity")).toBeTruthy();
    expect(screen.getByText("Loaded contact")).toBeTruthy();
  });

  it("does not eagerly mount unrelated later sections on a shorter jump", () => {
    renderDeferredSections();
    act(() => {
      window.dispatchEvent(new CustomEvent(PREPARE_SECTION_NAVIGATION, { detail: "projects" }));
    });
    expect(screen.getByText("Loaded projects")).toBeTruthy();
    expect(screen.queryByText("Loaded skills")).toBeNull();
    expect(screen.queryByText("Loaded contact")).toBeNull();
  });

  it("overrides global smooth-scroll CSS for immediate navigation", () => {
    const target = document.createElement("section");
    target.id = "hero";
    let activeScrollBehavior = "";
    const scroll = vi.fn(() => {
      activeScrollBehavior = document.documentElement.style.scrollBehavior;
    });
    target.scrollIntoView = scroll;
    document.body.appendChild(target);
    document.documentElement.style.scrollBehavior = "smooth";

    navigateToPortfolioSection("hero", "auto");
    expect(scroll).toHaveBeenCalledOnce();
    expect(activeScrollBehavior).toBe("auto");
    expect(document.documentElement.style.scrollBehavior).toBe("smooth");
    target.remove();
  });
});
