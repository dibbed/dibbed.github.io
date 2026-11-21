#!/usr/bin/env python3
"""Assert that each desktop 3D showcase card's CTA fits inside its rounded card
and visible stage.  Requires: pip install playwright; playwright install chromium

Usage: python scripts/cinematic-card-smoke.py --base http://127.0.0.1:4173
The source of truth is rendered geometry, not a fixed CSS pixel assumption.
"""
from argparse import ArgumentParser
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = ArgumentParser()
parser.add_argument("--base", default="https://dibbed.github.io")
parser.add_argument("--screenshots", default="")
args = parser.parse_args()
base = args.base.rstrip("/")
shots = Path(args.screenshots) if args.screenshots else None
if shots:
    shots.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [(1024, 720), (1130, 750), (1280, 800), (1280, 840),
             (1280, 841), (1304, 850), (1440, 900), (1920, 1080)]
SLUGS = ("computerpilot-mcp", "tenant-rag", "psychology-atlas")

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width, height in VIEWPORTS:
        context = browser.new_context(viewport={"width": width, "height": height})
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(base + "/", wait_until="domcontentloaded", timeout=30000)
        assert response.status == 200
        stage = page.locator("#depth-showcase")
        assert stage.get_attribute("data-cinematic-mode") == "3d", (width, height)

        for lang in ("en", "fa"):
            if lang == "fa":
                page.locator('button[title="فارسی"]').first.click(timeout=5000)
                assert page.evaluate("document.documentElement.dir") == "rtl"

            for index, slug in enumerate(SLUGS):
                page.evaluate("""(index) => {
                    const section = document.getElementById("depth-showcase");
                    const top = section.getBoundingClientRect().top + window.scrollY;
                    const span = section.offsetHeight - window.innerHeight;
                    window.scrollTo({
                        top: top + span * index / 2,
                        behavior: "instant"
                    });
                }""", index)
                page.wait_for_timeout(1000)
                data = page.evaluate("""() => {
                    const active = document.querySelector('[data-depth-card][data-active="true"]');
                    const stage = document.querySelector('#depth-showcase .flex-1');
                    const cta = active?.querySelector('a[href^="/case-studies/"]');
                    const rect = (el) => {
                        const r = el.getBoundingClientRect();
                        return {top: r.top, bottom: r.bottom, left: r.left,
                                right: r.right, height: r.height};
                    };
                    return {
                        slug: active?.getAttribute('data-depth-card'),
                        card: active && rect(active),
                        stage: stage && rect(stage),
                        cta: cta && rect(cta),
                        heightDiff: active && active.scrollHeight - active.clientHeight,
                        ctaHref: cta?.getAttribute("href"),
                        horizontalOverflow: document.documentElement.scrollWidth >
                            window.innerWidth + 1,
                    };
                }""")
                msg = f"{width}x{height} {lang} #{index+1} {data['slug']}"
                assert data["slug"] == slug, (msg, data)
                assert data["ctaHref"] == "/case-studies/" + slug + "/", (msg, data)
                assert data["heightDiff"] <= 5, (msg, "internal vertical clipping", data)
                assert data["card"]["top"] >= data["stage"]["top"] - 2, (msg, "top clipped", data)
                assert data["card"]["bottom"] <= data["stage"]["bottom"] + 2, (msg, "bottom clipped", data)
                assert data["cta"]["bottom"] <= data["card"]["bottom"] - 5, (msg, "CTA clipped by card", data)
                assert data["cta"]["bottom"] <= data["stage"]["bottom"] - 5, (msg, "CTA clipped by stage", data)
                assert not data["horizontalOverflow"], (msg, "horizontal overflow", data)
                assert not errors, (msg, errors)
                if shots and (width, height) == (1304, 850) and lang == "en":
                    page.screenshot(path=str(shots / f"slide-{index+1}.png"))
                print("PASS", msg, "card-height", round(data["card"]["height"]),
                      "CTA clearance", round(data["card"]["bottom"] - data["cta"]["bottom"]),
                      flush=True)
        context.close()

    # Accessible fallback stays available and in normal document flow.
    context = browser.new_context(viewport={"width": 390, "height": 844},
                                  is_mobile=True, has_touch=True)
    page = context.new_page()
    page.goto(base + "/", wait_until="domcontentloaded")
    stage = page.locator("#depth-showcase")
    assert stage.get_attribute("data-cinematic-mode") == "accessible"
    assert stage.locator("a[href^='/case-studies/']").count() == 3
    print("PASS mobile accessible cards")
    context.close()
    browser.close()
