#!/usr/bin/env python3
"""Generate transparent PNG/ICO fallbacks from the traced AK SVG artwork.

Requires Pillow: python -m pip install Pillow
The SVG is the source of truth and remains the primary modern browser favicon.
"""
from pathlib import Path
from xml.etree import ElementTree
import re
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
svg = (PUBLIC / "favicon.svg").read_text(encoding="utf-8")
element = ElementTree.fromstring(svg)
view_box = [float(v) for v in element.attrib["viewBox"].split()]
path = next(node for node in element if node.tag.endswith("path"))
shapes = re.findall(r"M[^Z]*Z", path.attrib["d"])
assert len(shapes) == 4, "Expected the AK mark, terminal and circuit cutout"
canvas = 1024
scale = canvas / view_box[2]
master = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
draw = ImageDraw.Draw(master)
for i, shape in enumerate(shapes):
    pairs = re.findall(r"(-?\d+)\s+(-?\d+)", shape)
    points = [(round((int(x) - view_box[0]) * scale), round((int(y) - view_box[1]) * scale)) for x, y in pairs]
    # The final contour is the negative-space circle within the circuit tip.
    draw.polygon(points, fill=(0, 0, 0, 0) if i == 3 else (255, 255, 255, 255))

def small(size):
    return master.resize((size, size), Image.Resampling.LANCZOS)

for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "favicon-192.png")]:
    small(size).save(PUBLIC / name, optimize=True)
master.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print("Generated transparent favicon variants")
