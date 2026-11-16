# Current visual consistency audit

Current game art: **Waldpost 9.3.82**. The canonical medium remains **`waldpost-watercolour-pencil-v1`**, with frozen animal/object reference pixels and **22** complete forward image-generation prompts.

## Steinbock as a letter friend

The Steinbock writes letters and has his own puzzle, **Bergmuster** (`friends-ibex`, 30 iterations): repeating groups of the drawn stone, fir and flower (AAB, ABB, ABC, ABAC, AABC in all six orders), the empty place at the end or inside the second group; every task has exactly one fitting picture. It uses the shared pattern renderer and existing library pictures, so no other puzzle's revision changed. He keeps his painted portrait and his pin on the drawn map, now as a real destination; the map has no visit-only places left. In the world a flat bridging stone crosses the spring on the Rock and a trail leads round his crag. Letters pass over any friend whose puzzles are not yet signed off, so no child is sent to him before **Bergmuster** is approved in Puzzle-Prüfung.

## Compact map and dismissal

The adopted top-down map is unchanged as a painting. Its panel is capped at 940 px / 92 vw and 82 dvh, with less padding and no map/back header icons. There is visible backdrop around it. A primary tap that starts and ends on the backdrop closes either the map or an invitation letter; a drag, pan, cancelled pointer or gesture started inside the content does not dismiss it. Escape remains available, focus returns to the launcher, and map keyboard focus wraps across its destination buttons.

The board now stays at least 880 px wide, with the same thirteen named 64 px pins and real world routes, including Steinbock. Calibration/spacing checks still reject overlapping hit areas. Animal identity, painting pixels, landmark calibration and route destinations are unchanged.

## Den and exit roles

The den destination has a new [painted tree-home marker](artwork/den-marker.json), using the same watercolour/pencil finish as the animal portraits. Its compact silhouette avoids miniature leaves, realistic wood, hardware and scenery. The complete request, ordered canonical references, source and packing hashes are retained.

The leaving-den sign is a reduced [flat SVG](../assets/interface/exit-symbol.svg): broad rounded sepia outline, cream/ochre door and blue exit arrow, matching the map/letter/settings pictograms. It has no painted wood or material texture. The old detailed six-icon sheet is retained as provenance, but no runtime/offline dependency uses it. Current Claude/design instructions distinguish the painted map landmark from flat navigation controls.

All other UI animals keep the shared fourteen-friend cast plus sleeping Fuchs; the live world and den fox keep their 3D models. The 235 learning pictures and all 953 task definitions, answers, competence and difficulty remain unchanged.

## Review and validation

All **31** puzzle presentation revisions are byte-identical to 9.3.80; this map/control update causes no additional review invalidation. The visual-review requirements from the earlier painted-portrait adoption still apply. Editorial decisions, their history and real-device saved data are not edited or auto-approved.

Validation covers model/style/calibration contracts, real map/letter backdrop taps, gesture safety, Escape/focus, compact dimensions and all thirteen real touch/keyboard routes at tablet, phone and landscape sizes. Existing artwork, navigation and installed-app update checks cover their normal flows. See [Development](../docs/DEVELOPMENT.md) for commands.

All **775** protected archived originals retain their bytes. Historical requests are provenance only, while the canonical contract and registered forward prompts define future requests.
