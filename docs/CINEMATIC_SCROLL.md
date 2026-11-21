# Cinematic scroll and performance contract

The portfolio deliberately keeps its original dark/emerald visual identity, browser-native scrolling and existing project navigation. The new 3D chapter view uses **Framer Motion already installed**. It does **not** import Three.js, WebGL, GSAP or a smooth-scroll hijacker.

## Experience levels

| Environment | Behavior |
| --- | --- |
| Desktop, fine pointer, at least 1024 × 720, motion allowed | Scroll-scrubbed 3D flagship project carousel with perspective, z-depth, rotation, side-card chapter selection, and short section entrances |
| Touch / small / short display | Normal-flow, accessible project cards with one-time subtle vertical entrance; no pinned 3D sequence |
| System Reduce Motion or user lightweight mode | Static cards and content; no canvas animation loop or progress indicator |

The OS reduced-motion preference overrides user full-motion preferences. The user can explicitly enable lightweight mode via the existing lightning icon. Mobile primary navigation remains intact.

## Performance rules

- Native browser scroll: never register global wheel or touchmove handlers to change scroll position.
- Animate **transform and opacity**, not layout properties; never give an offscreen section a 3D transform that increases document width.
- Scroll-linked animations run only on compatible desktops. On mobile, section entrances are one-time viewport reveals; in lightweight mode, there are no section scroll observers.
- Canvas particle animation is limited to **30fps** and backing-store DPR **1.5** on mobile/coarse-pointer devices, compared with native requestAnimationFrame rate and DPR up to 2 on desktop. It pauses on tab visibility loss. Document height updates happen on resize and ResizeObserver rather than every scroll event.
- Do not create arbitrary full-screen textures or load additional 3D frameworks. Case studies still use a source-backed, static HTML GitHub Pages entry for proper deep-link HTTP 200 responses.

## Implementation reference

- `src/components/CinematicShowcase.tsx`: three scroll-selected cards, accessible stage controls and fallback cards
- `src/components/ScrollStage.tsx`: desktop perspective entrance, mobile one-time entrance, static fallback
- `src/components/ScrollProgress.tsx`: optional compositor-only reading progress line
- `src/components/Hero.tsx`: restrained hero scroll parallax and ambient perspective frames
- `src/components/SpotlightCard.tsx`: CSS-variable card tilt for precise desktop pointers
- `src/components/OrbitalVoid.tsx`: performance-capped ambient canvas
- `src/hooks/use-cinematic-motion.ts`: motion profile / viewport / pointer feature detection

## QA checklist

1. `npm run test`, `npx tsc --noEmit -p tsconfig.app.json`, `npm run lint`, `npm run build`.
2. Browser widths 320, 375, 390, 768, 1024, 1280, 1440: horizontal overflow = 0.
3. On desktop >= 1024 × 720 with fine pointer, scroll through all 3 chapter states: ComputerPilot -> TenantRAG -> Psychology Atlas. Chapter buttons and card links function.
4. On mobile, sticky bottom navigation and project anchors work, with no extra full-screen pinned scene.
5. Switch Persian/English and dark/light themes mid-scene.
6. Emulate `prefers-reduced-motion: reduce`, use manual lightweight toggle and test short landscape desktop.
7. Test `/case-studies/<slug>/` deep links and evidence anchors after deployment.
8. Verify card tilt resets on mouseout and no new JS console/page errors are introduced.

**Known build limitation:** the existing general application bundle remains above Vite's 500 kB minified warning threshold. Motion has no new dependency, but this is not a claim that all performance work is complete. A separate bundle-profiler audit would be needed before attributing specific load-time gains.
