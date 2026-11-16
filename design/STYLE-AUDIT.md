# Current visual consistency audit

Current game art: **Waldpost 9.3.80**. Current generation contract: **`waldpost-watercolour-pencil-v1`**, defined in the [canonical style kit](illustrations/STYLE.md). All **21** forward generation/editing requests include the same shared block and fixed animal/object reference pixels.

## Drawn map and common UI cast

The owner approved the simplified, flat top-down version 2 map for the game. Its [source and preparation](artwork/world-map.json) preserve the approved painting; [map calibration](artwork/world-map-layout.json) ties 24 world landmarks to painting coordinates through 42 non-folding triangles. Actual walking routes still use the original world destinations. The current Fuchs marker uses the same continuous calibration.

Thirteen named destination pins include all puzzle friends, the den and Steinbock. Each has an independent 64 px touch target and a visible name. Fixed display centres leave space between nearby pins; fine leader lines indicate the actual projected location. The map pans on small screens and retains readable animals. Portraits, names and leader lines do not intercept the button's pointer handling; the position marker sits behind destination buttons. Touch and keyboard routes are checked in the real game. Steinbock remains a non-puzzle neighbour.

All UI animals use the [shared painted cast](artwork/LETTER-FRIENDS.md): invitation letters, puzzle context, companions, map pins, menus, review/gallery cards, celebration and game-over. Fourteen approved friends and one matching sleeping Fuchs occupy a transparent four-by-four atlas with one empty cell. Their composition/source records are retained. The freely explorable world and den fox retain their real-time 3D models. Model-portrait and geometry-map tools now produce development references in `/tmp`, preventing accidental overwrites of painted runtime art.

The simpler navigation arrow, map/letter/settings symbols and approved den/door icons remain in their established families. The 235 learning illustrations and their atlas cells, task answers, competence, difficulty and all 953 iteration definitions are unchanged.

## Review and verification

The host portraits changed on every puzzle, so all **31** presentation revisions are new and require adult visual review. Existing approvals/comments remain history in the separate review ledger; this deployment neither edits editorial decisions nor grants approvals. Saved device data and letter/puzzle IDs remain intact.

The model suite, including calibration/style/provenance guards, passes **121 checks**. Real-browser design checks cover all 31 puzzles at tablet and phone sizes. The map suite activates every one of the thirteen pins by touch at tablet, phone and landscape sizes, verifies separate unobstructed hit areas and actual world routes, and checks keyboard activation. Navigation, invitation/layout/image-library and installed-app update checks cover their existing flows. The [development guide](../docs/DEVELOPMENT.md) lists commands.

Historical original requests and source/reference hashes remain preserved. A generation record's `preservedAt` identifies a byte-exact input copy when its original runtime URL is later updated; the actual tool arguments remain unchanged. CI checks those preserved pixels separately from current forward prompts. All **775** protected archived originals retain their bytes. Superseded styles and archived working instructions are provenance only; the current contract and generated prompts are the authority for new requests.
