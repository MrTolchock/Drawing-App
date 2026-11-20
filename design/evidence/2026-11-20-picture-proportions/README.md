# Original picture proportions — 9.4.13

Real shared Rätsel renderer, Chromium with touch input, reduced motion, disposable storage and intercepted review APIs. No real editorial records were read or written. The before captures load the two original stylesheets from Git release `02b7c53`; after captures load the corrected stylesheets. Task data and source artwork are identical, with deterministic answer ordering.

| Ansicht | Vorher | Nachher |
| --- | --- | --- |
| Biber, drei verschiedene Waldgegenstände, 1024 × 650 | [Gestauchte Reihenbilder](before-beaver.png) | [Proportionale Reihenbilder](after-beaver.png) |
| Zeitliche Abfolgen ordnen, 1024 × 650 | [Verzerrtes Doppelbild](before-story.png) | [Zwei unverzerrte Bilder](after-story.png) |
| Bereits platzierte Karten, 1024 × 650 | — | [Gespeicherter Zustand](after-story-placed.png) |
| Biber auf Telefon, 390 × 844 | — | [Proportionale Bilder](after-beaver-phone.png) |

`tests/ipad-puzzle-layout-browser.cjs` checks every finite task and relevant saved state at 1024 × 650, 1024 × 700, 1080 × 810, 1280 × 820, 768 × 980 and 390 × 844: 4,655 iPad views without scrolling plus 931 phone views with original picture proportions. This includes memory reveal, distributed berries, partially/fully placed story cards and completed mirror patterns. Square atlas cells and portraits stay square; paired images fit inside their shared picture area. The new proportion assertion fails against the original CSS.
