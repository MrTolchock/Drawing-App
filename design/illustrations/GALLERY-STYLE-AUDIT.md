# Gallery drawing-style audit — 16 November 2026

All **235 registered drawings across 17 atlases** were manually compared on cream, with full-size inspection of differing sheets. The majority uses warm watercolour washes, visible coloured-pencil strokes, thin organic sepia contours and gentle drawn shading. The original `animals` and `words-two` sheets establish that baseline.

**38 drawings were redrawn**: sixteen animal actions, sixteen woodland objects and six colour flowers. Their previous smooth sculpted/plush/felt-like finish stood apart from the majority. The other 197 drawings retain their original pixels. Natural species detail in the wildlife pictures remains appropriate within the drawn family.

[Machine-readable decisions and every subject ID](gallery-style-audit.json) · [Before/after comparison](../evidence/2026-11-16-gallery-style/comparison.png) · [Whole gallery after correction](../evidence/2026-11-16-gallery-style/all-sheets-after.png)

| Atlas | Drawings | Decision |
| --- | ---: | --- |
| `alphabet` | 16 | Retained; already consistent |
| `animals` | 16 | Retained; already consistent |
| `creatures` | 16 | Retained; already consistent |
| `discovery` | 16 | Retained; already consistent |
| `forest-actions` | 16 | Redrawn in the majority style |
| `forest-fox` | 1 | Retained; already consistent |
| `forest-objects` | 16 | Redrawn in the majority style |
| `forest-wildlife` | 16 | Retained; already consistent |
| `menu` | 6 | Retained; already consistent |
| `navigation` | 16 | Retained; already consistent |
| `people` | 16 | Retained; already consistent |
| `puzzle-flowers` | 6 | Redrawn in the majority style |
| `puzzle-vocabulary` | 20 | Retained; already consistent |
| `rhyme-vocabulary` | 10 | Retained; already consistent |
| `words-one` | 16 | Retained; already consistent |
| `words-three` | 16 | Retained; already consistent |
| `words-two` | 16 | Retained; already consistent |

## Exact replacements

### forest-actions

Smooth plush/modelled animal volume differed from the majority pencil contours and watercolour washes.

- [Source, references and packing manifest](forest-actions.json)
- [Exact generation prompt](prompts/forest-actions-style-generation.txt)
- [Layout/transparency repair](prompts/forest-actions-style-padding.txt)

`mouse-sit`, `mouse-run`, `mouse-sleep`, `bird-fly`, `bird-sit`, `fish-swim`, `hare-run`, `hare-sit`, `fox-sleep`, `fox-run`, `cat-sleep`, `cat-sit`, `dog-run`, `dog-sleep`, `duck-swim`, `duck-fly`

### forest-objects

Sculpted material textures and deep volume differed from the majority hand-drawn props.

- [Source, references and packing manifest](forest-objects.json)
- [Exact generation prompt](prompts/forest-objects-style-generation.txt)
- [Layout/transparency repair](prompts/forest-objects-style-padding.txt)

`forest-nut`, `forest-apple`, `forest-berry`, `forest-leaf`, `forest-feather`, `forest-fir`, `forest-mushroom`, `forest-flower`, `forest-honey`, `forest-rose`, `forest-stone`, `forest-branch`, `forest-lantern`, `forest-shapes`, `forest-post`, `forest-basket`

### puzzle-flowers

Puffy felt-like petals and heavy surface texture differed from the majority delicate drawn flowers.

- [Source, references and packing manifest](puzzle-flowers.json)
- [Exact generation prompt](prompts/puzzle-flowers-style-generation.txt)

`puzzle-flower-rot`, `puzzle-flower-gelb`, `puzzle-flower-blau`, `puzzle-flower-rosa`, `puzzle-flower-weiss`, `puzzle-flower-lila`

## Identity, colour and review

Subject IDs and atlas cell order are unchanged. The action pairs retain their animal markings, clear sitting/running/sleeping/flying/swimming poses and closed sleeping eyes. Counted nuts, berries, apples and leaves still depict one item. The six flower colours remain red, yellow, blue, pink, white and violet. Complete limbs/leaves stay inside the packed cells with transparent gutters.

The old runtime atlases and the actual cream-composited generator reference inputs are retained in [references/gallery-style/](references/gallery-style/). Drafts, repaired sources, exact prompts and source hashes are recorded in each manifest. Only mechanical cropping/resizing/profile conversion follows image generation.

The shared progress leaf and celebration flower are among the changed pictures, so **all 31 puzzle rendering revisions change** and need normal review again. Existing decisions remain historical records; no approvals are fabricated or written to the production review branch. The per-puzzle invalidation logic is unchanged.

The separate world navigation symbols, den/door pins, backgrounds, character-model portraits, questions, answers, save keys and subject registry remain unchanged. See the [illustration handoff](README.md) and [validation record](../evidence/2026-11-16-gallery-style/README.md).
