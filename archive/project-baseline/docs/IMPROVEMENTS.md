# A single living forest — 6.3

The next gameplay update is documented in [Gameplay — 6.4](GAMEPLAY.md): editable construction and sharing games, saved discovery tours, programmed routes and companions walking through the forest. This page records the preceding navigation and story update.

The forest, games book and activities now share the same five neighbours and visual progress. There is one library, with all games and drawing tools accessible through its pictured neighbour filters. Old `hub` navigation resolves to `forest-book`. Both the forest and book expose a working tap-based settings button; the adult gate remains.

## Activity changes

- Zählgarten begins with visible ladybirds, supports reversible counting marks and introduces an explicitly empty garden in the fifth question.
- Znüni-Rechenfreunde combines the former arithmetic games. Children can tap apples to move them between the basket/fox and fox/hare, while the complete equation remains visible. Later tasks introduce a related known sum. Old Rechenfreunde routing opens this merged activity. Old stars are preserved.
- Naturdetektive presents literal feature drawings (feather, shell, fin, six legs, spines) or pictured animal cues and fully pictured choices. Speaker buttons repeat the question and hints.
- Sternenrakete has a pictured fill/start guide, a visible seat meter and a successful launch animation.
- Waldpicknick shows the complete berry supply, two animal plates and an undo control. Each tap transfers exactly one berry. The answer requires the whole supply to be shared equally.
- Zauberspiegel shows equal groups across a mirror axis and their addition. Spiegelmosaik also has a small correctly reflected worked example.
- Formenwerkstatt always supplies a pictured target, with marked corners in stage two and rotated choices in stage three.
- Reimzirkus uses concrete words, matching original drawings or matching atlas pictures, and separate word-listen controls. A listen control does not submit an answer.
- Was kommt dann? uses editable picture cards. Touch/mouse dragging swaps places; tapping two cards also swaps them; arrow keys move a focused card. Leaving or redrawing removes any drag ghost. The arrangement can be checked and retried without restarting.
- Waldumfrage displays aligned horizontal vote rows, a one-paw/one-vote legend, illustrated question targets and reversible count marks.
- Zahlenwege shows the initial 1, then asks the child to find the next number. Only an explicitly requested hint reveals it and temporarily highlights its location. There are no automatic idle hints.
- Creative missions and their drawing reminders are removed from runtime scripts and offline assets. The colouring book, free drawing and saved pictures remain.
- Reading activities are retained.

## Story and rewards

The Heart Tree is bare in a new story. Exactly the nine authored contributions restore nine clusters of leaves in both the actual 3D tree and its UI picture. Unknown future contribution IDs and optional practice cannot increase growth. Existing completed endings show a restored tree. Leaf clusters grow into place unless reduced motion is requested.

The opening explains why the tree is bare and how helping restores it. Character requests and thanks explain what a repair means for their friendship. The first bridge return includes a persistent Biber/Hase reunion panel rather than a short timed line. Residents react visibly while their dialogue is active.

All short learning/adventure/expedition rounds use five leaves, a small correct-answer response and a full end celebration with the same pictured friend and navigation. Story completions also show tree growth. Existing reward keys and replay-safe star accounting are retained, including the shared story/practice puzzle-family rewards.

The portrait camera follows closer to the fox and resets its tree-introduction framing when play begins. Landscape framing stays wide.

## Verification

Content checks include arithmetic bounds, related-sum correctness, concrete picture coverage for all rhyme choices, picture cues for nature questions, removal of creative missions, and growth derived exclusively from authored story contributions. Existing tests still cover all 72 supported story orders, save recovery, offline assets, reading and handwriting content, routes, and the optional timer.

`tests/play-browser.cjs` covers 255 tasks over all three stages of 17 revised activities, real touch drag/swap, retries, individual rhyme pronunciation requests, settings through the parent gate, merged arithmetic routing, replay rewards, unchanged story growth during practice, responsive layouts and offline persistence. `tests/play-layout-browser.cjs` checks ten revised games at 320, 390, 820 and 844px widths, settings refresh and offline library reload. Existing memory, story and reading/browser suites cover their retained families. Screenshots are written to `/tmp`, not committed as runtime assets.

Speech uses installed device voices. Browser automation checks the requested words and narration wiring, not audio quality or the availability of offline German speech. Chromium touch emulation does not establish physical Safari compatibility.
