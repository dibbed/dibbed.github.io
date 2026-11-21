import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { useLanguage } from "@/i18n/use-language";
import { LightweightModeProvider } from "@/hooks/use-lightweight-mode";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => cleanup());

function LocaleSwitcher() {
  const { toggleLang } = useLanguage();
  return <button onClick={toggleLang}>Language test switch</button>;
}

function renderNavigation(onSearch = vi.fn(), onTerminal = vi.fn()) {
  return render(
    <LightweightModeProvider>
      <LanguageProvider>
        <div>
          <LocaleSwitcher />
          <section id="hero">Hero</section>
          <section id="skills">Skills</section>
          <section id="experience">Experience</section>
          <section id="projects">Projects</section>
          <section id="education">Education</section>
          <footer id="contact">Contact</footer>
          <input aria-label="Project typing" />
          <MobileBottomNavigation onOpenSearch={onSearch} onOpenTerminal={onTerminal} />
        </div>
      </LanguageProvider>
    </LightweightModeProvider>,
  );
}

describe("accessible mobile bottom navigation", () => {
  it("has five large primary actions without a hamburger menu", () => {
    renderNavigation();
    const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(nav.querySelectorAll("button")).toHaveLength(5);
    for (const label of ["Home", "Projects", "Skills", "Contact", "More"]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
    expect(nav.querySelector("[aria-haspopup='dialog']")).toBeTruthy();
    expect(nav.querySelector("[aria-expanded='false']")).toBeTruthy();
    expect(nav.querySelector("[aria-label*='hamburger']")).toBeNull();
  });

  it("activates project navigation and exposes quick actions", async () => {
    renderNavigation();
    const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(nav.querySelector("button[aria-current='location']")?.getAttribute("aria-label")).toBe("Projects");
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Terminal" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Experience" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Download CV/ })).toHaveAttribute("download");
  });

  it("opens Search only after closing the More sheet", async () => {
    const openSearch = vi.fn();
    renderNavigation(openSearch);
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    await waitFor(() => expect(openSearch).toHaveBeenCalledOnce());
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("translates the bottom navigation and opens Persian quick actions", () => {
    renderNavigation();
    fireEvent.click(screen.getByRole("button", { name: "Language test switch" }));
    const nav = screen.getByRole("navigation", { name: "ناوبری موبایل" });
    expect(nav.getAttribute("id")).toBe("mobile-bottom-nav");
    expect(nav.querySelector("[dir='rtl']")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "بیشتر" }));
    expect(screen.getByText("دسترسی سریع و ابزارها")).toBeTruthy();
  });

  it("gets out of the way when a text input is focused", async () => {
    renderNavigation();
    const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
    screen.getByRole("textbox", { name: "Project typing" }).focus();
    await waitFor(() => expect(nav.className).toContain("pointer-events-none"));
    screen.getByRole("textbox", { name: "Project typing" }).blur();
    await waitFor(() => expect(nav.className).not.toContain("pointer-events-none"));
  });
});
