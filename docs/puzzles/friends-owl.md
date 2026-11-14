# Lies und zeig

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-owl`
- Host: owl
- Related competence: **D.2.A.1.b; D.2.B.1.b** — Kurze Sätze verstehen
- Difficulty: Ein bis zwei kurze Sätze über ein Tier; vertraute Tierverben
- Pool: 25 explicit iterations; a round selects five.
- Review: solve every unconfirmed iteration to approve it; × rejects with an optional note. The final celebration approves the puzzle only when all iterations passed. Exact revisions gate release; changes require review again.

## Mapping to the blueprint

| Contract | Implementation |
| --- | --- |
| Picture roles | Drawn woodland subjects; model-rendered host/companions; SVG geometry and tracing |
| Shared page | Waldbuch paper, host, Andika, five progress leaves |
| Child access | Only the character on the current letter; parent-controlled journey limit |
| Guidance | One optional rule explanation; no hints or next-task button |
| Sound | Enabled button clicks, success/retry, mute respected |
| Round | Five distinct sampled iterations; saved questions/partial work |
| Ending | 900 ms correct feedback, then 2.2 s celebration; reduced motion |
| Review | Production-sized open-item queue; solve to approve, × to reject, final celebration; puzzle-level speech and revision gate |

## Every iteration

| Stable iteration ID | Content / configuration | Expected answer or solution |
| --- | --- | --- |
| `friends-owl/sentence-0` | Die Maus sitzt. — Die Maus sitzt. | "mouse-sit" |
| `friends-owl/sentence-1` | Die Maus rennt. — Die Maus rennt. | "mouse-run" |
| `friends-owl/sentence-2` | Der Vogel fliegt. — Der Vogel fliegt. | "bird-fly" |
| `friends-owl/sentence-3` | Der Vogel sitzt. — Der Vogel sitzt. | "bird-sit" |
| `friends-owl/sentence-4` | Die Maus schläft. — Die Maus schläft. | "mouse-sleep" |
| `friends-owl/sentence-5` | Der Hase rennt. — Der Hase rennt. | "hare-run" |
| `friends-owl/sentence-6` | Der Hase sitzt. — Der Hase sitzt. | "hare-sit" |
| `friends-owl/sentence-7` | Der Fuchs schläft. — Der Fuchs schläft. | "fox-sleep" |
| `friends-owl/sentence-8` | Der Fuchs rennt. — Der Fuchs rennt. | "fox-run" |
| `friends-owl/sentence-9` | Die Katze schläft. — Die Katze schläft. | "cat-sleep" |
| `friends-owl/sentence-10` | Die Katze sitzt. — Die Katze sitzt. | "cat-sit" |
| `friends-owl/sentence-11` | Der Hund rennt. — Der Hund rennt. | "dog-run" |
| `friends-owl/sentence-12` | Der Hund schläft. — Der Hund schläft. | "dog-sleep" |
| `friends-owl/sentence-13` | Die Ente schwimmt. — Die Ente schwimmt. | "duck-swim" |
| `friends-owl/sentence-14` | Die Ente fliegt. — Die Ente fliegt. | "duck-fly" |
| `friends-owl/pair-0` | Das ist eine Maus. Sie sitzt. — Das ist eine Maus. Sie sitzt. | "mouse-sit" |
| `friends-owl/pair-1` | Das ist ein Hase. Er rennt. — Das ist ein Hase. Er rennt. | "hare-run" |
| `friends-owl/pair-2` | Das ist eine Katze. Sie sitzt. — Das ist eine Katze. Sie sitzt. | "cat-sit" |
| `friends-owl/pair-3` | Das ist eine Ente. Sie fliegt. — Das ist eine Ente. Sie fliegt. | "duck-fly" |
| `friends-owl/pair-4` | Das ist ein Vogel. Er sitzt. — Das ist ein Vogel. Er sitzt. | "bird-sit" |
| `friends-owl/pair-5` | Das ist ein Hund. Er schläft. — Das ist ein Hund. Er schläft. | "dog-sleep" |
| `friends-owl/pair-6` | Das ist ein Fuchs. Er rennt. — Das ist ein Fuchs. Er rennt. | "fox-run" |
| `friends-owl/pair-7` | Das ist ein Hase. Er sitzt. — Das ist ein Hase. Er sitzt. | "hare-sit" |
| `friends-owl/pair-8` | Das ist eine Maus. Sie rennt. — Das ist eine Maus. Sie rennt. | "mouse-run" |
| `friends-owl/pair-9` | Das ist eine Katze. Sie schläft. — Das ist eine Katze. Sie schläft. | "cat-sleep" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-owl/sentence-0",
    "label": "Die Maus sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Maus sitzt.",
      "answer": "mouse-sit",
      "choices": [
        "mouse-sit",
        "mouse-run"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-1",
    "label": "Die Maus rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Maus rennt.",
      "answer": "mouse-run",
      "choices": [
        "mouse-run",
        "mouse-sit"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-2",
    "label": "Der Vogel fliegt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Vogel fliegt.",
      "answer": "bird-fly",
      "choices": [
        "bird-fly",
        "bird-sit"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-3",
    "label": "Der Vogel sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Vogel sitzt.",
      "answer": "bird-sit",
      "choices": [
        "bird-sit",
        "bird-fly"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-4",
    "label": "Die Maus schläft.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Maus schläft.",
      "answer": "mouse-sleep",
      "choices": [
        "mouse-sleep",
        "mouse-sit",
        "mouse-run"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-5",
    "label": "Der Hase rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Hase rennt.",
      "answer": "hare-run",
      "choices": [
        "hare-run",
        "hare-sit"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-6",
    "label": "Der Hase sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Hase sitzt.",
      "answer": "hare-sit",
      "choices": [
        "hare-sit",
        "hare-run"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-7",
    "label": "Der Fuchs schläft.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Fuchs schläft.",
      "answer": "fox-sleep",
      "choices": [
        "fox-sleep",
        "fox-run"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-8",
    "label": "Der Fuchs rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Fuchs rennt.",
      "answer": "fox-run",
      "choices": [
        "fox-run",
        "fox-sleep"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-9",
    "label": "Die Katze schläft.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Katze schläft.",
      "answer": "cat-sleep",
      "choices": [
        "cat-sleep",
        "cat-sit"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-10",
    "label": "Die Katze sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Katze sitzt.",
      "answer": "cat-sit",
      "choices": [
        "cat-sit",
        "cat-sleep"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-11",
    "label": "Der Hund rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Hund rennt.",
      "answer": "dog-run",
      "choices": [
        "dog-run",
        "dog-sleep"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-12",
    "label": "Der Hund schläft.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Der Hund schläft.",
      "answer": "dog-sleep",
      "choices": [
        "dog-sleep",
        "dog-run"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-13",
    "label": "Die Ente schwimmt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Ente schwimmt.",
      "answer": "duck-swim",
      "choices": [
        "duck-swim",
        "duck-fly"
      ]
    }
  },
  {
    "id": "friends-owl/sentence-14",
    "label": "Die Ente fliegt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Satz?",
      "text": "Die Ente fliegt.",
      "answer": "duck-fly",
      "choices": [
        "duck-fly",
        "duck-swim"
      ]
    }
  },
  {
    "id": "friends-owl/pair-0",
    "label": "Das ist eine Maus. Sie sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist eine Maus. Sie sitzt.",
      "answer": "mouse-sit",
      "choices": [
        "mouse-sit",
        "mouse-run",
        "bird-sit"
      ]
    }
  },
  {
    "id": "friends-owl/pair-1",
    "label": "Das ist ein Hase. Er rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist ein Hase. Er rennt.",
      "answer": "hare-run",
      "choices": [
        "hare-run",
        "hare-sit",
        "fox-run"
      ]
    }
  },
  {
    "id": "friends-owl/pair-2",
    "label": "Das ist eine Katze. Sie sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist eine Katze. Sie sitzt.",
      "answer": "cat-sit",
      "choices": [
        "cat-sit",
        "cat-sleep",
        "mouse-sit"
      ]
    }
  },
  {
    "id": "friends-owl/pair-3",
    "label": "Das ist eine Ente. Sie fliegt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist eine Ente. Sie fliegt.",
      "answer": "duck-fly",
      "choices": [
        "duck-fly",
        "duck-swim",
        "bird-fly"
      ]
    }
  },
  {
    "id": "friends-owl/pair-4",
    "label": "Das ist ein Vogel. Er sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist ein Vogel. Er sitzt.",
      "answer": "bird-sit",
      "choices": [
        "bird-sit",
        "bird-fly",
        "hare-sit"
      ]
    }
  },
  {
    "id": "friends-owl/pair-5",
    "label": "Das ist ein Hund. Er schläft.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist ein Hund. Er schläft.",
      "answer": "dog-sleep",
      "choices": [
        "dog-sleep",
        "dog-run",
        "fox-sleep"
      ]
    }
  },
  {
    "id": "friends-owl/pair-6",
    "label": "Das ist ein Fuchs. Er rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist ein Fuchs. Er rennt.",
      "answer": "fox-run",
      "choices": [
        "fox-run",
        "fox-sleep",
        "hare-run"
      ]
    }
  },
  {
    "id": "friends-owl/pair-7",
    "label": "Das ist ein Hase. Er sitzt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist ein Hase. Er sitzt.",
      "answer": "hare-sit",
      "choices": [
        "hare-sit",
        "hare-run",
        "cat-sit"
      ]
    }
  },
  {
    "id": "friends-owl/pair-8",
    "label": "Das ist eine Maus. Sie rennt.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist eine Maus. Sie rennt.",
      "answer": "mouse-run",
      "choices": [
        "mouse-run",
        "mouse-sit",
        "dog-run"
      ]
    }
  },
  {
    "id": "friends-owl/pair-9",
    "label": "Das ist eine Katze. Sie schläft.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zu beiden Sätzen?",
      "text": "Das ist eine Katze. Sie schläft.",
      "answer": "cat-sleep",
      "choices": [
        "cat-sleep",
        "cat-sit",
        "mouse-sleep"
      ]
    }
  }
]
```
