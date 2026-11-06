# Waldatelier

Selected visual direction: [01, Waldatelier](01-waldatelier.png), watercolour storybook, chosen by the user.

[Open the implementation review](index.html) for screenshots of the actual app. [Browser verification record](VERIFICATION.md).

The app uses one warm ivory/forest-green interface, original watercolour artwork, a shared sepia tool-icon family, and readable Andika text. Existing painting, learning, tracing, progress and storage behaviour is retained.

Generated artwork uses the approved mockup as a style reference. The generation briefs are recorded in `prompts.json`; production images live in `assets/waldatelier/`. The character, subject illustrations and artwork sheets are shared by home, exercises, reading, stamps and rewards.

Nine transparent 4 × 4 artwork sheets contain 144 original illustrations. Stable content identifiers map reading and handwriting nouns to the corresponding subject. A single berry counter remains one berry; geometric answers keep their exact shape. Canvas stamps draw from the same sheets as the interface. Stamp choices are curated to matching subjects rather than substituting another animal or food. The album still has 42 slots and the same unlock thresholds.

`css/waldatelier.css` is the shared theme. `js/ui/waldatelier-icons.js` replaces the existing utility symbols while preserving their IDs. `js/art/waldatelier.js` adds editable vector colouring pages with closed paint regions and labels for all five paint modes. Existing handwriting model paths, paint colours, localStorage keys and IndexedDB names are retained.

`app-icon.png` is the original generated icon. The PNG install sizes are mechanical exports, and the maskable variant has extra safe-area padding. The SVG favicon embeds the same artwork.

The production artwork, icons, scripts and theme are cached for offline use. Design boards, original icon and test pages are excluded from the offline install. Production watercolour sheets and landscape total approximately 20 MB before browser caching.

Validation uses the 44 Node content/asset checks, actual app flows through the browser plugin, the phone/tablet preview, and the separate paint-region validation page. Screenshots and the browser verification record are stored alongside these notes. Physical iPad/Safari testing remains a separate release check.
