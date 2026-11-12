# Waldspiele menu and painted illustrations

Build: app/cache 8.2.0, 8 November 2026, based on `44574ce` (the repaired den and letter adventure). Chromium with reduced motion and software world rendering; 1024 × 900 and 390 × 844 CSS pixels.

This milestone implements the owner's menu feedback: remove Freies Malen and Meine bisherigen Blätter, eliminate the visible `null`, match menu pictures to Waldumfrage, Zahlenwege and Naturdetektive, and remove the separate Spiele aus dem Wald section while retaining its puzzles.

| View | Evidence | Comparison |
| --- | --- | --- |
| All puzzles | [Tablet](menu-all-1024.png), [phone](menu-all-390.png) | All 26 puzzles share one grid. The five friend filters, introduction and back button use painted animals instead of the mixed dimensional portraits in the [restored-library milestone](../restored-library/library-1024.png). The original blocks, apple, hedgehog and other matching artwork remain the style reference. |
| Previously mismatched icons | [Tablet](menu-details-1024.png), [phone](menu-details-390.png) | Beerenvergleich, Nachbarhäuser and Spiegelmosaik now have textured watercolour illustrations. Zauberspiegel uses a matching painted wand. The new squirrel and blue tit match the existing painted fox, owl, beaver and mouse. |
| Malatelier | [Tablet](menu-atelier-1024.png), [phone](menu-atelier-390.png) | Only Ausmalen and Meine Bilder remain. No empty section or literal null/undefined appears. Phone filters wrap, cards fit the viewport, and saved drawings never restore the removed shortcut. |

The six supplemental illustrations are isolated on the transparent 3 × 2 `assets/waldatelier/menu.png` sheet. The shared illustration renderer supports that layout alongside the existing 4 × 4 sheets. Individual berries inside scored puzzles retain their one-counter meaning; menu art does not change questions or answers. The original artwork, frozen visual baseline, den, letter flow and gallery records remain intact. All 14 frozen reference files pass the integrity check.

Validation: all 15 model/content suites; the complete library browser suite (21 original entries, five newer rounds, every host filter, fixed content level, completion/return paths, both atelier cards, legacy free-editor persistence, preserved vector strokes, offline menu artwork and historical settings); the den browser suite (direct colouring, six outline pages, gallery save/resume, tablet/phone layouts and offline picture restoration). An additional visual capture pass checked a painted background on all 28 menu cards. The app and service-worker versions are bumped and the new sheet is installed offline.
