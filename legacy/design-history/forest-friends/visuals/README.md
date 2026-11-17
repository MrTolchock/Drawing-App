# Visual review — current revision 10

Open [review.html](review.html), [versioned revision 10](review-v10.html) or the [hosted review](https://forest-friends-design-review.andreas-itten.chatgpt.site/). See [revision-10 decisions](revisions/v10.md).

## Current behaviour

- Fixed den/forest art and picture-led navigation; no purchased furniture or placement mode.
- Reading: Maus words, Blaumeise written rhymes, Waldkauz three-word sentences with two pictures. Mathematics: counting and missing shapes.
- Shop: colouring page, extra coloured pencils, apple and bubble bath. Buy and Use are separate actions.
- Pages/colours unlock only at the drawing table. Free drawing/basic colours remain available; drawings are kept separately per page in the tab.
- Apple/bath consumes one bag item and plays a short skippable illustrated sequence, then returns to the same environment.
- Sample wallet includes 3 nuts, 3 logs, 2 feathers and 3 seeds to inspect all four products.

The preview resets on refresh. Production saves, final 3D animation and the fully explorable running game are implementation work.

## Dependencies and baseline

Current HTML uses review-v8.js/css, review-v9.js/css, review-v10.js/css, preserved scene assets and repository fonts. Earlier versioned HTML, original artwork, screenshots and integrity manifest remain untouched. See [baseline](baseline.md), [art direction](art-direction.md) and [generation provenance](prompts.json).

## Verification and implementation

Browser checks: page purchase/ownership, page selection and switching, extra pencil colours, both consumable sequences, single inventory decrement, return to the same shop, and bag-based apple use. JavaScript syntax passed. Physical touch/small-screen testing and durable saves are not claimed.

No teacher testing is planned or required. The user will test with a child after implementation, once the game is running. Internal curriculum checks remain. Switch to Codex after this revision is pushed and implement the complete playable loop.
