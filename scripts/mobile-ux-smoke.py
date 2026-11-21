#!/usr/bin/env python3
"""Opt-in mobile UX smoke test for the built portfolio.
Usage: python scripts/mobile-ux-smoke.py --base http://127.0.0.1:4173
Requires: pip install playwright && python -m playwright install chromium
"""
from argparse import ArgumentParser
from playwright.sync_api import sync_playwright

parser = ArgumentParser()
parser.add_argument("--base", default="https://dibbed.github.io")
args = parser.parse_args()
base = args.base.rstrip("/")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in (320, 360, 375, 390, 430, 768, 1024, 1440):
        ctx = browser.new_context(viewport={"width": width, "height": 844 if width < 768 else 900})
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(base + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(2200)
        assert response.status == 200, (width, response.status)
        assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 1"), width
        assert not errors, (width, errors)
        mode = page.locator("#depth-showcase").get_attribute("data-cinematic-mode")
        assert mode == ("accessible" if width < 1024 else "3d"), width
        nav = page.locator("#mobile-bottom-nav")
        assert nav.is_visible() == (width < 1024), width
        if width < 1024:
            assert not page.locator('[aria-label="Portfolio boot sequence"]').count(), width
            assert nav.get_by_role("button", name="Contact").count() == 1
            assert nav.locator("button").count() == 5
            page.locator("#projects").scroll_into_view_if_needed(timeout=16000)
            page.wait_for_timeout(750)
            assert page.locator('#projects [id^="project-"]').count() == 11
        ctx.close()
        print("PASS", width, mode)

    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    page.goto(base + "/", wait_until="domcontentloaded")
    page.get_by_role("button", name="Switch language to Persian").click()
    assert page.evaluate("document.documentElement.dir") == "rtl"
    assert page.locator("#mobile-bottom-nav").get_by_role("button", name="تماس").count() == 1
    ctx.close()
    print("PASS Persian RTL")

    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    for slug in ("computerpilot-mcp", "tenant-rag", "psychology-atlas"):
        response = page.goto(base + "/case-studies/" + slug + "/", wait_until="domcontentloaded")
        assert response.status == 200
        case_nav = page.get_by_role("navigation", name="Case study sections")
        case_nav.wait_for(state="visible", timeout=12000)
        assert case_nav.locator("a").count() == 4
        assert page.request.get(base + "/og-" + slug + ".png").status == 200
        print("PASS case study", slug)
    ctx.close()

    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    page = ctx.new_page()
    page.goto(base + "/", wait_until="domcontentloaded")
    assert page.locator("#depth-showcase").get_attribute("data-cinematic-mode") == "accessible"
    assert not page.locator('[aria-label="Portfolio boot sequence"]').count()
    ctx.close()
    browser.close()
    print("PASS reduced motion")
