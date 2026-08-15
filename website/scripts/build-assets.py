#!/usr/bin/env python3
"""
build-assets.py - IP-masking asset pipeline (v7 Phase A).

Rebuilds the two shipped exhibit plates so that no scoring internals or
runtime internals ship on the public site. The patent is not filed; the
site is prior art against Kriseva's own future filing. WHAT the system
does is safe to show. HOW it weighs anything is not.

Inputs
  The full-fidelity originals are NOT kept in the working tree (that is
  the point). They are recovered byte-exactly from git history at the
  pinned revision below (the last commit that shipped them unmasked) via
  `git show`. Anyone with the repo can reproduce the outputs:

      python3 scripts/build-assets.py

Outputs (overwrite in place, same filenames the pages reference)
  public/assets/v6/console_boundary_zones.jpg
      Cropped to the dashed boundary line + the Zone II refusal card
      only. Zone I (which named the model runtime, sizes and audit-log
      file paths) does not appear.

The post-build lint (scripts/check-public-output.mjs) hard-fails the
build if any of the masked terms reappear anywhere in dist/.
"""

import subprocess
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]          # website/
REPO = ROOT.parent                                   # git root
OUT = ROOT / "public" / "assets" / "v6"

# Last revision that carried the unmasked originals (pre-Phase-A main).
ORIGIN_REV = "5eb68f7"

JPEG_OPTS = dict(quality=92, optimize=True, progressive=True)


def from_git(rel_path: str) -> Image.Image:
    """Recover an original byte-exactly from git history."""
    blob = subprocess.run(
        ["git", "show", f"{ORIGIN_REV}:{rel_path}"],
        cwd=REPO, capture_output=True, check=True,
    ).stdout
    return Image.open(BytesIO(blob)).convert("RGB")


def reframe_bottom(im: Image.Image, src: Image.Image, corner: int = 30) -> Image.Image:
    """A crop loses the plate's bottom frame. Mirror the top corner
    registration marks onto the new bottom edge so the plate still reads
    as a complete exhibit, in its own visual language."""
    w, h = im.size
    tl = src.crop((0, 0, corner, corner)).transpose(Image.FLIP_TOP_BOTTOM)
    tr = src.crop((src.width - corner, 0, src.width, corner)).transpose(Image.FLIP_TOP_BOTTOM)
    im.paste(tl, (0, h - corner))
    im.paste(tr, (w - corner, h - corner))
    return im


def build_boundary() -> None:
    rel = "website/public/assets/v6/console_boundary_zones.jpg"
    src = from_git(rel)                                # 1400 x 1310
    if src.size != (1400, 1310):
        sys.exit(f"unexpected original size for boundary: {src.size}")

    # Crop to the dashed boundary divider + the Zone II card. Zone I
    # never appears.
    out = src.crop((24, 830, 1376, 1310))
    out.save(OUT / "console_boundary_zones.jpg", "JPEG", **JPEG_OPTS)
    print(f"boundary      -> {out.size[0]}x{out.size[1]}")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    # build_score_drawer removed: exhibit retired under sensitive-screenshot review (A6).
    build_boundary()
    print("done. run `npm run qa` to re-lint dist output.")
