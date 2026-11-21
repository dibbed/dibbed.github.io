import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Projects } from "@/components/Projects";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LightweightModeProvider } from "@/hooks/use-lightweight-mode";

afterEach(() => cleanup());

function ProjectHarness() {
  const [area, setArea] = useState("All");
  const [query, setQuery] = useState("");
  return (
    <LightweightModeProvider>
      <LanguageProvider>
        <Projects
          activeFilter={area}
          onFilterChange={setArea}
          searchQuery={query}
          onSearchChange={setQuery}
        />
      </LanguageProvider>
    </LightweightModeProvider>
  );
}

describe("project portfolio interactions", () => {
  it("shows three flagship systems alongside all eight other projects", () => {
    const { container } = render(<ProjectHarness />);
    expect(container.querySelectorAll("#projects h3")).toHaveLength(11);
    expect(screen.getByText("ComputerPilot MCP")).toBeTruthy();
    expect(screen.getByText("TenantRAG")).toBeTruthy();
    expect(screen.getByText("Psychology Atlas")).toBeTruthy();
  });

  it("searches project names and shows an honest empty state", () => {
    const { container } = render(<ProjectHarness />);
    const search = screen.getByRole("searchbox");
    fireEvent.change(search, { target: { value: "TenantRAG" } });
    expect(container.querySelectorAll("#projects h3")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "TenantRAG" })).toBeTruthy();

    fireEvent.change(search, { target: { value: "ThisRepoDoesNotExist123" } });
    expect(container.querySelectorAll("#projects h3")).toHaveLength(0);
    expect(screen.getByText("No projects match the current filter.")).toBeTruthy();
  });

  it("filters by real focus tags instead of just scrolling to the full list", () => {
    const { container } = render(<ProjectHarness />);
    fireEvent.click(screen.getByRole("button", { name: /^Psychology\s+1$/ }));
    const headings = Array.from(container.querySelectorAll("#projects h3")).map((el) => el.textContent);
    expect(headings).toEqual(["Psychology Atlas"]);
    expect(screen.getByRole("button", { name: /^Psychology\s+1$/ }).getAttribute("aria-pressed")).toBe("true");
  });

  it("opens an inspectable engineering note with source links", () => {
    render(<ProjectHarness />);
    fireEvent.click(screen.getAllByRole("button", { name: /View Architecture/ })[0]);
    const tab = screen.getByRole("tab", { name: /Engineering Notes/ });
    fireEvent.mouseDown(tab, { button: 0, ctrlKey: false });
    fireEvent.click(tab);
    const source = screen.getByRole("link", { name: /Platform capability tests/ });
    expect(source.getAttribute("href")).toBe(
      "https://github.com/dibbed/computerpilot-mcp/blob/main/tests/test_platform_capabilities.py"
    );
  });

  it("identifies sample shell output as illustrative rather than proven CI results", () => {
    render(<ProjectHarness />);
    fireEvent.click(screen.getAllByRole("button", { name: /View Architecture/ })[0]);
    const terminalTab = screen.getByRole("tab", { name: /Terminal Preview/ });
    fireEvent.mouseDown(terminalTab, { button: 0, ctrlKey: false });
    fireEvent.click(terminalTab);
    expect(screen.getByText(/not a recorded test run or live shell output/i)).toBeTruthy();
    expect(screen.getByText(/python scripts\/doctor.py --check/i)).toBeTruthy();
  });
});
