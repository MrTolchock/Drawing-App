# Balanced puzzle layout — 20 November 2026

Captured from the actual shared puzzle renderer using disposable storage and intercepted review APIs. No real child saves or editorial records were changed.

| Capture | Viewport | Purpose |
| --- | --- | --- |
| [Before: Nest](before-vowels.png) | 1080 × 790 | The original task and answers occupy only the upper part of the paper. |
| [After: Nest, landscape](vowels-landscape.png) | 1080 × 790 | The panel uses the page height; a larger square illustration and matching word/answer type sit between the prompt and lower answers. No duplicate 1/5 count. |
| [After: Nest, portrait](vowels-portrait.png) | 810 × 1060 | The same layout uses the taller page without scrolling. |
| [Four-friend distribution](picnic-landscape.png) | 1080 × 790 | Dense tasks keep their full group widths, square illustrations and visible controls. |

The 9th-generation iPad has a 1080 × 810 CSS-pixel landscape screen and an 810 × 1080 portrait screen. These captures reserve 20 px for system chrome. Automated checks also include a 1080 × 695 Safari-sized content viewport, 1024 × 650/700, 1080 × 810, 1280 × 820, 768 × 980, and a 390 × 844 phone. The layout uses the actual available page height, rather than a fixed screen-height assumption.

`tests/ipad-puzzle-layout-browser.cjs` covers all 849 finite tasks, both memory phases, filled/partially filled distribution and sequence states, mirror work, all original illustration proportions, positive artwork dimensions, page bounds, completion, inline return navigation, balanced task/answer placement, one text family and three primary text sizes. `tests/puzzle-feedback-browser.cjs` exercises actual mouse/touch/keyboard input and partial-work persistence. The compatibility checks preserve decisions only for identical tasks across the recorded presentation pairs.

These are Chromium viewport checks. Physical iPad Safari remains a device verification step.

Passed: 8,874 task/state layouts (7,888 tablet with no scrolling, 986 phone); the 24-puzzle design suite; native input/feedback/save restoration; shared navigation; adult review; model and review compatibility checks; canonical style, map, image library, generator handoff, design/offline and whitespace checks.
