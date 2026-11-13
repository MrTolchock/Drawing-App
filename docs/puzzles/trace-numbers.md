# Zahlenspuren

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `trace-numbers`
- Host: mouse
- Related competence: **D.4.A.1.c (Graphomotorik)** — Ziffernformen nachfahren
- Difficulty: 0–9; je drei gezeichnete Mengenbezüge; 30 Aufgaben
- Pool: 30 explicit iterations; a round selects five.
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
| `trace-numbers/digit-0-forest-nut` | 0 / forest-nut — Nachfahren: 0 / 0 × forest-nut | 0 |
| `trace-numbers/digit-1-forest-nut` | 1 / forest-nut — Nachfahren: 1 / 1 × forest-nut | 1 |
| `trace-numbers/digit-2-forest-nut` | 2 / forest-nut — Nachfahren: 2 / 2 × forest-nut | 2 |
| `trace-numbers/digit-3-forest-nut` | 3 / forest-nut — Nachfahren: 3 / 3 × forest-nut | 3 |
| `trace-numbers/digit-4-forest-nut` | 4 / forest-nut — Nachfahren: 4 / 4 × forest-nut | 4 |
| `trace-numbers/digit-5-forest-nut` | 5 / forest-nut — Nachfahren: 5 / 5 × forest-nut | 5 |
| `trace-numbers/digit-6-forest-nut` | 6 / forest-nut — Nachfahren: 6 / 6 × forest-nut | 6 |
| `trace-numbers/digit-7-forest-nut` | 7 / forest-nut — Nachfahren: 7 / 7 × forest-nut | 7 |
| `trace-numbers/digit-8-forest-nut` | 8 / forest-nut — Nachfahren: 8 / 8 × forest-nut | 8 |
| `trace-numbers/digit-9-forest-nut` | 9 / forest-nut — Nachfahren: 9 / 9 × forest-nut | 9 |
| `trace-numbers/digit-0-forest-apple` | 0 / forest-apple — Nachfahren: 0 / 0 × forest-apple | 0 |
| `trace-numbers/digit-1-forest-apple` | 1 / forest-apple — Nachfahren: 1 / 1 × forest-apple | 1 |
| `trace-numbers/digit-2-forest-apple` | 2 / forest-apple — Nachfahren: 2 / 2 × forest-apple | 2 |
| `trace-numbers/digit-3-forest-apple` | 3 / forest-apple — Nachfahren: 3 / 3 × forest-apple | 3 |
| `trace-numbers/digit-4-forest-apple` | 4 / forest-apple — Nachfahren: 4 / 4 × forest-apple | 4 |
| `trace-numbers/digit-5-forest-apple` | 5 / forest-apple — Nachfahren: 5 / 5 × forest-apple | 5 |
| `trace-numbers/digit-6-forest-apple` | 6 / forest-apple — Nachfahren: 6 / 6 × forest-apple | 6 |
| `trace-numbers/digit-7-forest-apple` | 7 / forest-apple — Nachfahren: 7 / 7 × forest-apple | 7 |
| `trace-numbers/digit-8-forest-apple` | 8 / forest-apple — Nachfahren: 8 / 8 × forest-apple | 8 |
| `trace-numbers/digit-9-forest-apple` | 9 / forest-apple — Nachfahren: 9 / 9 × forest-apple | 9 |
| `trace-numbers/digit-0-forest-feather` | 0 / forest-feather — Nachfahren: 0 / 0 × forest-feather | 0 |
| `trace-numbers/digit-1-forest-feather` | 1 / forest-feather — Nachfahren: 1 / 1 × forest-feather | 1 |
| `trace-numbers/digit-2-forest-feather` | 2 / forest-feather — Nachfahren: 2 / 2 × forest-feather | 2 |
| `trace-numbers/digit-3-forest-feather` | 3 / forest-feather — Nachfahren: 3 / 3 × forest-feather | 3 |
| `trace-numbers/digit-4-forest-feather` | 4 / forest-feather — Nachfahren: 4 / 4 × forest-feather | 4 |
| `trace-numbers/digit-5-forest-feather` | 5 / forest-feather — Nachfahren: 5 / 5 × forest-feather | 5 |
| `trace-numbers/digit-6-forest-feather` | 6 / forest-feather — Nachfahren: 6 / 6 × forest-feather | 6 |
| `trace-numbers/digit-7-forest-feather` | 7 / forest-feather — Nachfahren: 7 / 7 × forest-feather | 7 |
| `trace-numbers/digit-8-forest-feather` | 8 / forest-feather — Nachfahren: 8 / 8 × forest-feather | 8 |
| `trace-numbers/digit-9-forest-feather` | 9 / forest-feather — Nachfahren: 9 / 9 × forest-feather | 9 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "trace-numbers/digit-0-forest-nut",
    "label": "0 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "0",
      "quantity": {
        "count": 0,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-1-forest-nut",
    "label": "1 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "1",
      "quantity": {
        "count": 1,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-2-forest-nut",
    "label": "2 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "2",
      "quantity": {
        "count": 2,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-3-forest-nut",
    "label": "3 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "3",
      "quantity": {
        "count": 3,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-4-forest-nut",
    "label": "4 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "4",
      "quantity": {
        "count": 4,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-5-forest-nut",
    "label": "5 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "5",
      "quantity": {
        "count": 5,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-6-forest-nut",
    "label": "6 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "6",
      "quantity": {
        "count": 6,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-7-forest-nut",
    "label": "7 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "7",
      "quantity": {
        "count": 7,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-8-forest-nut",
    "label": "8 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "8",
      "quantity": {
        "count": 8,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-9-forest-nut",
    "label": "9 / forest-nut",
    "question": {
      "kind": "trace",
      "glyph": "9",
      "quantity": {
        "count": 9,
        "item": "forest-nut"
      }
    }
  },
  {
    "id": "trace-numbers/digit-0-forest-apple",
    "label": "0 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "0",
      "quantity": {
        "count": 0,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-1-forest-apple",
    "label": "1 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "1",
      "quantity": {
        "count": 1,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-2-forest-apple",
    "label": "2 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "2",
      "quantity": {
        "count": 2,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-3-forest-apple",
    "label": "3 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "3",
      "quantity": {
        "count": 3,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-4-forest-apple",
    "label": "4 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "4",
      "quantity": {
        "count": 4,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-5-forest-apple",
    "label": "5 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "5",
      "quantity": {
        "count": 5,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-6-forest-apple",
    "label": "6 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "6",
      "quantity": {
        "count": 6,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-7-forest-apple",
    "label": "7 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "7",
      "quantity": {
        "count": 7,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-8-forest-apple",
    "label": "8 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "8",
      "quantity": {
        "count": 8,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-9-forest-apple",
    "label": "9 / forest-apple",
    "question": {
      "kind": "trace",
      "glyph": "9",
      "quantity": {
        "count": 9,
        "item": "forest-apple"
      }
    }
  },
  {
    "id": "trace-numbers/digit-0-forest-feather",
    "label": "0 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "0",
      "quantity": {
        "count": 0,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-1-forest-feather",
    "label": "1 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "1",
      "quantity": {
        "count": 1,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-2-forest-feather",
    "label": "2 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "2",
      "quantity": {
        "count": 2,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-3-forest-feather",
    "label": "3 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "3",
      "quantity": {
        "count": 3,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-4-forest-feather",
    "label": "4 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "4",
      "quantity": {
        "count": 4,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-5-forest-feather",
    "label": "5 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "5",
      "quantity": {
        "count": 5,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-6-forest-feather",
    "label": "6 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "6",
      "quantity": {
        "count": 6,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-7-forest-feather",
    "label": "7 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "7",
      "quantity": {
        "count": 7,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-8-forest-feather",
    "label": "8 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "8",
      "quantity": {
        "count": 8,
        "item": "forest-feather"
      }
    }
  },
  {
    "id": "trace-numbers/digit-9-forest-feather",
    "label": "9 / forest-feather",
    "question": {
      "kind": "trace",
      "glyph": "9",
      "quantity": {
        "count": 9,
        "item": "forest-feather"
      }
    }
  }
]
```
