# Visual design review — version 1

**Status:** First visual proposal, 7 November 2026. Ready for discussion; teacher review, child testing and final art approval are outstanding.

Open [the interactive review](review.html) in a browser. It contains six views: Zuhause, Wald, Zählen, Lesen, Laden and Figuren. The layout and text are editable in the HTML file. It can also be served locally from the repository root using `python3 -m http.server 8766 --bind 127.0.0.1`, then opened at `http://127.0.0.1:8766/design/forest-friends/visuals/review.html`.

Use a separate local port from the installed game's preview: an existing service worker on the game's origin can return an older cached design. The review itself registers no service worker and writes no save data.

## Character reference

![Fuchs and Waldkauz — front, side, back and expression studies](characters-v1.png)

Fuchs has an orange/cream coat, dark paws, a cream-tipped tail and green neckerchief. Waldkauz has rounded tawny feathers, facial discs, large warm eyes and no ear tufts. The sheet establishes silhouettes and expressions for review, not final mesh topology, rigging, animation or textures.

Model handoff: keep Fuchs's tail and neckerchief readable from behind; preserve Waldkauz's distinct facial discs and independently movable wings. Use simplified broad material shapes in real-time models. The image's feather/fur detail is a mood reference, not a requirement to reproduce dense geometry on tablets. Compare front/side/back views during modelling rather than treating a generated turnaround as exact orthographic construction.

## Home and forest reference

![Fuchs at home in the den](den-v1.png)

The door, drawing table, bed and open floor are the home menu. The generated scene includes starter bedding and a plain cushion; these are background dressing, not the purchased ochre cushion represented in the interaction specimen. In production, separate every movable or buyable furnishing from the environment so ownership and placement are accurately represented.

![Central home tree, shop and brook](forest-v1.png)

The central tree is the home landmark, the smaller tree is the shop, and broad sandy paths lead towards neighbours. The sample world is an illustration; it does not demonstrate the 3D camera, collision, routing or reachability of any location. The two sample friend buttons switch between design views and are not literal map coordinates. The topology in [experience design](../experience-design.md) remains the world-layout reference.

## Interaction specimens

- **Zählen:** seven selectable nuts, three numeral choices, editable answer, hint and recoverable feedback. One sample task only; it does not award round resources.
- **Lesen:** the written word «Maus» and three picture choices. Instruction playback does not pronounce the target word. The picture buttons have descriptive accessibility names; a future accessible reading variant needs review because those labels may reveal the match to a screen-reader user.
- **Laden:** start with three sample nuts; preview and purchase a cushion for two and an apple for one. Returning home exposes placement and consumption actions. Duplicate permanent purchases are prevented. The placed cushion uses one fixed spot; free arrangement and eating animation remain development work.
- **Zuhause / Wald:** visual composition and screen navigation, with an explanation when opening the future drawing activity.
- **Figuren:** full character reference sheet.

The five progress dots show the planned round design; the review does not implement five-task rounds. «Beispiel» opens an explanatory note instead of the separately authored animated example required by the puzzle specification. The review contains no telemetry, save migration, durable wallet or production audio system. Speech uses the browser's available German voice; pronunciation quality has not been validated.

## Browser review performed

Checked the review in the app browser at 820 × 1180 and 390 × 844 viewport sizes. Inspected screenshots of home, counting and reading. Confirmed wrong-answer recovery for counting and reading, the cushion/apple purchase flow, home placement and consumption, and ownership/balance changes. Corrected the progress-label styling and narrow-screen header wrapping. The narrow counting view has no horizontal page overflow and its nut targets are 48 × 54 CSS pixels.

This checks the prototype's layout and sample interactions. It does not establish physical iPad performance, Safari compatibility, children’s comprehension or curriculum attainment. Production persistence remains a requirement in the blueprint; refresh intentionally resets this disposable review.

## Review questions and remaining work

| Review topic | Concrete question | What to record |
| --- | --- | --- |
| Character identity | Are Fuchs and Waldkauz recognisable, expressive and appropriate for first grade? | Specific silhouette, expression or costume changes |
| Home clarity | Can the child find the door, table and furnishing action from the image? | First action and any spoken help needed |
| Counting | Does the child understand the five/ten arrangement and the check button? | Marks, corrections and requested help; no inferred mental strategy |
| Reading | Are the word, pictures and instructions understandable without speaking the answer? | Introduced letters, picture naming and use of help |
| Rewards | Can the child explain the cushion price and tell ownership from apple quantity? | Misunderstandings and useful icon changes |
| World movement | What camera and travel behaviour makes the forest feel comfortable? | Requires a later 3D movement prototype; a still image is insufficient |

Next art work after feedback: individual character references for Eichhörnchen, Blaumeise, Biber and Maus; a geometry workbench; rhyme and story screens; an illustrated map; and approved resource/item icon families. Next content work: expand the five task pools, complete teacher review and record a child walkthrough. Do not freeze design from artwork alone.

## Source and generation record

The three PNGs were created with the built-in image_gen tool. Full final prompts are saved in [prompts.json](prompts.json); no external image references were supplied. Files are project-local and versioned, and no existing game art was overwritten. Screen controls, small SVG illustrations and layout were authored directly for this review; they are not generated screenshots.

| File | Purpose |
| --- | --- |
| characters-v1.png | Fuchs/Waldkauz model and expression reference |
| den-v1.png | Home scene concept |
| forest-v1.png | Central clearing and world scene concept |
| review.html | Editable screen compositions and disposable interaction specimens |
| prompts.json | Exact generation prompt set and tool provenance |
