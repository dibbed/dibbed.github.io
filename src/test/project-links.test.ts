import { describe, expect, it } from "vitest";
import { projectAnchor, projectShareUrl } from "@/lib/project-links";
import { projects } from "@/data/resume-data";

describe("shareable project deep links", () => {
  it("uses unique URL-safe anchors for every showcased repository", () => {
    const ids = projects.map((p) => projectAnchor(p.name));
    expect(new Set(ids).size).toBe(projects.length);
    expect(ids).toContain("project-computerpilot-mcp");
    for (const id of ids) expect(id).toMatch(/^project-[a-z0-9-]+$/);
  });

  it("preserves the actual deployment path but discards stale query parameters", () => {
    expect(projectShareUrl("TenantRAG", "https://dibbed.github.io/?query=old")).toBe(
      "https://dibbed.github.io/#project-tenantrag",
    );
    expect(projectShareUrl("ComputerPilot MCP", "https://example.com/deployment/?query=old#hero")).toBe(
      "https://example.com/deployment/#project-computerpilot-mcp",
    );
  });
});
