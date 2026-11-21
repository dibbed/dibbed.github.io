import { describe, expect, it } from "vitest";
import { achievements, education, experiences, profile, projects } from "@/data/resume-data";

describe("public portfolio content", () => {
  it("links every featured project to its public repository", () => {
    expect(projects).toHaveLength(11);
    expect(new Set(projects.map((project) => project.repoUrl)).size).toBe(projects.length);
    for (const project of projects) {
      expect(project.repoUrl).toMatch(/^https:\/\/github\.com\/dibbed\/[\w.-]+$/);
      expect(project.description).toBeTruthy();
      expect(project.descriptionFa).toBeTruthy();
    }
  });

  it("links the periodic table demo without implying the API is hosted", () => {
    const periodicTable = projects.find((project) => project.name === "Smart Periodic Table");
    expect(periodicTable?.demoUrl).toBe("https://dibbed.github.io/smart-periodic-table-fullstack/");
    expect(periodicTable?.description).toContain("statically");
  });

  it("lists both verified university qualifications with distinct completion statuses", () => {
    expect(education).toHaveLength(2);
    expect(education[0]).toMatchObject({
      degree: "Bachelor's in Psychology (In Progress)",
      degreeFa: "کارشناسی روان‌شناسی (در حال تحصیل)",
      institution: "Islamic Azad University, Gorgan",
      period: "In progress",
    });
    expect(education[1]).toMatchObject({
      degree: "Associate Degree in Computer Studies",
      degreeFa: "کاردانی کامپیوتر",
      institution: "Islamic Azad University, Gorgan",
      period: "Completed",
      periodFa: "فارغ‌التحصیل",
    });
    expect(education.every((item) => item.institutionFa === "دانشگاه آزاد اسلامی، گرگان")).toBe(true);
  });

  it("does not repeat unverifiable old benchmark and user-count claims", () => {
    const content = JSON.stringify({ profile, achievements, experiences, projects });
    expect(content).not.toMatch(/400K\+|4200 RPS|500-800 RPS|99\.5%|82% test coverage|87% test coverage|6\.5\+ years/i);
  });
});
