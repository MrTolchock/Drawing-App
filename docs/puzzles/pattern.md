# Waldmuster

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `pattern`
- Host: owl
- Related competence: **MA.2.A.2.a** — Wiederholungsmuster fortsetzen
- Difficulty: AAB, ABB, ABC, ABAC, AABC; zwei sichtbare Einheiten
- Pool: 30 explicit iterations; a round selects five.
- Review: every iteration plus the puzzle checklist must be approved for this exact revision. New/changed items or difficulty require review again.

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
| Review | Isolated real-renderer previews, individual decisions, revision gate |

## Every iteration

| Stable iteration ID | Content / configuration | Expected answer or solution |
| --- | --- | --- |
| `pattern/0-0` | Muster AAB / 1 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/0-1` | Muster AAB / 2 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/0-2` | Muster AAB / 3 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/0-3` | Muster AAB / 4 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/0-4` | Muster AAB / 5 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/0-5` | Muster AAB / 6 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/1-0` | Muster ABB / 1 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/1-1` | Muster ABB / 2 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/1-2` | Muster ABB / 3 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/1-3` | Muster ABB / 4 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/1-4` | Muster ABB / 5 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/1-5` | Muster ABB / 6 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/2-0` | Muster ABC / 1 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/2-1` | Muster ABC / 2 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/2-2` | Muster ABC / 3 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/2-3` | Muster ABC / 4 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/2-4` | Muster ABC / 5 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/2-5` | Muster ABC / 6 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/3-0` | Muster ABAC / 1 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/3-1` | Muster ABAC / 2 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/3-2` | Muster ABAC / 3 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/3-3` | Muster ABAC / 4 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/3-4` | Muster ABAC / 5 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/3-5` | Muster ABAC / 6 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/4-0` | Muster AABC / 1 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/4-1` | Muster AABC / 2 — Welches Bild fehlt im Waldmuster? | "forest-leaf" |
| `pattern/4-2` | Muster AABC / 3 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/4-3` | Muster AABC / 4 — Welches Bild fehlt im Waldmuster? | "forest-nut" |
| `pattern/4-4` | Muster AABC / 5 — Welches Bild fehlt im Waldmuster? | "forest-feather" |
| `pattern/4-5` | Muster AABC / 6 — Welches Bild fehlt im Waldmuster? | "forest-feather" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "pattern/0-0",
    "label": "Muster AAB / 1",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-leaf",
        "forest-nut",
        "forest-leaf",
        "forest-leaf",
        "forest-nut",
        "forest-leaf"
      ],
      "gap": 6,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/0-1",
    "label": "Muster AAB / 2",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-leaf",
        "forest-feather",
        "forest-leaf",
        "forest-leaf",
        "forest-feather",
        "forest-leaf"
      ],
      "gap": 6,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/0-2",
    "label": "Muster AAB / 3",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-nut",
        "forest-leaf",
        "forest-nut",
        "forest-nut",
        "forest-leaf",
        "forest-nut"
      ],
      "gap": 6,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/0-3",
    "label": "Muster AAB / 4",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-nut",
        "forest-feather",
        "forest-nut",
        "forest-nut",
        "forest-feather",
        "forest-nut"
      ],
      "gap": 6,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/0-4",
    "label": "Muster AAB / 5",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-feather",
        "forest-leaf",
        "forest-feather",
        "forest-feather",
        "forest-leaf",
        "forest-feather"
      ],
      "gap": 6,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/0-5",
    "label": "Muster AAB / 6",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-feather",
        "forest-nut",
        "forest-feather",
        "forest-feather",
        "forest-nut",
        "forest-feather"
      ],
      "gap": 6,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/1-0",
    "label": "Muster ABB / 1",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-nut",
        "forest-nut",
        "forest-leaf",
        "forest-nut",
        "forest-nut",
        "forest-leaf"
      ],
      "gap": 6,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/1-1",
    "label": "Muster ABB / 2",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-feather",
        "forest-feather",
        "forest-leaf",
        "forest-feather",
        "forest-feather",
        "forest-leaf"
      ],
      "gap": 6,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/1-2",
    "label": "Muster ABB / 3",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-leaf",
        "forest-leaf",
        "forest-nut",
        "forest-leaf",
        "forest-leaf",
        "forest-nut"
      ],
      "gap": 6,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/1-3",
    "label": "Muster ABB / 4",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-feather",
        "forest-feather",
        "forest-nut",
        "forest-feather",
        "forest-feather",
        "forest-nut"
      ],
      "gap": 6,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/1-4",
    "label": "Muster ABB / 5",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-leaf",
        "forest-leaf",
        "forest-feather",
        "forest-leaf",
        "forest-leaf",
        "forest-feather"
      ],
      "gap": 6,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/1-5",
    "label": "Muster ABB / 6",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-nut",
        "forest-nut",
        "forest-feather",
        "forest-nut",
        "forest-nut",
        "forest-feather"
      ],
      "gap": 6,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/2-0",
    "label": "Muster ABC / 1",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-leaf"
      ],
      "gap": 6,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/2-1",
    "label": "Muster ABC / 2",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-leaf"
      ],
      "gap": 6,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/2-2",
    "label": "Muster ABC / 3",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-nut"
      ],
      "gap": 6,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/2-3",
    "label": "Muster ABC / 4",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-nut"
      ],
      "gap": 6,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/2-4",
    "label": "Muster ABC / 5",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ],
      "gap": 6,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/2-5",
    "label": "Muster ABC / 6",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-feather"
      ],
      "gap": 6,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/3-0",
    "label": "Muster ABAC / 1",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-leaf"
      ],
      "gap": 8,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/3-1",
    "label": "Muster ABAC / 2",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-leaf"
      ],
      "gap": 8,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/3-2",
    "label": "Muster ABAC / 3",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-nut"
      ],
      "gap": 8,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/3-3",
    "label": "Muster ABAC / 4",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-nut"
      ],
      "gap": 8,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/3-4",
    "label": "Muster ABAC / 5",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-feather"
      ],
      "gap": 8,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/3-5",
    "label": "Muster ABAC / 6",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-feather"
      ],
      "gap": 8,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/4-0",
    "label": "Muster AABC / 1",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-leaf"
      ],
      "gap": 8,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/4-1",
    "label": "Muster AABC / 2",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-leaf",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-leaf"
      ],
      "gap": 8,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/4-2",
    "label": "Muster AABC / 3",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-nut",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-nut"
      ],
      "gap": 8,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/4-3",
    "label": "Muster AABC / 4",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-nut",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-nut",
        "forest-feather",
        "forest-leaf",
        "forest-nut"
      ],
      "gap": 8,
      "answer": "forest-nut",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/4-4",
    "label": "Muster AABC / 5",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-feather",
        "forest-feather",
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ],
      "gap": 8,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  },
  {
    "id": "pattern/4-5",
    "label": "Muster AABC / 6",
    "question": {
      "kind": "pattern",
      "prompt": "Welches Bild fehlt im Waldmuster?",
      "sequence": [
        "forest-feather",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-feather",
        "forest-feather",
        "forest-nut",
        "forest-leaf",
        "forest-feather"
      ],
      "gap": 8,
      "answer": "forest-feather",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-feather"
      ]
    }
  }
]
```
