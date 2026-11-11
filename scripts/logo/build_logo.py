"""Builds the Foto Joe signature logo assets.

Outputs
  src/brand/signature.ts   vector outline of the signature (no web font needed)
  src/brand/ink.ts         pen-stroke data so the signature can "write itself"

Run (needs: fonttools brotli uharfbuzz scikit-image scipy numpy pillow, and the
repo's node_modules for the Allison font + sharp):

  python scripts/logo/build_logo.py

The lettering is Allison (SIL Open Font License) converted to outlines.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from collections import deque
from pathlib import Path

import numpy as np
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image
from scipy import ndimage
from skimage.morphology import medial_axis

ROOT = Path(__file__).resolve().parents[2]
FONT = ROOT / "node_modules/@fontsource/allison/files/allison-latin-400-normal.woff2"
TEXT = "Foto Joe"
UNIT = 0.1          # font units -> logo units
PAD = 6             # logo units of padding around the ink
RASTER = 6          # raster pixels per logo unit (for tracing only)


def shape(font_path: Path, text: str):
    data = font_path.read_bytes()
    tt = TTFont(font_path)
    # harfbuzz needs sfnt data, so round-trip the woff2 through fontTools
    with tempfile.NamedTemporaryFile(suffix=".ttf", delete=False) as tmp:
        tt.flavor = None
        tt.save(tmp.name)
        sfnt = Path(tmp.name).read_bytes()
    face = hb.Face(sfnt)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True, "calt": True})
    order = tt.getGlyphOrder()
    glyphs = []
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        glyphs.append((order[info.codepoint], x + pos.x_offset, pos.y_offset))
        x += pos.x_advance
    return tt, glyphs


def outline(tt: TTFont, glyphs):
    glyph_set = tt.getGlyphSet()
    bounds = BoundsPen(glyph_set)
    for name, gx, gy in glyphs:
        glyph_set[name].draw(TransformPen(bounds, (1, 0, 0, 1, gx, gy)))
    x0, y0, x1, y1 = bounds.bounds
    width = (x1 - x0) * UNIT + PAD * 2
    height = (y1 - y0) * UNIT + PAD * 2
    pen = SVGPathPen(glyph_set, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    for name, gx, gy in glyphs:
        # flip y, move into the padded box
        t = (UNIT, 0, 0, -UNIT, (gx - x0) * UNIT + PAD, (y1 + gy) * UNIT + PAD)
        glyph_set[name].draw(TransformPen(pen, t))
    return pen.getCommands(), round(width, 1), round(height, 1)


def rasterize(d: str, width: float, height: float) -> np.ndarray:
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'width="{width * RASTER}" height="{height * RASTER}">'
        f'<rect width="100%" height="100%" fill="#000"/><path d="{d}" fill="#fff"/></svg>'
    )
    with tempfile.TemporaryDirectory() as tmp:
        svg_path = Path(tmp) / "sig.svg"
        png_path = Path(tmp) / "sig.png"
        svg_path.write_text(svg)
        js = (
            "const sharp=require('sharp');"
            f"sharp({json.dumps(str(svg_path))},{{density:72}}).png().toFile({json.dumps(str(png_path))})"
            ".then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})"
        )
        subprocess.run(["node", "-e", js], cwd=ROOT, check=True)
        img = np.array(Image.open(png_path).convert("L"))
    return img > 127


def trace(mask: np.ndarray):
    """Returns pen points [x, y, r, t] in logo units with t in 0..1."""
    skel, dist = medial_axis(mask, return_distance=True)
    labels, count = ndimage.label(mask, structure=np.ones((3, 3)))
    comps = []
    for idx in range(1, count + 1):
        ys, xs = np.nonzero(skel & (labels == idx))
        if len(xs) < 6:
            continue
        comps.append((xs.min(), idx, xs, ys))
    comps.sort()

    nbrs = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
    points = []
    clock = 0.0
    gap = 18 * RASTER  # pen lift between strokes, in raster px of travel
    for _, idx, xs, ys in comps:
        pts = set(zip(xs.tolist(), ys.tolist()))

        def degree(p):
            return sum((p[0] + dx, p[1] + dy) in pts for dx, dy in nbrs)

        ends = [p for p in pts if degree(p) == 1]
        pool = ends or list(pts)
        # start where a right-handed writer would: far left, a little bias to the top
        start = min(pool, key=lambda p: p[0] + 0.35 * p[1])
        best = {start: 0.0}
        queue = deque([start])
        while queue:
            p = queue.popleft()
            for dx, dy in nbrs:
                q = (p[0] + dx, p[1] + dy)
                if q not in pts:
                    continue
                step = 1.41421 if dx and dy else 1.0
                nd = best[p] + step
                if nd < best.get(q, 1e18):
                    best[q] = nd
                    queue.append(q)
        reach = max(best.values())
        for (px, py), g in best.items():
            points.append((px, py, float(dist[py, px]), clock + g))
        clock += reach + gap
    total = clock - gap
    points.sort(key=lambda p: p[3])

    # thin the stamps: keep one point per ~1.4 raster px of travel per cell
    kept = []
    seen = set()
    for px, py, r, t in points:
        cell = (px // 3, py // 3)
        if cell in seen:
            continue
        seen.add(cell)
        kept.append(
            [
                round(px / RASTER, 1),
                round(py / RASTER, 1),
                round(max(r / RASTER * 1.3 + 0.35, 0.9), 2),
                round(t / total, 4),
            ]
        )
    return kept, len(comps)


def main():
    tt, glyphs = shape(FONT, TEXT)
    d, width, height = outline(tt, glyphs)
    mask = rasterize(d, width, height)
    points, strokes = trace(mask)

    brand = ROOT / "src/brand"
    brand.mkdir(parents=True, exist_ok=True)
    (brand / "signature.ts").write_text(
        "// Generated by scripts/logo/build_logo.py — do not edit by hand.\n"
        "// \"Foto Joe\" signature as vector outlines (Allison, SIL OFL).\n"
        f"export const SIGNATURE_WIDTH = {width};\n"
        f"export const SIGNATURE_HEIGHT = {height};\n"
        f"export const SIGNATURE_PATH =\n  {json.dumps(d)};\n"
    )
    flat = [v for p in points for v in p]
    (brand / "ink.ts").write_text(
        "// Generated by scripts/logo/build_logo.py — do not edit by hand.\n"
        "// Pen-stroke stamps for the signature intro: [x, y, radius, time 0..1] repeated.\n"
        f"export const INK: number[] = {json.dumps(flat, separators=(',', ':'))};\n"
    )
    print(f"signature {width}x{height}, path {len(d)} chars, {len(points)} stamps, {strokes} strokes")

    if "--debug" in sys.argv:
        out = Path(sys.argv[sys.argv.index("--debug") + 1])
        h, w = mask.shape
        rgb = np.zeros((h, w, 3), dtype=np.uint8)
        rgb[mask] = (60, 60, 60)
        for x, y, r, t in points:
            px, py = int(x * RASTER), int(y * RASTER)
            rgb[max(py - 2, 0):py + 3, max(px - 2, 0):px + 3] = (int(255 * t), int(255 * (1 - t)), 80)
        Image.fromarray(rgb).save(out)


if __name__ == "__main__":
    main()
