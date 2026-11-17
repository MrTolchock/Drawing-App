# First saved playable loop — comparison

**Build:** Farbtupf 7.0.0, 7 November 2026. This directory is a new implementation record; the frozen v1/v2 material and its integrity manifest have not been changed. Source hashes in `manifest.json` identify the tested runtime independently of this documentation commit.

**Reference:** [preserved v2 baseline](../../baseline.md), [den master](../../den-v1.png), with [revision 10](../../revisions/v10.md) superseding furniture purchases and earlier puzzle-confirmation rules.

## Evidence

Desktop viewport: 1024 × 900 CSS pixels. Compact viewport: 390 × 844. Chrome/Chromium on Linux with SwiftShader; these are not iPad results. `home-full-*` and `forest-full-*` use the ordinary rendering path and full CSS-resolution screenshots. Other captures come from the full real-control browser suite with `?software=1` (half-resolution 3D raster, no shadow maps). Puzzle/UI overlays still render at CSS resolution. Screenshots show the actual new game, not the disposable design review.

| State | Implementation capture | Result against applicable baseline |
| --- | --- | --- |
| Home | [Desktop](home-full-1024.jpg), [compact](home-full-390.jpg) | Functional pictured doorway, bed and table; green-necked orange fox; warm wood/root interior. **Needs art work:** room remains a visible cutaway, with simpler root walls, model proportions and materials than the den master. Composition, texture finish and foliage detail are not a visual match yet. |
| Forest | [Full raster](forest-full-1024.jpg), [walking state](forest-1024.jpg) | Real solid 3D geometry, central home/shop trees, five freely available friends, sandy routes, stream and permanent boardwalk. **Needs art work:** flat walkable clearing, simpler tree crowns and character detail, less layered terrain than the rich forest reference. The first loop intentionally stays compact; later regions are not implemented. |
| Map | [Pictured map](map-1024.jpg) | Pictured friends/destinations set walking routes, not teleportation. Destination ring/arrow, keyboard walking and held controls are functional. Child understanding and camera comfort remain untested. |
| Counting | [Desktop](count-1024.jpg), [compact](count-390.jpg) | Flat nuts, shuffled numerals, five-task progress and 48px-or-larger controls in the checked compact state. Quantity differs from the frozen seven-nut fixture because the real round selects fresh tasks. Direct submission replaces the historical check button. |
| Example | [Separate example](demo-1024.jpg) | Three nuts and a highlighted correct example, with replayable instruction; no scored answer is consumed. First visits show examples. Return arrow instruction is spoken. |
| Reading | [Word](reading-1024.jpg), [rhyme](rhyme-1024.jpg), [sentence](sentence-1024.jpg) | Persistent written targets, picture choices, direct submission and automatic feedback continuation. Reading instructions exclude the scored target. New hand-authored SVG illustrations follow the warm paper palette. **Needs child observation:** pose/picture naming and rhyme vocabulary recognition. |
| Shapes | [Missing form](shape-1024.jpg) | A 2D object with a basic missing gap; a correct choice fills it. Replaces the withdrawn coordinate-placement puzzle. Recognition warm-up only. |
| Reward | [Three-token transfer](reward-1024.jpg) | Reward is already durably credited before acknowledgement. Return/replay cannot credit it again. Reduced motion disables token flight. |
| Shop | [Fixed shelves](shop-1024.jpg) | Real 3D interior and goods; separate purchase card shows token price, wallet and explicit confirmation. Page/pencil ownership and consumables replace the historical cushion/placement design. No scene placement system exists. |
| Apple/bath | [Apple](apple-1024.jpg), [bath](bath-1024.jpg) | Runtime articulated fox/arm/head animation and temporary props, not a still-background animation study. Consume once, skip or refresh safely, then restore area/position. **Needs art/device checks:** acting polish, depth/camera framing and physical-device frame rate. |
| Drawing | [Saved drawing table](drawing-1024.jpg) | Free/purchased page selector, nine unlocked colours, separate per-page strokes and undo. Old IndexedDB pictures remain available through the original game. |

## Functional verification

The model suite checks transaction failure/rollback, exact interrupted snapshots, once-only rewards, separate host rounds, fresh sets, permanent/consumable ownership, per-page drawings, saved settings, corrupt/unknown-schema refusal, backup recovery, temporary storage recovery, conflicting tabs, local log pruning and development isolation.

The browser suite completes all five rounds using actual answer controls, retries/hints, refreshes at puzzle/reward/consumption boundaries, buys all four products, draws on both pages, skips a bath, relaunches offline and checks legacy IndexedDB drawings. A separate full-raster capture checks the compact den's three object targets remain onscreen and at least 58px square. The retained Heart Tree opens through its explicit entry point.

This is a **functional playable-loop milestone**. It does not mark the den-master visual rubric complete, certify physical iPad performance, establish independent reading attainment or replace the user's planned post-implementation child session. No teacher test is a dependency. Further model/material polish and physical-device/child observations should be tracked against this record without altering the original references.

The final [sentence-pool contact sheet](sentence-pool.jpg) renders all 15 authored action pairs after a narrow illustration correction: sleeping animals retain identifying ears, the bird has a blue-tit face/belly, duck flight/swimming retain the same silhouette, and dogs have hanging ears. Individual walkthrough captures precede that static-picture correction; their layout and economy behaviour are unchanged. The pool sheet is an internal art inspection view, not a game screen or child-test result.

Final normal-motion check: apple playback completed in **5,049 ms** in the isolated Chromium fixture; bath skip consumed once; bed sleep returned without economy changes. All 13 model/content suites passed. The complete real-control loop suite also passed with trunk-avoiding routes, adult audio controls and JSON log export.
