# Waldpicknick

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `picnic`
- Host: squirrel
- Related competence: **MA.1.A.4.a (Übung)** — Eins zu eins gerecht verteilen
- Difficulty: 2–4 Freunde; 1–10 Beeren je Teller; insgesamt höchstens 20
- Pool: 25 explicit iterations; a round selects five.
- Review: every iteration and the puzzle must be approved for this exact revision; names, notes and checklists are not required. New/changed items or difficulty require review again.

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
| Review | Isolated real-renderer previews, one-click decisions, puzzle-level speech, revision gate |

## Every iteration

| Stable iteration ID | Content / configuration | Expected answer or solution |
| --- | --- | --- |
| `picnic/2-1` | 2 Freunde, 2 Beeren — Teile alle Beeren gerecht auf. | 1 |
| `picnic/2-2` | 2 Freunde, 4 Beeren — Teile alle Beeren gerecht auf. | 2 |
| `picnic/2-3` | 2 Freunde, 6 Beeren — Teile alle Beeren gerecht auf. | 3 |
| `picnic/2-4` | 2 Freunde, 8 Beeren — Teile alle Beeren gerecht auf. | 4 |
| `picnic/2-5` | 2 Freunde, 10 Beeren — Teile alle Beeren gerecht auf. | 5 |
| `picnic/2-6` | 2 Freunde, 12 Beeren — Teile alle Beeren gerecht auf. | 6 |
| `picnic/2-7` | 2 Freunde, 14 Beeren — Teile alle Beeren gerecht auf. | 7 |
| `picnic/2-8` | 2 Freunde, 16 Beeren — Teile alle Beeren gerecht auf. | 8 |
| `picnic/2-9` | 2 Freunde, 18 Beeren — Teile alle Beeren gerecht auf. | 9 |
| `picnic/2-10` | 2 Freunde, 20 Beeren — Teile alle Beeren gerecht auf. | 10 |
| `picnic/3-1` | 3 Freunde, 3 Beeren — Teile alle Beeren gerecht auf. | 1 |
| `picnic/3-2` | 3 Freunde, 6 Beeren — Teile alle Beeren gerecht auf. | 2 |
| `picnic/3-3` | 3 Freunde, 9 Beeren — Teile alle Beeren gerecht auf. | 3 |
| `picnic/3-4` | 3 Freunde, 12 Beeren — Teile alle Beeren gerecht auf. | 4 |
| `picnic/3-5` | 3 Freunde, 15 Beeren — Teile alle Beeren gerecht auf. | 5 |
| `picnic/3-6` | 3 Freunde, 18 Beeren — Teile alle Beeren gerecht auf. | 6 |
| `picnic/4-1` | 4 Freunde, 4 Beeren — Teile alle Beeren gerecht auf. | 1 |
| `picnic/4-2` | 4 Freunde, 8 Beeren — Teile alle Beeren gerecht auf. | 2 |
| `picnic/4-3` | 4 Freunde, 12 Beeren — Teile alle Beeren gerecht auf. | 3 |
| `picnic/4-4` | 4 Freunde, 16 Beeren — Teile alle Beeren gerecht auf. | 4 |
| `picnic/4-5` | 4 Freunde, 20 Beeren — Teile alle Beeren gerecht auf. | 5 |
| `picnic/started-2-3` | Begonnenes Picknick: 2 × 3 — Teile alle Beeren gerecht auf. | 3 |
| `picnic/started-2-4` | Begonnenes Picknick: 2 × 4 — Teile alle Beeren gerecht auf. | 4 |
| `picnic/started-3-2` | Begonnenes Picknick: 3 × 2 — Teile alle Beeren gerecht auf. | 2 |
| `picnic/started-4-2` | Begonnenes Picknick: 4 × 2 — Teile alle Beeren gerecht auf. | 2 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "picnic/2-1",
    "label": "2 Freunde, 2 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 1,
      "total": 2,
      "answer": 1
    }
  },
  {
    "id": "picnic/2-2",
    "label": "2 Freunde, 4 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 2,
      "total": 4,
      "answer": 2
    }
  },
  {
    "id": "picnic/2-3",
    "label": "2 Freunde, 6 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 3,
      "total": 6,
      "answer": 3
    }
  },
  {
    "id": "picnic/2-4",
    "label": "2 Freunde, 8 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 4,
      "total": 8,
      "answer": 4
    }
  },
  {
    "id": "picnic/2-5",
    "label": "2 Freunde, 10 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 5,
      "total": 10,
      "answer": 5
    }
  },
  {
    "id": "picnic/2-6",
    "label": "2 Freunde, 12 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 6,
      "total": 12,
      "answer": 6
    }
  },
  {
    "id": "picnic/2-7",
    "label": "2 Freunde, 14 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 7,
      "total": 14,
      "answer": 7
    }
  },
  {
    "id": "picnic/2-8",
    "label": "2 Freunde, 16 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 8,
      "total": 16,
      "answer": 8
    }
  },
  {
    "id": "picnic/2-9",
    "label": "2 Freunde, 18 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 9,
      "total": 18,
      "answer": 9
    }
  },
  {
    "id": "picnic/2-10",
    "label": "2 Freunde, 20 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 10,
      "total": 20,
      "answer": 10
    }
  },
  {
    "id": "picnic/3-1",
    "label": "3 Freunde, 3 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 1,
      "total": 3,
      "answer": 1
    }
  },
  {
    "id": "picnic/3-2",
    "label": "3 Freunde, 6 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 2,
      "total": 6,
      "answer": 2
    }
  },
  {
    "id": "picnic/3-3",
    "label": "3 Freunde, 9 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 3,
      "total": 9,
      "answer": 3
    }
  },
  {
    "id": "picnic/3-4",
    "label": "3 Freunde, 12 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 4,
      "total": 12,
      "answer": 4
    }
  },
  {
    "id": "picnic/3-5",
    "label": "3 Freunde, 15 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 5,
      "total": 15,
      "answer": 5
    }
  },
  {
    "id": "picnic/3-6",
    "label": "3 Freunde, 18 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 6,
      "total": 18,
      "answer": 6
    }
  },
  {
    "id": "picnic/4-1",
    "label": "4 Freunde, 4 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 4,
      "each": 1,
      "total": 4,
      "answer": 1
    }
  },
  {
    "id": "picnic/4-2",
    "label": "4 Freunde, 8 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 4,
      "each": 2,
      "total": 8,
      "answer": 2
    }
  },
  {
    "id": "picnic/4-3",
    "label": "4 Freunde, 12 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 4,
      "each": 3,
      "total": 12,
      "answer": 3
    }
  },
  {
    "id": "picnic/4-4",
    "label": "4 Freunde, 16 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 4,
      "each": 4,
      "total": 16,
      "answer": 4
    }
  },
  {
    "id": "picnic/4-5",
    "label": "4 Freunde, 20 Beeren",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 4,
      "each": 5,
      "total": 20,
      "answer": 5
    }
  },
  {
    "id": "picnic/started-2-3",
    "label": "Begonnenes Picknick: 2 × 3",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 3,
      "total": 6,
      "plates": [
        1,
        0
      ],
      "answer": 3
    }
  },
  {
    "id": "picnic/started-2-4",
    "label": "Begonnenes Picknick: 2 × 4",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 2,
      "each": 4,
      "total": 8,
      "plates": [
        0,
        2
      ],
      "answer": 4
    }
  },
  {
    "id": "picnic/started-3-2",
    "label": "Begonnenes Picknick: 3 × 2",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 3,
      "each": 2,
      "total": 6,
      "plates": [
        1,
        0,
        0
      ],
      "answer": 2
    }
  },
  {
    "id": "picnic/started-4-2",
    "label": "Begonnenes Picknick: 4 × 2",
    "question": {
      "kind": "picnic",
      "prompt": "Teile alle Beeren gerecht auf.",
      "friends": 4,
      "each": 2,
      "total": 8,
      "plates": [
        0,
        1,
        0,
        1
      ],
      "answer": 2
    }
  }
]
```
