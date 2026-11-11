# Neighbour portraits

`assets/forest-friends/neighbours.webp` holds the five big-world neighbours as plush portraits in the same
3 × 2 layout as `postcard-friends.webp` (512 px cells): Igel, Fisch, Reh / Eisvogel, Frosch, (empty).
They are rendered from the baked models, so they match the 3D characters, and then finished to sit next to
the painted friends in the Waldspiele tabs, on the picture map and on letters:

- `portraits.html?id=…` renders one character at 1536 px with a transparent background, turned three-quarters
  towards the viewer and lit warm and soft from the front, plus a mask of its glossy parts (eyes, nose, beak, mouth).
- `render.cjs` paints over each render (a warm shade towards the outline, brushed fur strokes, a fluffy fringe,
  the glossy parts kept crisp on top; fish and frog get only a faint felt texture), crops it to the character and
  scales it into its cell with the framing of the painted friends: up to 448 × 472 px, centred, lowest pixel at
  500 px. The turn per character is `YAW` in `portraits.html`, the brushwork per character `BRUSH` in `render.cjs`.

To redo them after a bake, serve the repository root and run `node tools/portraits/render.cjs`
(needs Playwright with Chromium; `FARBTUPF_PORTRAITS_OUT=/some/file.webp` writes a trial sheet elsewhere).
Bump the app version afterwards so installed games pick up the new sheet.
