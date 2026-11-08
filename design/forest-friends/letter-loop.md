# Letter loop: interaction and save contract

Current design, 8 November 2026. This supplements the [Forest friends blueprint](blueprint-v2.md) and supersedes older economy-based progression diagrams. Implementation verification is recorded separately.

| Saved phase | Player sees | Action | Next phase |
| --- | --- | --- | --- |
| First unopened letter | Fuchs inside the den, closed door/mail lid and delivered envelope | Click the envelope and view the recipient portrait | Travel to the pictured friend |
| Travel / invited puzzle | The saved invitation and an outdoor arrow toward its friend | Reach that friend and complete an assigned old or new puzzle | Find the nearby mailman |
| Find mailman | Hase very close to Fuchs; arrow points to him | Click the postal rabbit and open his next pictured letter | Travel to another friend |

The first arrival animates through the mail lid, but an unopened envelope persists indefinitely and remains available with reduced motion. Opening shows decorative unreadable marks and one clear character portrait. A letter is not itself a reading puzzle.

A completed invited puzzle advances the letter once; help and retries do not penalize the child. Leaving, refreshing, unrelated practice, or replaying completion must not fabricate a delivery or skip a recipient. The next host differs from the last one and the sequence revisits all five friends. The overview still contains all old/new puzzles and the free Malatelier.

The arrow updates continuously in the 3D world. It guides a ground click/tap; it is not a movement control and does not teleport or auto-walk the fox. The mailman's route stays on walkable terrain. Delivery staging puts him very near the fox and keeps him easy to approach. Hase remains a roaming postal NPC rather than a puzzle host.

On relaunch Fuchs starts in the den and can inspect the saved invitation. Going outside restores the correct target, including a pending mailman handover. Old drawings, puzzle snapshots and audio choices survive migration. Old wallet/inventory fields may remain dormant for compatibility, but no shop, payout or purchase is part of this flow.

Required checks: unopened/reopened letter, first old and new assigned puzzle, abandoned puzzle, retry/help, completion once, nearby reachable mailman, next recipient, repeated mailman click, refresh in every phase, saved old data, concurrent-tab conflict, offline relaunch, reduced motion and phone/tablet layouts.
