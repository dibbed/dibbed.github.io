#!/usr/bin/env python3
"""Regenerate public/resume.pdf from portfolio-supported claims.

Requires PyMuPDF: python -m pip install pymupdf
No invented employers, dates, performance figures, certifications, or degrees.
"""
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "resume.pdf"
W, H = fitz.paper_size("a4")
M = 52
R = W - M
INK = (0.105, 0.165, 0.245)
NAVY = (0.055, 0.093, 0.16)
ACCENT = (0.04, 0.57, 0.77)
MUTED = (0.39, 0.46, 0.54)
PALE = (0.94, 0.97, 0.985)
LINE = (0.83, 0.88, 0.92)
WHITE = (1, 1, 1)
doc = fitz.open()

def txt(page, x, y, value, size=9.1, bold=False, color=INK, url=None):
    face = "hebo" if bold else "helv"
    page.insert_text((x, y), value, fontsize=size, fontname=face, color=color, overlay=True)
    if url:
        width = fitz.get_text_length(value, fontname=face, fontsize=size)
        page.insert_link({"kind": fitz.LINK_URI, "from": fitz.Rect(x, y-size-2, x+width, y+3), "uri": url})
    return fitz.get_text_length(value, fontname=face, fontsize=size)

def rule(page, x1, y, x2, color=LINE, w=0.65):
    page.draw_line((x1, y), (x2, y), color=color, width=w)

def lines_for(text, max_width, size=9.3, bold=False):
    face = "hebo" if bold else "helv"
    words = text.split()
    out, curr = [], ""
    for word in words:
        trial = (curr+" "+word).strip()
        if curr and fitz.get_text_length(trial, fontname=face, fontsize=size) > max_width:
            out.append(curr)
            curr = word
        else:
            curr = trial
    if curr:
        out.append(curr)
    return out

def paragraph(page, text, x, y, max_width=490, size=9.2, leading=13.2, color=INK):
    for line in lines_for(text, max_width, size):
        txt(page, x, y, line, size=size, color=color)
        y += leading
    return y

def section(page, label, top):
    txt(page, M, top+9, label.upper(), 9.5, bold=True, color=NAVY)
    rule(page, M, top+18, R)
    return top+37

def bullet(page, text, top, x=M+12, max_width=474, size=9, leading=12.2):
    page.draw_circle((x+2, top-3), radius=1.5, color=ACCENT, fill=ACCENT)
    return paragraph(page, text, x+12, top, max_width-15, size, leading)+3

def small_link(page, x, y, label, href):
    txt(page, x, y, label, 8.35, color=ACCENT, url=href)

def project(page, y, title, repo, one_liner, bullets, tag="PUBLIC REPOSITORY"):
    page.draw_rect(fitz.Rect(M, y-14, M+3, y+20), color=ACCENT, fill=ACCENT)
    txt(page, M+13, y, title, 11.1, bold=True)
    txt(page, R, y, "", 8)  # keep text extraction single-column
    y += 14
    small_link(page, M+13, y, repo.replace("https://", ""), repo)
    y += 19
    y = paragraph(page, one_liner, M+13, y, R-M-15, 9.05, 12.1) + 3
    for b in bullets:
        y = bullet(page, b, y, x=M+13, max_width=R-M-17, size=8.8, leading=11.8)
    return y + 9

def footer(page, page_no):
    rule(page, M, H-40, R)
    txt(page, M, H-26, "ALI KHALILI  /  PYTHON BACKEND & AUTOMATION", 7.8, bold=True, color=MUTED)
    txt(page, R-45, H-26, f"{page_no}  /  2", 8.1, color=MUTED)

# PAGE 1: summary, practical work, strongest evidence-backed projects
p = doc.new_page(width=W, height=H)
p.draw_rect(fitz.Rect(0, 0, W, 147), color=NAVY, fill=NAVY)
p.draw_rect(fitz.Rect(M, 32, M+4, 84), color=ACCENT, fill=ACCENT)
txt(p, M+17, 59, "ALI KHALILI", 25.3, bold=True, color=WHITE)
txt(p, M+18, 81, "PYTHON BACKEND & SYSTEMS AUTOMATION ENGINEER", 10.4, bold=True, color=(0.49,0.82,0.93))
txt(p, M+18, 110, "Gorgan, Iran", 9.25, color=WHITE)
txt(p, M+113, 110, "ali0.0kh1380@gmail.com", 9.25, color=WHITE, url="mailto:ali0.0kh1380@gmail.com")
txt(p, M+18, 130, "github.com/dibbed", 9.25, color=(0.66,0.88,0.99), url="https://github.com/dibbed")
txt(p, M+171, 130, "dibbed.github.io", 9.25, color=(0.66,0.88,0.99), url="https://dibbed.github.io/")
txt(p, M+307, 130, "t.me/dibbed", 9.25, color=(0.66,0.88,0.99), url="https://t.me/dibbed")
y = section(p, "Profile", 161)
y = paragraph(p,
    "Backend-focused Python developer building asynchronous services, Telegram/MTProto automation, "
    "developer tooling and tenant-aware retrieval systems. Emphasis on authorization boundaries, "
    "recovery after failure, maintainable APIs and automated verification. Also studying psychology.",
    M, y, size=9.3, leading=13.4) + 12

y = section(p, "Core engineering strengths", y)
y = paragraph(p, "BACKEND    Python  |  asyncio  |  FastAPI  |  Django / DRF  |  REST APIs  |  pytest",
              M, y, size=9.1, leading=14.3)
