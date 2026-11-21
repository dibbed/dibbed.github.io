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

    # Regression: a single first-visit tap must reach a real lazy section,
    # not its placeholder or a stale offset after earlier sections hydrate.
    for width, height in ((320, 568), (390, 844), (768, 900)):
        ctx = browser.new_context(
            viewport={"width": width, "height": height}, is_mobile=True, has_touch=True
        )
        page = ctx.new_page()
        page.goto(base + "/", wait_until="domcontentloaded")
        nav = page.locator("#mobile-bottom-nav")
        nav.get_by_role("button", name="Contact").click()
        page.wait_for_function("""() => {
            const el = document.getElementById("contact");
            const remaining = document.documentElement.scrollHeight -
                window.innerHeight - window.scrollY;
            return el && !el.hasAttribute("data-deferred-placeholder") &&
                remaining < 20 && el.getBoundingClientRect().top < window.innerHeight * 0.75;
        }""", timeout=12000)
        page.wait_for_timeout(1500)
        assert nav.locator('button[aria-current="location"]').all_text_contents() == ["Contact"]
        nav.get_by_role("button", name="More").click()
        page.get_by_role("dialog").get_by_role("button", name="Education").click()
        page.wait_for_function("""() => {
            const el = document.getElementById("education");
            return el && !el.hasAttribute("data-deferred-placeholder") &&
                el.getBoundingClientRect().top >= -10 &&
                el.getBoundingClientRect().top < 160;
        }""", timeout=12000)
        page.wait_for_timeout(350)
        assert nav.locator('button[aria-current="location"]').all_text_contents() == ["More"]
        assert not page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        small_controls = page.evaluate("""() => [...document.querySelectorAll('a, button, input')].flatMap(el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' ||
                el.matches('.sr-only') || rect.width <= 0 || rect.height <= 0 ||
                (rect.width >= 43.5 && rect.height >= 43.5)) return [];
            return [el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 45)];
        })""")
        assert not small_controls, (width, small_controls)
        ctx.close()
        print("PASS one-tap navigation and touch targets", width)

    for anchor in ("contact", "project-tenantrag", "github-activity"):
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True
        )
        page = ctx.new_page()
        page.goto(base + "/#" + anchor, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_function("""anchor => {
            const el = document.getElementById(anchor);
            return el && !el.hasAttribute("data-deferred-placeholder") &&
                el.getBoundingClientRect().top > -50 &&
                el.getBoundingClientRect().top < window.innerHeight * 0.75;
        }""", arg=anchor, timeout=12000)
        ctx.close()
        print("PASS direct lazy anchor", anchor)

    # Text enlargement must not force a horizontal scrollbar or overlap header
    # controls. Check both the first viewport and fully hydrated lower sections.
    for width in (320, 390):
        ctx = browser.new_context(
            viewport={"width": width, "height": 844}, is_mobile=True, has_touch=True
        )
        page = ctx.new_page()
        page.goto(base + "/", wait_until="domcontentloaded")
        page.add_style_tag(content="html { font-size: 200% !important; }")
        page.wait_for_timeout(300)
        assert not page.evaluate("""
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        """), ("first view 200% text", width)
        header = page.locator('nav[aria-label="Primary navigation"]')
        header_bounds = header.evaluate("""nav => {
            const logo = nav.querySelector("button").getBoundingClientRect();
            const tools = nav.querySelector("div.flex.shrink-0").getBoundingClientRect();
            return { logo_right: logo.right, controls_left: tools.left };
        }""")
        assert header_bounds["logo_right"] <= header_bounds["controls_left"] + 1, (width, header_bounds)
        page.locator("#mobile-bottom-nav").get_by_role("button", name="Contact").click()
        page.wait_for_function("""() => {
            const el = document.getElementById('contact');
            return el && !el.hasAttribute('data-deferred-placeholder') &&
                el.getBoundingClientRect().top < innerHeight * .75;
        }""", timeout=14000)
        page.wait_for_timeout(1500)
        assert not page.evaluate("""
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        """), ("hydrated at 200% text", width)
        ctx.close()
        print("PASS enlarged text reflow", width)

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
