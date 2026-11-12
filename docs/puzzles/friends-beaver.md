# Welche Form fehlt?

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-beaver`
- Host: beaver
- Related competence: **MA.2.A.1.a** — Formen in einer Matrix erkennen
- Difficulty: 3 × 3; Kreis, Dreieck, Quadrat, Rechteck
- Pool: 25 explicit iterations; a round selects five.
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
| `friends-beaver/matrix-0` | Formenreihe 1 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-1` | Formenreihe 2 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-2` | Formenreihe 3 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "square" |
| `friends-beaver/matrix-3` | Formenreihe 4 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-4` | Formenreihe 5 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "square" |
| `friends-beaver/matrix-5` | Formenreihe 6 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-6` | Formenreihe 7 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "square" |
| `friends-beaver/matrix-7` | Formenreihe 8 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-8` | Formenreihe 9 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-9` | Formenreihe 10 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-10` | Formenreihe 11 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "circle" |
| `friends-beaver/matrix-11` | Formenreihe 12 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "square" |
| `friends-beaver/matrix-12` | Formenreihe 13 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "circle" |
| `friends-beaver/matrix-13` | Formenreihe 14 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "square" |
| `friends-beaver/matrix-14` | Formenreihe 15 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-15` | Formenreihe 16 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "square" |
| `friends-beaver/matrix-16` | Formenreihe 17 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-17` | Formenreihe 18 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "circle" |
| `friends-beaver/matrix-18` | Formenreihe 19 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-19` | Formenreihe 20 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "circle" |
| `friends-beaver/matrix-20` | Formenreihe 21 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-21` | Formenreihe 22 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "circle" |
| `friends-beaver/matrix-22` | Formenreihe 23 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-23` | Formenreihe 24 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "rectangle" |
| `friends-beaver/matrix-24` | Formenreihe 25 — In jeder Reihe dieselben drei Formen. Welche fehlt? | "triangle" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-beaver/matrix-0",
    "label": "Formenreihe 1",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "triangle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "triangle",
        "rectangle",
        "triangle",
        "square"
      ],
      "gap": 6,
      "answer": "rectangle",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-1",
    "label": "Formenreihe 2",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "triangle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "triangle",
        "rectangle",
        "triangle",
        "square"
      ],
      "gap": 7,
      "answer": "triangle",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-2",
    "label": "Formenreihe 3",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "triangle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "triangle",
        "rectangle",
        "triangle",
        "square"
      ],
      "gap": 8,
      "answer": "square",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-3",
    "label": "Formenreihe 4",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "square",
        "rectangle",
        "triangle",
        "rectangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "rectangle"
      ],
      "gap": 6,
      "answer": "triangle",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-4",
    "label": "Formenreihe 5",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "square",
        "rectangle",
        "triangle",
        "rectangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "rectangle"
      ],
      "gap": 7,
      "answer": "square",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-5",
    "label": "Formenreihe 6",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "square",
        "rectangle",
        "triangle",
        "rectangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "rectangle"
      ],
      "gap": 8,
      "answer": "rectangle",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-6",
    "label": "Formenreihe 7",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "triangle"
      ],
      "gap": 6,
      "answer": "square",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-7",
    "label": "Formenreihe 8",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "triangle"
      ],
      "gap": 7,
      "answer": "rectangle",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-8",
    "label": "Formenreihe 9",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "triangle"
      ],
      "gap": 8,
      "answer": "triangle",
      "choices": [
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-9",
    "label": "Formenreihe 10",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "circle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square"
      ],
      "gap": 6,
      "answer": "rectangle",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-10",
    "label": "Formenreihe 11",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "circle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square"
      ],
      "gap": 7,
      "answer": "circle",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-11",
    "label": "Formenreihe 12",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "circle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square"
      ],
      "gap": 8,
      "answer": "square",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-12",
    "label": "Formenreihe 13",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "square",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square",
        "circle",
        "square",
        "rectangle"
      ],
      "gap": 6,
      "answer": "circle",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-13",
    "label": "Formenreihe 14",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "square",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square",
        "circle",
        "square",
        "rectangle"
      ],
      "gap": 7,
      "answer": "square",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-14",
    "label": "Formenreihe 15",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "square",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "square",
        "circle",
        "square",
        "rectangle"
      ],
      "gap": 8,
      "answer": "rectangle",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-15",
    "label": "Formenreihe 16",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "circle",
        "square",
        "circle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "circle"
      ],
      "gap": 6,
      "answer": "square",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-16",
    "label": "Formenreihe 17",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "circle",
        "square",
        "circle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "circle"
      ],
      "gap": 7,
      "answer": "rectangle",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-17",
    "label": "Formenreihe 18",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "circle",
        "square",
        "circle",
        "square",
        "rectangle",
        "square",
        "rectangle",
        "circle"
      ],
      "gap": 8,
      "answer": "circle",
      "choices": [
        "circle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-18",
    "label": "Formenreihe 19",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "circle",
        "triangle",
        "rectangle",
        "triangle",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "triangle"
      ],
      "gap": 6,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-19",
    "label": "Formenreihe 20",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "circle",
        "triangle",
        "rectangle",
        "triangle",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "triangle"
      ],
      "gap": 7,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-20",
    "label": "Formenreihe 21",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "circle",
        "triangle",
        "rectangle",
        "triangle",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "triangle"
      ],
      "gap": 8,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-21",
    "label": "Formenreihe 22",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "triangle",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "rectangle"
      ],
      "gap": 6,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-22",
    "label": "Formenreihe 23",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "triangle",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "rectangle"
      ],
      "gap": 7,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-23",
    "label": "Formenreihe 24",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "triangle",
        "rectangle",
        "circle",
        "rectangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "rectangle"
      ],
      "gap": 8,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-24",
    "label": "Formenreihe 25",
    "question": {
      "kind": "matrix",
      "prompt": "In jeder Reihe dieselben drei Formen. Welche fehlt?",
      "matrix": [
        "rectangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "rectangle",
        "triangle",
        "rectangle",
        "circle"
      ],
      "gap": 6,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "rectangle"
      ]
    }
  }
]
```
