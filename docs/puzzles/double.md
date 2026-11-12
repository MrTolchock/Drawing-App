# Nüsse verdoppeln

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `double`
- Host: beaver
- Related competence: **MA.1.A.3.a** — Gleich grosse Gruppen verdoppeln
- Difficulty: 2–10 Nüsse; bis 20; teilweise vorhandene Partner ergänzen
- Pool: 26 explicit iterations; a round selects five.
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
| `double/2-0` | 2 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 4 |
| `double/2-1` | 2 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 4 |
| `double/3-0` | 3 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 6 |
| `double/3-1` | 3 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 6 |
| `double/3-2` | 3 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 6 |
| `double/4-0` | 4 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 8 |
| `double/4-1` | 4 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 8 |
| `double/4-2` | 4 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 8 |
| `double/5-0` | 5 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 10 |
| `double/5-1` | 5 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 10 |
| `double/5-2` | 5 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 10 |
| `double/6-0` | 6 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 12 |
| `double/6-1` | 6 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 12 |
| `double/6-2` | 6 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 12 |
| `double/7-0` | 7 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 14 |
| `double/7-1` | 7 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 14 |
| `double/7-2` | 7 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 14 |
| `double/8-0` | 8 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 16 |
| `double/8-1` | 8 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 16 |
| `double/8-2` | 8 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 16 |
| `double/9-0` | 9 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 18 |
| `double/9-1` | 9 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 18 |
| `double/9-2` | 9 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 18 |
| `double/10-0` | 10 Nüsse, 0 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 20 |
| `double/10-1` | 10 Nüsse, 1 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 20 |
| `double/10-2` | 10 Nüsse, 2 Partner schon da — Noch einmal gleich viele. Wie viele zusammen? | 20 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "double/2-0",
    "label": "2 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 2,
      "partners": [],
      "answer": 4,
      "choices": [
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "double/2-1",
    "label": "2 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 2,
      "partners": [
        0
      ],
      "answer": 4,
      "choices": [
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "double/3-0",
    "label": "3 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 3,
      "partners": [],
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "double/3-1",
    "label": "3 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 3,
      "partners": [
        0
      ],
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "double/3-2",
    "label": "3 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 3,
      "partners": [
        0,
        1
      ],
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "double/4-0",
    "label": "4 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 4,
      "partners": [],
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "double/4-1",
    "label": "4 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 4,
      "partners": [
        0
      ],
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "double/4-2",
    "label": "4 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 4,
      "partners": [
        0,
        1
      ],
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "double/5-0",
    "label": "5 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 5,
      "partners": [],
      "answer": 10,
      "choices": [
        10,
        9,
        11
      ]
    }
  },
  {
    "id": "double/5-1",
    "label": "5 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 5,
      "partners": [
        0
      ],
      "answer": 10,
      "choices": [
        10,
        9,
        11
      ]
    }
  },
  {
    "id": "double/5-2",
    "label": "5 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 5,
      "partners": [
        0,
        1
      ],
      "answer": 10,
      "choices": [
        10,
        9,
        11
      ]
    }
  },
  {
    "id": "double/6-0",
    "label": "6 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 6,
      "partners": [],
      "answer": 12,
      "choices": [
        12,
        11,
        13
      ]
    }
  },
  {
    "id": "double/6-1",
    "label": "6 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 6,
      "partners": [
        0
      ],
      "answer": 12,
      "choices": [
        12,
        11,
        13
      ]
    }
  },
  {
    "id": "double/6-2",
    "label": "6 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 6,
      "partners": [
        0,
        1
      ],
      "answer": 12,
      "choices": [
        12,
        11,
        13
      ]
    }
  },
  {
    "id": "double/7-0",
    "label": "7 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 7,
      "partners": [],
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "double/7-1",
    "label": "7 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 7,
      "partners": [
        0
      ],
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "double/7-2",
    "label": "7 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 7,
      "partners": [
        0,
        1
      ],
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "double/8-0",
    "label": "8 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 8,
      "partners": [],
      "answer": 16,
      "choices": [
        16,
        15,
        17
      ]
    }
  },
  {
    "id": "double/8-1",
    "label": "8 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 8,
      "partners": [
        0
      ],
      "answer": 16,
      "choices": [
        16,
        15,
        17
      ]
    }
  },
  {
    "id": "double/8-2",
    "label": "8 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 8,
      "partners": [
        0,
        1
      ],
      "answer": 16,
      "choices": [
        16,
        15,
        17
      ]
    }
  },
  {
    "id": "double/9-0",
    "label": "9 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 9,
      "partners": [],
      "answer": 18,
      "choices": [
        18,
        17,
        19
      ]
    }
  },
  {
    "id": "double/9-1",
    "label": "9 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 9,
      "partners": [
        0
      ],
      "answer": 18,
      "choices": [
        18,
        17,
        19
      ]
    }
  },
  {
    "id": "double/9-2",
    "label": "9 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 9,
      "partners": [
        0,
        1
      ],
      "answer": 18,
      "choices": [
        18,
        17,
        19
      ]
    }
  },
  {
    "id": "double/10-0",
    "label": "10 Nüsse, 0 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 10,
      "partners": [],
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "double/10-1",
    "label": "10 Nüsse, 1 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 10,
      "partners": [
        0
      ],
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "double/10-2",
    "label": "10 Nüsse, 2 Partner schon da",
    "question": {
      "kind": "double",
      "prompt": "Noch einmal gleich viele. Wie viele zusammen?",
      "n": 10,
      "partners": [
        0,
        1
      ],
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  }
]
```
