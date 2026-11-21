import { describe, expect, it, vi } from "vitest";
import { shouldSkipIntro } from "@/lib/mobile-ux";

describe("mobile and accessible startup", () => {
  it("does not gate first content behind an animation on small touch screens", () => {
    const match = vi.fn(() => true);
    expect(shouldSkipIntro(false, false, match)).toBe(true);
    expect(match).toHaveBeenCalledWith(
      "(max-width: 1023px), (pointer: coarse), (prefers-reduced-motion: reduce)",
    );
  });

  it("retains the cinematic desktop opening for first visits with fine pointer", () => {
    expect(shouldSkipIntro(false, false, () => false)).toBe(false);
  });

  it("respects lightweight and previously seen preferences without media checks", () => {
    const fail = vi.fn(() => { throw new Error("must not check media"); });
    expect(shouldSkipIntro(true, false, fail)).toBe(true);
    expect(shouldSkipIntro(false, true, fail)).toBe(true);
    expect(fail).not.toHaveBeenCalled();
  });
});
