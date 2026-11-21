#!/usr/bin/env python3
"""Regenerate portfolio case-study Open Graph cards (requires Pillow).
All text is backed by the corresponding public, source-linked case study.
The PNGs are committed so GitHub Pages builds need no Python dependency.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public"
W, H = 1200, 630
FONT_DIR = Path("C:/Windows/Fonts")
def font(face, size):
    paths=[FONT_DIR/face, Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")]
    for p in paths:
        if p.exists(): return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()

name_font = font("segoeuib.ttf", 84)
tag_font = font("consolab.ttf", 25)
body_font = font("segoeui.ttf", 33)
foot_font = font("segoeuib.ttf", 24)
mono_font = font("consola.ttf", 25)

cards = [
    {"slug":"computerpilot-mcp","name":"ComputerPilot MCP","headline":["Reliable developer automation","with recovery safeguards"],"category":"DEVELOPER TOOLS / MCP","accent":(36,197,160),"symbol":"<>"},
    {"slug":"tenant-rag","name":"TenantRAG","headline":["Multi-tenant retrieval","with explicit security boundaries"],"category":"PYTHON / FASTAPI / RAG","accent":(94,200,232),"symbol":"{}"},
    {"slug":"psychology-atlas","name":"Psychology Atlas","headline":["Persian-first psychology learning","with scientific attribution"],"category":"DJANGO / NEXT.JS / RESEARCH","accent":(179,151,246),"symbol":"[]"},
]

def blend(a,b,t):
    return tuple(round(a[i]*(1-t)+b[i]*t) for i in range(3))

for card in cards:
    im=Image.new("RGB",(W,H))
    px=im.load()
    bg1=(6,13,25); bg2=(13,30,42)
    for y in range(H):
        for x in range(W):
            t=min(1,(x/W*.32+y/H*.68))
            color=blend(bg1,bg2,t)
            # Soft illumination on the right, never behind small text
            dist=math.hypot((x-970)/610,(y-295)/480)
            glow=max(0,1-dist)*.19
            px[x,y]=blend(color,card["accent"],glow)
    d=ImageDraw.Draw(im)
    # Quiet technical grid and circuit marks
    for x in range(690,1200,60):
        d.line((x,0,x,H),fill=(21,42,51),width=1)
    for y in range(45,630,60):
        d.line((690,y,1200,y),fill=(21,42,51),width=1)
    d.rounded_rectangle((58,57,385,107),radius=20,outline=card["accent"],width=2,fill=(13,30,39))
    d.text((83,71),card["category"],font=tag_font,fill=card["accent"])
    d.text((62,163),card["name"],font=name_font,fill=(246,251,254),stroke_width=0)
    for i,line in enumerate(card["headline"]):
        d.text((65,290+i*54),line,font=body_font,fill=(179,205,213))
    d.line((63,520,1137,520),fill=(64,91,101),width=2)
    d.text((63,550),"ALI KHALILI",font=foot_font,fill=(246,251,254))
    d.text((268,550),"Python Backend & Systems Automation",font=mono_font,fill=(148,175,184))
    # A distinctive right-hand terminal tile, not a large decorative screenshot
    d.rounded_rectangle((955,85,1136,264),radius=27,fill=(12,38,44),outline=card["accent"],width=3)
    d.text((984,134),card["symbol"],font=name_font,fill=card["accent"])
    d.ellipse((1101,90,1113,102),fill=card["accent"])
    destination=OUT/("og-"+card["slug"]+".png")
    im.save(destination,format="PNG",optimize=True)
    print(destination.name,im.size,destination.stat().st_size)
