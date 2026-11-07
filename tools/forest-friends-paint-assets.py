"""Build the painted Forest friends runtime assets from the frozen design art.

Reads design/forest-friends/visuals (never modified) and writes assets/forest-friends:
- den.webp / forest.webp: the reviewed scenes with the painted fox removed, so the
  playable fox can be composited at runtime.
- shop.webp: the empty-shelf shop scene.
- fox-*.webp / owl.webp: characters cut out of the character sheet with soft alpha.

Run from the repository root: python3 tools/forest-friends-paint-assets.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = Path('design/forest-friends/visuals')
OUT = Path('assets/forest-friends')
OUT.mkdir(parents=True, exist_ok=True)


def polygon_mask(size, points):
    mask = Image.new('L', size, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return np.asarray(mask) > 0


def high_pass(patch, radius=5):
    image = Image.fromarray(patch.astype(np.uint8))
    blurred = np.asarray(image.filter(ImageFilter.GaussianBlur(radius))).astype(float)
    return patch.astype(float) - blurred


def remove_figure(image, points, donors, split_row=None):
    """Fill a polygon by row-wise interpolation between its clean edges plus tiled texture.

    donors: list of (box) clean patches; with split_row, the first is used above it, the second below.
    """
    a = np.asarray(image.convert('RGB')).astype(float)
    mask = polygon_mask(image.size, points)
    out = a.copy()
    textures = [high_pass(a[y0:y1, x0:x1]) for (x0, y0, x1, y1) in donors]
    rows = np.where(mask.any(1))[0]
    for y in rows:
        xs = np.where(mask[y])[0]
        left, right = xs.min() - 1, xs.max() + 1
        lc = a[y, max(0, left - 6):left + 1].mean(0)
        rc = a[y, right:min(a.shape[1], right + 7)].mean(0)
        t = (xs - left) / max(1, right - left)
        fill = lc[None, :] * (1 - t[:, None]) + rc[None, :] * t[:, None]
        texture = textures[0] if split_row is None or y < split_row or len(textures) == 1 else textures[1]
        th, tw = texture.shape[:2]
        fill += texture[y % th, xs % tw] * 0.9
        out[y, xs] = fill
    # Feather the seam so the fill blends into the painting.
    soft = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(float) / 255
    blended = a * (1 - soft[..., None]) + out * soft[..., None]
    blended = np.where(mask[..., None], out, blended)
    return Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))


def cut_sprite(sheet, box, name, background=(252, 239, 224), lateral=True):
    """Flood the uniform sheet background from the crop border and keep a soft-edged figure."""
    crop = sheet.crop(box).convert('RGB')
    a = np.asarray(crop).astype(int)
    h, w = a.shape[:2]
    marker = (255, 0, 255)
    flooded = crop.copy()
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if flooded.getpixel(seed) != marker:
            ImageDraw.floodfill(flooded, seed, marker, thresh=30)
    bg = np.all(np.asarray(flooded) == marker, axis=2)
    # Remove the soft grey ground shadow that hangs under the feet.
    sat = a.max(2) - a.min(2)
    lum = a.mean(2)
    shadowish = (sat < 48) & (lum > 120)
    band = np.zeros_like(bg)
    band[int(h * 0.82):] = True
    candidate = shadowish & band & ~bg
    for _ in range(80):
        grown = bg.copy()
        grown[1:] |= bg[:-1]; grown[:-1] |= bg[1:]; grown[:, 1:] |= bg[:, :-1]; grown[:, :-1] |= bg[:, 1:]
        added = grown & candidate & ~bg
        if not added.any():
            break
        bg |= added
    fg = ~bg
    # Drop the pale remains of the sheet's ground shadow: everything below the lowest dark paw
    # pixel, and (except where a tail hangs that low) pale pixels beside the paws.
    dark = fg & (a.mean(2) < 110)
    dark_rows = np.where(dark.any(1))[0]
    if len(dark_rows):
        paw_bottom = dark_rows.max()
        fg[paw_bottom + 1:] = False
        if lateral:
            pale = (sat < 70) & (lum > 140)
            for y in range(max(0, paw_bottom - 7), paw_bottom + 1):
                xs = np.where(dark[y])[0]
                row = pale[y].copy()
                if len(xs):
                    row[max(0, xs.min() - 3):xs.max() + 4] = False
                fg[y] &= ~row
    distance = np.abs(a - np.array(background)).sum(2)
    # Shave one pixel of cream fringe, then keep a soft two-pixel edge.
    fg_core = fg.copy()
    e = fg_core.copy(); e[1:] &= fg_core[:-1]; e[:-1] &= fg_core[1:]; e[:, 1:] &= fg_core[:, :-1]; e[:, :-1] &= fg_core[:, 1:]
    fg = e
    inner = fg.copy()
    for _ in range(2):
        e = inner.copy()
        e[1:] &= inner[:-1]; e[:-1] &= inner[1:]; e[:, 1:] &= inner[:, :-1]; e[:, :-1] &= inner[:, 1:]
        inner = e
    alpha = np.where(inner, 1.0, np.where(fg, np.clip((distance - 14) / 36, 0, 1), 0.0))
    # Un-mix the cream background from soft edge pixels.
    safe = np.maximum(alpha, 1e-3)[..., None]
    color = np.clip(np.array(background) + (a - np.array(background)) / safe, 0, 255)
    rgba = np.dstack([np.where(alpha[..., None] > 0, color, 0), alpha * 255]).astype(np.uint8)
    sprite = Image.fromarray(rgba, 'RGBA')
    bbox = sprite.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    x0, y0, x1, y1 = bbox
    sprite = sprite.crop((max(0, x0 - 3), max(0, y0 - 3), min(w, x1 + 3), min(h, y1 + 2)))
    sprite.save(OUT / f'{name}.webp', quality=90, method=6)
    return sprite.size


den = Image.open(SRC / 'den-v1.png').convert('RGB')
den_points = [(360, 266), (430, 273), (467, 237), (518, 239), (527, 300), (554, 350), (557, 420), (562, 480), (554, 510),
              (547, 629), (410, 631), (408, 562), (326, 558), (282, 482), (274, 380), (296, 342), (366, 344), (358, 300)]
remove_figure(den, den_points, donors=[(566, 292, 764, 380), (580, 470, 760, 620)], split_row=432).save(OUT / 'den.webp', quality=88, method=6)

forest = Image.open(SRC / 'forest-v7.webp').convert('RGB')
forest_points = [(505, 670), (545, 668), (600, 673), (627, 690), (634, 750), (632, 800), (627, 830), (617, 865), (614, 922),
                 (560, 927), (500, 947), (460, 942), (453, 890), (466, 840), (503, 830), (508, 750)]
remove_figure(forest, forest_points, donors=[(650, 760, 770, 900)]).save(OUT / 'forest.webp', quality=88, method=6)

Image.open(SRC / 'shop-v7.webp').convert('RGB').save(OUT / 'shop.webp', quality=88, method=6)

sheet = Image.open(SRC / 'characters-v1.png')
sizes = {
    'fox-front': cut_sprite(sheet, (24, 56, 288, 436), 'fox-front'),
    'fox-side': cut_sprite(sheet, (304, 56, 584, 436), 'fox-side'),
    'fox-back': cut_sprite(sheet, (615, 56, 847, 436), 'fox-back', lateral=False),
    'fox-happy': cut_sprite(sheet, (1481, 56, 1730, 436), 'fox-happy'),
    'owl': cut_sprite(sheet, (24, 516, 294, 856), 'owl'),
}
print(sizes)