y = paragraph(p, "DATA             PostgreSQL  |  Redis  |  SQLite  |  tenant-scoped retrieval  |  RAG",
              M, y, size=9.1, leading=14.3)
y = paragraph(p, "SYSTEMS      MCP  |  Playwright  |  Git  |  Docker  |  GitHub Actions  |  Linux",
              M, y, size=9.1, leading=14.3) + 11

y = section(p, "Professional experience", y)
txt(p, M, y, "INDEPENDENT / FREELANCE", 10.6, bold=True)
txt(p, M, y+15, "Python Backend & Automation Developer", 9.3, color=MUTED)
txt(p, R-53, y+15, "Ongoing", 8.75, color=MUTED)
y += 37
y = bullet(p, "Develop asynchronous Python services, Telegram integrations and API-based automation workflows.", y)
y = bullet(p, "Use Redis and relational databases for state, scheduling, coordination and persistence.", y)
y = bullet(p, "Build practical developer tooling for browser control, process management and failure recovery.", y) + 6

y = section(p, "Selected engineering projects", y)
y = project(p, y, "ComputerPilot MCP", "https://github.com/dibbed/computerpilot-mcp",
    "Developer automation runtime exposing typed MCP tools for files, terminal, Git, browser and code intelligence.",
    ["SQLite-backed durable jobs and workflows with restart recovery and mutation safeguards.",
     "Cross-platform CI for supported features; Windows adds native desktop automation."])
y = project(p, y, "TenantRAG", "https://github.com/dibbed/tenant-rag",
    "FastAPI multi-tenant retrieval framework with authenticated, tenant-scoped data access.",
    ["Separate vector stores and semantic caches by tenant; hash API keys and validate requests.",
     "Document security boundaries and test isolation with automated pytest suites."])
if y > H-57:
    raise RuntimeError(f"Page one content overflow: {y}")
footer(p, 1)

# PAGE 2: additional projects, technical range, education
p = doc.new_page(width=W, height=H)
p.draw_rect(fitz.Rect(0,0,W,7),color=NAVY,fill=NAVY)
txt(p, M, 49, "ENGINEERING PORTFOLIO", 19, bold=True)
txt(p, M, 66, "Selected projects, tools and education", 9.35, color=MUTED)
rule(p, M, 81, R)
y = section(p, "Selected work continued", 98)
y = project(p, y, "Psychology Atlas", "https://github.com/dibbed/psychology-atlas",
    "Persian-first educational platform built around Django/DRF and Next.js.",
    ["Organizes linked psychology concepts, knowledge graphs, Brain Atlas and assessment references.",
     "Makes scientific attribution, content rights and non-diagnostic scope explicit."])
y = project(p, y, "Telegram Voice Streaming Engine", "https://github.com/dibbed/tg-vc-player-saas",
    "MTProto voice-chat streaming project with session coordination and FFmpeg media processing.",
    ["Redis and PostgreSQL support coordination and persisted streaming state; recovery workflows are included."])
y = project(p, y, "TTSKit", "https://github.com/dibbed/TTSKit-multi-engine-tts",
    "Multi-engine text-to-speech toolkit with Persian support, FastAPI, CLI and Telegram adapters.",
    ["Includes caching and FFmpeg-based audio conversion."])
y = project(p, y, "CLI Orchestrator", "https://github.com/dibbed/cli-orchestrator",
    "Python task-orchestration CLI with isolated workers, timeouts and error handling.",
    [])
y = section(p, "Technical toolkit", y+1)
for title, content in [
    ("APIs AND DATA", "FastAPI, Django / DRF, SQL, PostgreSQL, Redis, SQLite, REST, vector retrieval"),
    ("AUTOMATION", "asyncio, MCP, Playwright, Pyrogram, Aiogram, FFmpeg, browser workflows"),
    ("DELIVERY AND SAFETY", "Git, GitHub Actions, Docker, Nginx, input validation, access control"),
    ("INTERFACES", "TypeScript, JavaScript, React, Next.js, Persian RTL experiences"),
]:
    txt(p, M, y, title, 8.25, bold=True, color=ACCENT)
    y = paragraph(p, content, M+122, y, max_width=R-(M+122), size=8.8, leading=11.7)+10
y = section(p, "Education", y+2)
txt(p, M, y, "Psychology studies (in progress)", 9.7, bold=True)
txt(p, M, y+14, "Islamic Azad University, Gorgan", 8.9, color=MUTED)
txt(p, M, y+34, "Software engineering: independent study and public project work", 8.9)
lang_y = section(p, "Languages", y+62)
txt(p, M, lang_y, "Persian: native", 9.2)
txt(p, M+158, lang_y, "English: technical documentation and communication", 9.2)
if lang_y+15 > H-47:
    raise RuntimeError(f"Page two content overflow: {lang_y+15}")
footer(p, 2)
doc.set_metadata({"title": "Ali Khalili | Python Backend & Systems Automation Engineer",
                  "author": "Ali Khalili",
                  "subject": "Engineering resume and source-linked projects",
                  "keywords": "Python, backend, automation, FastAPI, MCP, RAG"})
DEST.parent.mkdir(parents=True,exist_ok=True)
doc.save(str(DEST), garbage=4, deflate=True, clean=True)
print(f"Generated {DEST} | pages={len(doc)} | bytes={DEST.stat().st_size} | content_bottom={lang_y+15:.1f}")
