# Parent-controlled letter journeys

12 November 2026 · app 9.2.1 · `feat/puzzle-blueprint-review` · main unchanged.

The existing illustrated den, letter, world, puzzle page, progress leaves and celebration remain. The child toolbar loses Waldspiele and the shelf book loses its interactive hotspot. The complete puzzle gallery/sign-off workbench moves to adult Settings. The optional timer is removed from initialization, scripts, styles, Settings and offline assets; its earlier source/tests are archived and dormant preferences are preserved.

Parents choose 1–50 letters (default 3). A whole five-iteration puzzle spends one letter. Only the character on the current invitation can grant a normal puzzle entry. New sessions start inside the den; reopening a session retains its quota and invitation. After the last puzzle, the guide targets home, the courier stops offering letters, arrival starts sleep, and a saved end screen offers only adult Settings. A parent must start another journey.

## Screenshots

- [Parent choice, tablet](settings-tablet.png) and [phone](settings-phone.png).
- [Home target after the last puzzle](return-home.png).
- [Sleeping game over, tablet](game-over-tablet.png) and [phone](game-over-phone.png).

Tablet 1080 × 810; phone 390 × 844, Chromium touch emulation and reduced motion. The scene retains its intentional clipped den-background overscan; the document and end card fit the phone viewport.

## Checks

- All 19 active Node model/content/save suites pass, including session limits 1/2/3/11/50, invalid limits, persisted phases, old-save migration, immutable in-flight limits, duplicate completions and failed writes.
- `tests/letter-sessions-browser.cjs` passes actual parent controls, gated gallery previews, denied non-invited character/direct-route access, two invitations/ten correct answers, the courier, saved quota across reload, the real final home-route callback, sleep, game over, Escape/direct-route/offline restart blocking, parent-only restart at the den, and a separate five-glyph letter consuming one allowance.
- The updated review browser regression passes all 34 phone/tablet previews, all 36 addition iterations and every stroke of all 58 letter forms and 30 digit iterations (124 checked solutions), approval/flagging, backups, isolated child state, sound/mute, five-task preview celebration and offline review. Pointer projection uses the current SVG screen transform, including entry scaling.
- Generated catalogue/revision checks pass. All 14 frozen baseline files remain intact.

Earlier browser checks that depended on a free-play child gallery, an unlimited letter loop or the timer are preserved in `archive/retired-free-play-tests/` and `archive/retired-timer/`; current script aliases point at the new acceptance suites.

No editorial approvals are shipped. The existing per-puzzle/per-iteration review requirement stays in force. Physical iPad 9 Safari/PWA, touch/stylus feel and content suitability still need the owner's review. This feature branch has not been merged or published to main/GitHub Pages.
