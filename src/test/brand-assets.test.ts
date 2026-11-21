import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const publicFile = (name: string) => readFileSync(resolve(process.cwd(), "public", name));

describe("published resume and brand assets", () => {
  it("keeps the redesigned white icon background-free with browser fallbacks", () => {
    const svg = publicFile("favicon.svg").toString("utf8");
    const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
    expect(svg).toContain('fill="#fff"');
    expect(svg).toContain('fill-rule="evenodd"');
    expect(svg).not.toMatch(/<rect\b/i);
    expect(html).toContain('/favicon.svg?v=20261121');
    expect(html).toContain('/favicon.ico?v=20261121');
    for (const name of ["favicon-32.png", "favicon-192.png", "apple-touch-icon.png"]) {
      const png = publicFile(name);
      expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(png[25]).toBe(6); // PNG color type 6 = RGBA with transparency.
    }
    expect(publicFile("favicon.ico").length).toBeGreaterThan(1000);
  });

  it("provides branded per-project social images and a legible light-mode favicon", () => {
    const light = publicFile("favicon-light.svg").toString("utf8");
    expect(light).toContain('fill="#0a1725"');
    expect(light).not.toMatch(/<rect\\b/i);
    for (const slug of ["computerpilot-mcp", "tenant-rag", "psychology-atlas"]) {
      const png = publicFile("og-" + slug + ".png");
      expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);
      expect(png.length).toBeGreaterThan(10000);
    }
  });

  it("publishes a real resume PDF rather than a placeholder", () => {
    const pdf = publicFile("resume.pdf");
    expect(pdf.subarray(0, 5).toString("utf8")).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(5000);
    expect(pdf.length).toBeLessThan(500000);
  });
});
