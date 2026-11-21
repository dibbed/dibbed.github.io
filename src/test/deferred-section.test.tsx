import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DeferredSection } from "@/components/DeferredSection";
import { LanguageProvider } from "@/i18n/LanguageContext";

let notifyVisible: (() => void) | undefined;
const originalIntersectionObserver = globalThis.IntersectionObserver;

class FakeIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    notifyVisible = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function renderSection(id = "skills") {
  return render(
    <LanguageProvider>
      <DeferredSection id={id} label="Technical Skills" minHeight={500}>
        <section id={id}><h2>Real section content</h2></section>
      </DeferredSection>
    </LanguageProvider>
  );
}

beforeEach(() => {
  globalThis.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  window.history.replaceState({}, "", "/");
  notifyVisible = undefined;
});
afterEach(() => {
  cleanup();
  globalThis.IntersectionObserver = originalIntersectionObserver;
  window.history.replaceState({}, "", "/");
});

describe("deferred sections", () => {
  it("keeps a unique, keyboard-accessible section anchor before the chunk mounts", () => {
    renderSection();
    expect(document.querySelectorAll("#skills")).toHaveLength(1);
    expect(screen.queryByText("Real section content")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Show section" }));
    expect(screen.getByText("Real section content")).toBeTruthy();
    expect(document.querySelectorAll("#skills")).toHaveLength(1);
  });

  it("mounts its real section when it approaches the viewport", () => {
    renderSection();
    act(() => notifyVisible?.());
    expect(screen.getByText("Real section content")).toBeTruthy();
  });

  it("immediately mounts on a direct section hash", () => {
    window.history.replaceState({}, "", "/#skills");
    renderSection();
    expect(screen.getByText("Real section content")).toBeTruthy();
  });

  it("eagerly loads the projects section for a direct project anchor", () => {
    window.history.replaceState({}, "", "/#project-tenantrag");
    renderSection("projects");
    expect(screen.getByText("Real section content")).toBeTruthy();
  });
});
