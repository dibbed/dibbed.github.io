/**
 * Skip decorative startup on phones, touch devices, and users requesting
 * reduced motion. Keep the original desktop cinematic boot for first visits.
 */
export function shouldSkipIntro(
  isLightweight: boolean,
  previouslySeen: boolean,
  mediaMatches: (query: string) => boolean = (query) =>
    typeof window !== "undefined" && window.matchMedia(query).matches,
): boolean {
  if (isLightweight || previouslySeen) return true;
  return mediaMatches("(max-width: 1023px), (pointer: coarse), (prefers-reduced-motion: reduce)");
}
