# Post-release mobile UX audit and corrections

Date: 2026-11-21
Portfolio: https://dibbed.github.io/
Base: PR #10 / `b2926d1`

## Evidence-based findings

The prior three-phase mobile UX release passes its original smoke tests, but a more
targeted browser audit found a navigational regression: on a fresh mobile visit, tapping
**Contact** from the first viewport could leave the visitor far above the contact footer.
The delayed hydration of the intervening `DeferredSection` blocks changed document
height, while the site's global `html { scroll-behavior: smooth }` made ostensibly
automatic long-distance scrolling animate slowly. The current-section highlight
could consequently indicate `More` rather than `Contact`.

A DOM-based audit also found secondary project controls that were 40px tall on
phones and tablets, and several small GitHub activity/footer links. At 200% text
enlargement on a 320px mobile layout, the accessible flagship gallery's intrinsic
minimum width caused horizontal reflow beyond the viewport.

## Changes

1. Added `src/lib/portfolio-navigation.ts` to coordinate navigation across
   all deferred sections. It requests the destination *and earlier sections* to
   mount, waits for settled layout, and scrolls only to the real anchor.
2. Applied this shared behavior to the mobile bottom nav, top navigation,
   command palette, hero's primary CTA, the skills radar, and the Index route.
   Direct section hashes and `#project-*` anchors use the same path.
3. Long jumps intentionally bypass the page's globally smooth CSS; short jumps
   can remain smooth. Final Contact navigates to the page end to keep the footer
   fully visible above the safe-area navigation.
4. Added a bounded follow-up alignment check for late asynchronous height
   changes. Touch, pointer, wheel, and keyboard input cancel this correction.
5. Added a real `#github-activity` anchor and corrected mobile bottom-nav
   active states near the footer without accidentally selecting Contact while
   viewing Education on a tablet.
6. Preserved 44px touch targets for project actions and architecture links on
   touch-size tablet viewports. Enlarged the GitHub activity links, header brand
   target, and Case Study footer/source links.
7. Made the top header's brand shrink/truncate when text is enlarged, while
   preserving usable search/language/theme controls. The accessible flagship
   card grid uses an explicit shrinkable one-column layout and wraps long
   headings at 200% text size rather than widening the page.
8. Added four unit tests covering preceding-section hydration and CSS smooth
   override, and expanded the reproducible Playwright mobile smoke tests for
   the first-tap navigation, tablet hit areas, direct hashes and enlarged text.

## Verification

Run locally against a built preview:

```shell
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npm run test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
python scripts/mobile-ux-smoke.py --base http://127.0.0.1:4173
```

The browser suite covers widths 320, 360, 375, 390, 430, 768, 1024 and
1440px, the Persian/RTL state, Reduced Motion, all three Case Study routes,
direct project/section anchors, and both initial and fully hydrated views at
200% root text size on narrow screens. It also checks the one-tap Contact /
Education routes and visible touch targets.

## Remaining verification limits

Browser emulation cannot substitute for hands-on iOS Safari/Android testing,
assistive-technology testing, real mobile-network Core Web Vitals, or long-term
field measurements. No unmeasured speed or conversion lift is asserted.
Avoid claiming these checks were completed unless separately verified.
