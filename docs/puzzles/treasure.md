# Waldschatz

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `treasure`
- Host: owl
- Related competence: **Optionale Gedächtnisübung** — Gegenstände wiedererkennen
- Difficulty: Vier Dinge, eines fehlt; kein Zeitlimit; erneut anschauen möglich
- Pool: 32 explicit iterations; a round selects five.
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
| `treasure/0-0` | Korb 1, fehlt: forest-leaf — Merke dir die vier Waldschätze. | "forest-leaf" |
| `treasure/0-1` | Korb 1, fehlt: forest-feather — Merke dir die vier Waldschätze. | "forest-feather" |
| `treasure/0-2` | Korb 1, fehlt: forest-mushroom — Merke dir die vier Waldschätze. | "forest-mushroom" |
| `treasure/0-3` | Korb 1, fehlt: forest-stone — Merke dir die vier Waldschätze. | "forest-stone" |
| `treasure/1-0` | Korb 2, fehlt: forest-feather — Merke dir die vier Waldschätze. | "forest-feather" |
| `treasure/1-1` | Korb 2, fehlt: forest-mushroom — Merke dir die vier Waldschätze. | "forest-mushroom" |
| `treasure/1-2` | Korb 2, fehlt: forest-stone — Merke dir die vier Waldschätze. | "forest-stone" |
| `treasure/1-3` | Korb 2, fehlt: forest-berry — Merke dir die vier Waldschätze. | "forest-berry" |
| `treasure/2-0` | Korb 3, fehlt: forest-mushroom — Merke dir die vier Waldschätze. | "forest-mushroom" |
| `treasure/2-1` | Korb 3, fehlt: forest-stone — Merke dir die vier Waldschätze. | "forest-stone" |
| `treasure/2-2` | Korb 3, fehlt: forest-berry — Merke dir die vier Waldschätze. | "forest-berry" |
| `treasure/2-3` | Korb 3, fehlt: forest-nut — Merke dir die vier Waldschätze. | "forest-nut" |
| `treasure/3-0` | Korb 4, fehlt: forest-stone — Merke dir die vier Waldschätze. | "forest-stone" |
| `treasure/3-1` | Korb 4, fehlt: forest-berry — Merke dir die vier Waldschätze. | "forest-berry" |
| `treasure/3-2` | Korb 4, fehlt: forest-nut — Merke dir die vier Waldschätze. | "forest-nut" |
| `treasure/3-3` | Korb 4, fehlt: forest-apple — Merke dir die vier Waldschätze. | "forest-apple" |
| `treasure/4-0` | Korb 5, fehlt: forest-berry — Merke dir die vier Waldschätze. | "forest-berry" |
| `treasure/4-1` | Korb 5, fehlt: forest-nut — Merke dir die vier Waldschätze. | "forest-nut" |
| `treasure/4-2` | Korb 5, fehlt: forest-apple — Merke dir die vier Waldschätze. | "forest-apple" |
| `treasure/4-3` | Korb 5, fehlt: forest-flower — Merke dir die vier Waldschätze. | "forest-flower" |
| `treasure/5-0` | Korb 6, fehlt: forest-nut — Merke dir die vier Waldschätze. | "forest-nut" |
| `treasure/5-1` | Korb 6, fehlt: forest-apple — Merke dir die vier Waldschätze. | "forest-apple" |
| `treasure/5-2` | Korb 6, fehlt: forest-flower — Merke dir die vier Waldschätze. | "forest-flower" |
| `treasure/5-3` | Korb 6, fehlt: forest-leaf — Merke dir die vier Waldschätze. | "forest-leaf" |
| `treasure/6-0` | Korb 7, fehlt: forest-apple — Merke dir die vier Waldschätze. | "forest-apple" |
| `treasure/6-1` | Korb 7, fehlt: forest-flower — Merke dir die vier Waldschätze. | "forest-flower" |
| `treasure/6-2` | Korb 7, fehlt: forest-leaf — Merke dir die vier Waldschätze. | "forest-leaf" |
| `treasure/6-3` | Korb 7, fehlt: forest-feather — Merke dir die vier Waldschätze. | "forest-feather" |
| `treasure/7-0` | Korb 8, fehlt: forest-flower — Merke dir die vier Waldschätze. | "forest-flower" |
| `treasure/7-1` | Korb 8, fehlt: forest-leaf — Merke dir die vier Waldschätze. | "forest-leaf" |
| `treasure/7-2` | Korb 8, fehlt: forest-feather — Merke dir die vier Waldschätze. | "forest-feather" |
| `treasure/7-3` | Korb 8, fehlt: forest-mushroom — Merke dir die vier Waldschätze. | "forest-mushroom" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "treasure/0-0",
    "label": "Korb 1, fehlt: forest-leaf",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-leaf",
        "forest-feather",
        "forest-mushroom",
        "forest-stone"
      ],
      "missing": 0,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-feather",
        "forest-mushroom"
      ]
    }
  },
  {
    "id": "treasure/0-1",
    "label": "Korb 1, fehlt: forest-feather",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-leaf",
        "forest-feather",
        "forest-mushroom",
        "forest-stone"
      ],
      "missing": 1,
      "answer": "forest-feather",
      "choices": [
        "forest-feather",
        "forest-leaf",
        "forest-mushroom"
      ]
    }
  },
  {
    "id": "treasure/0-2",
    "label": "Korb 1, fehlt: forest-mushroom",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-leaf",
        "forest-feather",
        "forest-mushroom",
        "forest-stone"
      ],
      "missing": 2,
      "answer": "forest-mushroom",
      "choices": [
        "forest-mushroom",
        "forest-leaf",
        "forest-feather"
      ]
    }
  },
  {
    "id": "treasure/0-3",
    "label": "Korb 1, fehlt: forest-stone",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-leaf",
        "forest-feather",
        "forest-mushroom",
        "forest-stone"
      ],
      "missing": 3,
      "answer": "forest-stone",
      "choices": [
        "forest-stone",
        "forest-leaf",
        "forest-feather"
      ]
    }
  },
  {
    "id": "treasure/1-0",
    "label": "Korb 2, fehlt: forest-feather",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-feather",
        "forest-mushroom",
        "forest-stone",
        "forest-berry"
      ],
      "missing": 0,
      "answer": "forest-feather",
      "choices": [
        "forest-feather",
        "forest-mushroom",
        "forest-stone"
      ]
    }
  },
  {
    "id": "treasure/1-1",
    "label": "Korb 2, fehlt: forest-mushroom",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-feather",
        "forest-mushroom",
        "forest-stone",
        "forest-berry"
      ],
      "missing": 1,
      "answer": "forest-mushroom",
      "choices": [
        "forest-mushroom",
        "forest-feather",
        "forest-stone"
      ]
    }
  },
  {
    "id": "treasure/1-2",
    "label": "Korb 2, fehlt: forest-stone",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-feather",
        "forest-mushroom",
        "forest-stone",
        "forest-berry"
      ],
      "missing": 2,
      "answer": "forest-stone",
      "choices": [
        "forest-stone",
        "forest-feather",
        "forest-mushroom"
      ]
    }
  },
  {
    "id": "treasure/1-3",
    "label": "Korb 2, fehlt: forest-berry",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-feather",
        "forest-mushroom",
        "forest-stone",
        "forest-berry"
      ],
      "missing": 3,
      "answer": "forest-berry",
      "choices": [
        "forest-berry",
        "forest-feather",
        "forest-mushroom"
      ]
    }
  },
  {
    "id": "treasure/2-0",
    "label": "Korb 3, fehlt: forest-mushroom",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-mushroom",
        "forest-stone",
        "forest-berry",
        "forest-nut"
      ],
      "missing": 0,
      "answer": "forest-mushroom",
      "choices": [
        "forest-mushroom",
        "forest-stone",
        "forest-berry"
      ]
    }
  },
  {
    "id": "treasure/2-1",
    "label": "Korb 3, fehlt: forest-stone",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-mushroom",
        "forest-stone",
        "forest-berry",
        "forest-nut"
      ],
      "missing": 1,
      "answer": "forest-stone",
      "choices": [
        "forest-stone",
        "forest-mushroom",
        "forest-berry"
      ]
    }
  },
  {
    "id": "treasure/2-2",
    "label": "Korb 3, fehlt: forest-berry",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-mushroom",
        "forest-stone",
        "forest-berry",
        "forest-nut"
      ],
      "missing": 2,
      "answer": "forest-berry",
      "choices": [
        "forest-berry",
        "forest-mushroom",
        "forest-stone"
      ]
    }
  },
  {
    "id": "treasure/2-3",
    "label": "Korb 3, fehlt: forest-nut",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-mushroom",
        "forest-stone",
        "forest-berry",
        "forest-nut"
      ],
      "missing": 3,
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "forest-mushroom",
        "forest-stone"
      ]
    }
  },
  {
    "id": "treasure/3-0",
    "label": "Korb 4, fehlt: forest-stone",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-stone",
        "forest-berry",
        "forest-nut",
        "forest-apple"
      ],
      "missing": 0,
      "answer": "forest-stone",
      "choices": [
        "forest-stone",
        "forest-berry",
        "forest-nut"
      ]
    }
  },
  {
    "id": "treasure/3-1",
    "label": "Korb 4, fehlt: forest-berry",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-stone",
        "forest-berry",
        "forest-nut",
        "forest-apple"
      ],
      "missing": 1,
      "answer": "forest-berry",
      "choices": [
        "forest-berry",
        "forest-stone",
        "forest-nut"
      ]
    }
  },
  {
    "id": "treasure/3-2",
    "label": "Korb 4, fehlt: forest-nut",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-stone",
        "forest-berry",
        "forest-nut",
        "forest-apple"
      ],
      "missing": 2,
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "forest-stone",
        "forest-berry"
      ]
    }
  },
  {
    "id": "treasure/3-3",
    "label": "Korb 4, fehlt: forest-apple",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-stone",
        "forest-berry",
        "forest-nut",
        "forest-apple"
      ],
      "missing": 3,
      "answer": "forest-apple",
      "choices": [
        "forest-apple",
        "forest-stone",
        "forest-berry"
      ]
    }
  },
  {
    "id": "treasure/4-0",
    "label": "Korb 5, fehlt: forest-berry",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-berry",
        "forest-nut",
        "forest-apple",
        "forest-flower"
      ],
      "missing": 0,
      "answer": "forest-berry",
      "choices": [
        "forest-berry",
        "forest-nut",
        "forest-apple"
      ]
    }
  },
  {
    "id": "treasure/4-1",
    "label": "Korb 5, fehlt: forest-nut",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-berry",
        "forest-nut",
        "forest-apple",
        "forest-flower"
      ],
      "missing": 1,
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "forest-berry",
        "forest-apple"
      ]
    }
  },
  {
    "id": "treasure/4-2",
    "label": "Korb 5, fehlt: forest-apple",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-berry",
        "forest-nut",
        "forest-apple",
        "forest-flower"
      ],
      "missing": 2,
      "answer": "forest-apple",
      "choices": [
        "forest-apple",
        "forest-berry",
        "forest-nut"
      ]
    }
  },
  {
    "id": "treasure/4-3",
    "label": "Korb 5, fehlt: forest-flower",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-berry",
        "forest-nut",
        "forest-apple",
        "forest-flower"
      ],
      "missing": 3,
      "answer": "forest-flower",
      "choices": [
        "forest-flower",
        "forest-berry",
        "forest-nut"
      ]
    }
  },
  {
    "id": "treasure/5-0",
    "label": "Korb 6, fehlt: forest-nut",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-nut",
        "forest-apple",
        "forest-flower",
        "forest-leaf"
      ],
      "missing": 0,
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "forest-apple",
        "forest-flower"
      ]
    }
  },
  {
    "id": "treasure/5-1",
    "label": "Korb 6, fehlt: forest-apple",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-nut",
        "forest-apple",
        "forest-flower",
        "forest-leaf"
      ],
      "missing": 1,
      "answer": "forest-apple",
      "choices": [
        "forest-apple",
        "forest-nut",
        "forest-flower"
      ]
    }
  },
  {
    "id": "treasure/5-2",
    "label": "Korb 6, fehlt: forest-flower",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-nut",
        "forest-apple",
        "forest-flower",
        "forest-leaf"
      ],
      "missing": 2,
      "answer": "forest-flower",
      "choices": [
        "forest-flower",
        "forest-nut",
        "forest-apple"
      ]
    }
  },
  {
    "id": "treasure/5-3",
    "label": "Korb 6, fehlt: forest-leaf",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-nut",
        "forest-apple",
        "forest-flower",
        "forest-leaf"
      ],
      "missing": 3,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-nut",
        "forest-apple"
      ]
    }
  },
  {
    "id": "treasure/6-0",
    "label": "Korb 7, fehlt: forest-apple",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-apple",
        "forest-flower",
        "forest-leaf",
        "forest-feather"
      ],
      "missing": 0,
      "answer": "forest-apple",
      "choices": [
        "forest-apple",
        "forest-flower",
        "forest-leaf"
      ]
    }
  },
  {
    "id": "treasure/6-1",
    "label": "Korb 7, fehlt: forest-flower",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-apple",
        "forest-flower",
        "forest-leaf",
        "forest-feather"
      ],
      "missing": 1,
      "answer": "forest-flower",
      "choices": [
        "forest-flower",
        "forest-apple",
        "forest-leaf"
      ]
    }
  },
  {
    "id": "treasure/6-2",
    "label": "Korb 7, fehlt: forest-leaf",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-apple",
        "forest-flower",
        "forest-leaf",
        "forest-feather"
      ],
      "missing": 2,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-apple",
        "forest-flower"
      ]
    }
  },
  {
    "id": "treasure/6-3",
    "label": "Korb 7, fehlt: forest-feather",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-apple",
        "forest-flower",
        "forest-leaf",
        "forest-feather"
      ],
      "missing": 3,
      "answer": "forest-feather",
      "choices": [
        "forest-feather",
        "forest-apple",
        "forest-flower"
      ]
    }
  },
  {
    "id": "treasure/7-0",
    "label": "Korb 8, fehlt: forest-flower",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-flower",
        "forest-leaf",
        "forest-feather",
        "forest-mushroom"
      ],
      "missing": 0,
      "answer": "forest-flower",
      "choices": [
        "forest-flower",
        "forest-leaf",
        "forest-feather"
      ]
    }
  },
  {
    "id": "treasure/7-1",
    "label": "Korb 8, fehlt: forest-leaf",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-flower",
        "forest-leaf",
        "forest-feather",
        "forest-mushroom"
      ],
      "missing": 1,
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "forest-flower",
        "forest-feather"
      ]
    }
  },
  {
    "id": "treasure/7-2",
    "label": "Korb 8, fehlt: forest-feather",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-flower",
        "forest-leaf",
        "forest-feather",
        "forest-mushroom"
      ],
      "missing": 2,
      "answer": "forest-feather",
      "choices": [
        "forest-feather",
        "forest-flower",
        "forest-leaf"
      ]
    }
  },
  {
    "id": "treasure/7-3",
    "label": "Korb 8, fehlt: forest-mushroom",
    "question": {
      "kind": "treasure",
      "prompt": "Merke dir die vier Waldschätze.",
      "objects": [
        "forest-flower",
        "forest-leaf",
        "forest-feather",
        "forest-mushroom"
      ],
      "missing": 3,
      "answer": "forest-mushroom",
      "choices": [
        "forest-mushroom",
        "forest-flower",
        "forest-leaf"
      ]
    }
  }
]
```
