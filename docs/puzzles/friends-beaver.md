# Welche Form fehlt?

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-beaver`
- Host: beaver
- Related competence: **MA.2.A.1.a** — Formenmengen in einer Matrix erkennen
- Difficulty: Zwei gleiche und eine andere Form je Reihe; das Muster der ersten zwei Reihen ergänzen
- Pool: 25 explicit iterations; a round selects five.
- Review: solve every unconfirmed iteration to approve it; × rejects with an optional note. The puzzle is released when all current iterations passed. Exact per-iteration revisions gate release; only affected iterations require review after changes.

## Mapping to the blueprint

| Contract | Implementation |
| --- | --- |
| Picture roles | Drawn woodland subjects; painted host/companions; SVG geometry and tracing |
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
| `friends-beaver/matrix-0` | Formenreihe 1 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-1` | Formenreihe 2 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-2` | Formenreihe 3 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-3` | Formenreihe 4 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-4` | Formenreihe 5 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-5` | Formenreihe 6 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-6` | Formenreihe 7 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-7` | Formenreihe 8 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-8` | Formenreihe 9 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-9` | Formenreihe 10 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-10` | Formenreihe 11 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-11` | Formenreihe 12 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-12` | Formenreihe 13 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-13` | Formenreihe 14 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-14` | Formenreihe 15 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-15` | Formenreihe 16 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-16` | Formenreihe 17 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-17` | Formenreihe 18 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-18` | Formenreihe 19 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-19` | Formenreihe 20 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-20` | Formenreihe 21 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-21` | Formenreihe 22 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "square" |
| `friends-beaver/matrix-22` | Formenreihe 23 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "circle" |
| `friends-beaver/matrix-23` | Formenreihe 24 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |
| `friends-beaver/matrix-24` | Formenreihe 25 — Jede Reihe hat dieselben Formen gleich oft. Welche fehlt? | "triangle" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-beaver/matrix-0",
    "label": "Formenreihe 1",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "circle",
        "circle"
      ],
      "gap": 6,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-1",
    "label": "Formenreihe 2",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "circle",
        "square",
        "circle",
        "square",
        "circle",
        "square",
        "circle",
        "circle"
      ],
      "gap": 6,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-2",
    "label": "Formenreihe 3",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "triangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "triangle"
      ],
      "gap": 6,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-3",
    "label": "Formenreihe 4",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "triangle",
        "square",
        "triangle",
        "square",
        "triangle",
        "square",
        "triangle",
        "triangle"
      ],
      "gap": 6,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-4",
    "label": "Formenreihe 5",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "square",
        "circle",
        "square",
        "circle",
        "square",
        "circle",
        "square",
        "square"
      ],
      "gap": 6,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-5",
    "label": "Formenreihe 6",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "square",
        "triangle",
        "square",
        "triangle",
        "square",
        "triangle",
        "square",
        "square"
      ],
      "gap": 6,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-6",
    "label": "Formenreihe 7",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "circle",
        "triangle",
        "triangle",
        "circle",
        "circle",
        "circle",
        "triangle",
        "circle"
      ],
      "gap": 7,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-7",
    "label": "Formenreihe 8",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "circle",
        "square",
        "square",
        "circle",
        "circle",
        "circle",
        "square",
        "circle"
      ],
      "gap": 7,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-8",
    "label": "Formenreihe 9",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "triangle",
        "circle",
        "circle",
        "triangle",
        "triangle",
        "triangle",
        "circle",
        "triangle"
      ],
      "gap": 7,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-9",
    "label": "Formenreihe 10",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "triangle",
        "square",
        "square",
        "triangle",
        "triangle",
        "triangle",
        "square",
        "triangle"
      ],
      "gap": 7,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-10",
    "label": "Formenreihe 11",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "square",
        "circle",
        "circle",
        "square",
        "square",
        "square",
        "circle",
        "square"
      ],
      "gap": 7,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-11",
    "label": "Formenreihe 12",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "square",
        "triangle",
        "triangle",
        "square",
        "square",
        "square",
        "triangle",
        "square"
      ],
      "gap": 7,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-12",
    "label": "Formenreihe 13",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "triangle",
        "circle",
        "triangle",
        "circle",
        "circle",
        "circle",
        "circle",
        "triangle"
      ],
      "gap": 8,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-13",
    "label": "Formenreihe 14",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "square",
        "circle",
        "square",
        "circle",
        "circle",
        "circle",
        "circle",
        "square"
      ],
      "gap": 8,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-14",
    "label": "Formenreihe 15",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "triangle",
        "triangle",
        "triangle",
        "circle"
      ],
      "gap": 8,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-15",
    "label": "Formenreihe 16",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "square",
        "triangle",
        "square",
        "triangle",
        "triangle",
        "triangle",
        "triangle",
        "square"
      ],
      "gap": 8,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-16",
    "label": "Formenreihe 17",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "circle",
        "square",
        "circle",
        "square",
        "square",
        "square",
        "square",
        "circle"
      ],
      "gap": 8,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-17",
    "label": "Formenreihe 18",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "triangle",
        "square",
        "triangle",
        "square",
        "square",
        "square",
        "square",
        "triangle"
      ],
      "gap": 8,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-18",
    "label": "Formenreihe 19",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "triangle",
        "circle",
        "circle",
        "circle",
        "triangle",
        "triangle",
        "circle",
        "circle"
      ],
      "gap": 6,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-19",
    "label": "Formenreihe 20",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "circle",
        "square",
        "circle",
        "circle",
        "circle",
        "square",
        "square",
        "circle",
        "circle"
      ],
      "gap": 6,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-20",
    "label": "Formenreihe 21",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "circle",
        "triangle",
        "triangle",
        "triangle",
        "circle",
        "circle",
        "triangle",
        "triangle"
      ],
      "gap": 6,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-21",
    "label": "Formenreihe 22",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "square",
        "triangle",
        "triangle",
        "triangle",
        "square",
        "square",
        "triangle",
        "triangle"
      ],
      "gap": 6,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-22",
    "label": "Formenreihe 23",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "circle",
        "square",
        "square",
        "square",
        "circle",
        "circle",
        "square",
        "square"
      ],
      "gap": 6,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-23",
    "label": "Formenreihe 24",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "square",
        "triangle",
        "square",
        "square",
        "square",
        "triangle",
        "triangle",
        "square",
        "square"
      ],
      "gap": 6,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  },
  {
    "id": "friends-beaver/matrix-24",
    "label": "Formenreihe 25",
    "question": {
      "kind": "matrix",
      "prompt": "Jede Reihe hat dieselben Formen gleich oft. Welche fehlt?",
      "matrix": [
        "triangle",
        "circle",
        "circle",
        "circle",
        "circle",
        "triangle",
        "circle",
        "triangle",
        "circle"
      ],
      "gap": 7,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square"
      ]
    }
  }
]
```
