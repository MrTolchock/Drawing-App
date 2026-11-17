> Current revision 10: purchases never alter the environment. No teacher testing is planned or required. Child testing happens after implementation, once the game is running. This replaces earlier pre-implementation external-review gates; internal curriculum source checks remain.

> Shared visual rule: [den-led art direction](visuals/art-direction.md). Outdoors, den and shop use 3D; learning puzzles use 2D.

> Latest interaction decisions: [Design revision 8](visuals/revisions/v8.md) supersedes earlier check-to-submit, owl-help and shop-layout proposals. The single difficulty level and curriculum requirements remain.

# Rewards, continuity and logging contract

**Status:** Proposed design values for the first playable version, 7 November 2026. Balance and usability still need review. This is a product contract for development, not implemented behaviour.

## Resources and first rewards

Every completed five-task round grants **three units of the host's resource**, regardless of retries, hints or time. One difficulty level. Award only once per round. New completed rounds can earn more; replaying a completion animation cannot. Developer-skipped rounds produce no resources in the player save.

| Host | Resource | First availability |
| --- | --- | --- |
| Eichhörnchen | Nuts | First playable |
| Blaumeise | Seeds | First playable |
| Waldkauz | Feathers | First playable |
| Biber | Logs | First playable |
| Maus | Berries | First playable |
| Hase | Carrots | Later |
| Igel | Mushrooms | Later |
| Reh | Leaves | Later |
| Fisch | Fish tokens | Later |
| Eisvogel | Pebbles | Later |

Keep nuts, berries and other wallet tokens distinct from edible inventory items: the reward bag cannot be accidentally consumed at home. All resources have pictured labels. They do not expire. Resource prices are fictional barter, not a lesson in Swiss currency.

| Shop item | Initial price | Use/ownership |
| --- | --- | --- |
| Colouring page: leaf | 2 seeds | Permanent; reusable at drawing table |
| New coloured pencils | 2 logs | Permanent extra drawing colours |
| Apple | 1 nut | One-use bag item; fox eating sequence |
| Bubble bath | 2 feathers | One-use bag item; fox bathing sequence |
| Later berry drink | 1 berry | One-use bag item; drinking sequence |

The first shop contains the first four items. Three host-resource units per five-task round remain. Free drawing/basic pencils are always available. Every initial item is affordable after one round with the relevant host. Sample preview wallet starts with 3 nuts, 3 logs, 2 feathers and 3 seeds for inspection; production starting balances remain a routine balancing choice.

No furniture, decorations, placement spots or persistent scene props are sold. Buy and Use are separate. A permanent unlock is charged once; consumables may be stocked. Use commits one decrement and opens a short skippable 4–6 second sequence; return to the same unchanged world location/camera. The bath set exists only inside its temporary scene. Skip/refresh/replay cannot double-consume or grant another reward. No upkeep meters.

## State and interruption rules

| Event | State to persist | Recovery |
| --- | --- | --- |
| Leave or refresh in a puzzle | Stable round/task IDs and content version; current arrangement, submitted answers, progress and support used | Resume exact saved task; don't generate new answers. |
| Complete task five | Completed round and reward claim in one logical save transaction | Reward credited once; optional thanks animation may replay without payout. |
| Buy an item | Resource deduction and inventory addition together | Restore both or neither; never charge without granting ownership. |
| Creative unlock | Page/palette ID and selected drawing page | Never charge twice; preserve per-page drawings when switching. |
| Use food or drink | Consumption transaction and remaining quantity | Refresh cannot duplicate consumption; replayed animation is cosmetic. |
| Update the game | Save version; migrated wallet, inventory, creative unlocks, settings, active tasks and existing drawings | Validate migration before overwriting; retain previous valid save if migration fails. |
| Storage fails | Explicit unsaved-state indication | Show «Dein Spielstand konnte nicht gespeichert werden.» Allow retry; do not promise refresh persistence. |
| Open development version | Separate development state and log flag | No mutation of ordinary player wallet, creative unlocks or task progress. |

Before migration, inventory the actual existing keys and drawings store in the current game. There are no approved mappings from legacy stars/stickers to new resources yet: preserve legacy data and propose a conversion separately. Never silently clear old progress. A stale content version must either load the compatible saved task or restart only that task with an explanation and retained completed work.

## Local gameplay log

Proposed format: a JSON export envelope with schema version, game/content versions, anonymous session identifiers, retention settings and an ordered event array. Include a content snapshot for puzzle prompts/choices or a versioned content identifier that the reviewer can resolve. Movement uses relative coordinates and area IDs, not real-world location.

| Event family | Required information |
| --- | --- |
| Session | Start/end, app version, save version, player/development flag; no real name |
| Movement | Destination, area, sampled position while moving (initial proposal: once per second), route failure and transition |
| Task | Round ID, task ID/version, competency, host, question/choices, start/resume/leave/complete |
| Answer | Submitted value or arrangement, correctness, attempt number, support already used |
| Help | Instruction replay, example, hint and answer-revealing aid |
| Timing | Active task duration; separate background, leave and pause intervals |
| Economy | Resource grant, purchase and consumption with transaction IDs and before/after quantities |
| Home/save | Creative unlock, drawing-page selection, animation use/skip, save/load/migration failure; no drawing image embedded in the log |
| Development | Task/round skip; explicitly excluded from child correctness statistics |

Example event (illustrative values):

```json
{
  "event": "answer_submitted",
  "sessionId": "example-session-01",
  "roundId": "example-round-01",
  "taskId": "NUM-01-sample-02",
  "contentVersion": "design-draft-1",
  "host": "Eichhörnchen",
  "competency": "Numbers and arithmetic",
  "prompt": { "objectCount": 4, "choices": [3, 4, 5] },
  "answer": 5,
  "correct": false,
  "attempt": 1,
  "activeMilliseconds": 12000,
  "supportUsed": [],
  "development": false
}
```

Keep logs local. Proposed retention: the most recent seven days, capped at 10,000 events; prune oldest events first and report the export's actual retained time range and any truncation. Post-implementation child testing may change these values. No teacher testing is planned. No automatic AI upload. Adult settings explains collection and offers JSON export and separate log deletion without deleting progress. A save backup and a gameplay log are different files.

## Development verification scenarios

Check that refresh before/after a reward never duplicates it; purchase interruption restores matching wallet and inventory; changing page/colour preserves each drawing; consuming a treat leaves the environment unchanged; interrupted puzzles retain answers and help state; background time is excluded from active task time; log export remains usable after pruning; development skips cannot earn ordinary rewards; save migrations preserve old drawings and owned objects. Verify on an actual target iPad before claiming support.

## Version-8 reward-screen specimen

The fifth task credits three units exactly once in the specimen state. A pictured transfer into the bag acknowledges the reward; the credit cannot be repeated by revisiting the reward screen. The screen offers forest/shop destinations after acknowledgement. Seeds and berries now join the visible wallet when earned, each on its own token row. The compact dock supports the small sample wallet; review grouping or scrolling for larger balances before production.

Adult example/retry/success/reward previews do not increment scores or issue resources. This prototype has no production save, migration or transaction durability; refresh resets it. Production must implement the atomic state and replay guarantees above.

