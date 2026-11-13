# Waldspiegel

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `mirror`
- Host: beaver
- Related competence: **MA.2.A.2.c** — Ein Muster spiegeln
- Difficulty: 3 × 3; drei bis fünf Blätter; senkrechte Spiegelachse
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
| `mirror/grid-7` | Blattmuster 1 — Ergänze rechts das Spiegelbild. | [0,1,2] |
| `mirror/grid-56` | Blattmuster 2 — Ergänze rechts das Spiegelbild. | [3,4,5] |
| `mirror/grid-448` | Blattmuster 3 — Ergänze rechts das Spiegelbild. | [6,7,8] |
| `mirror/grid-73` | Blattmuster 4 — Ergänze rechts das Spiegelbild. | [2,5,8] |
| `mirror/grid-146` | Blattmuster 5 — Ergänze rechts das Spiegelbild. | [1,4,7] |
| `mirror/grid-292` | Blattmuster 6 — Ergänze rechts das Spiegelbild. | [0,3,6] |
| `mirror/grid-273` | Blattmuster 7 — Ergänze rechts das Spiegelbild. | [2,4,6] |
| `mirror/grid-84` | Blattmuster 8 — Ergänze rechts das Spiegelbild. | [0,4,8] |
| `mirror/grid-15` | Blattmuster 9 — Ergänze rechts das Spiegelbild. | [0,1,2,5] |
| `mirror/grid-30` | Blattmuster 10 — Ergänze rechts das Spiegelbild. | [0,1,4,5] |
| `mirror/grid-60` | Blattmuster 11 — Ergänze rechts das Spiegelbild. | [0,3,4,5] |
| `mirror/grid-120` | Blattmuster 12 — Ergänze rechts das Spiegelbild. | [3,4,5,8] |
| `mirror/grid-240` | Blattmuster 13 — Ergänze rechts das Spiegelbild. | [3,4,7,8] |
| `mirror/grid-480` | Blattmuster 14 — Ergänze rechts das Spiegelbild. | [3,6,7,8] |
| `mirror/grid-31` | Blattmuster 15 — Ergänze rechts das Spiegelbild. | [0,1,2,4,5] |
| `mirror/grid-62` | Blattmuster 16 — Ergänze rechts das Spiegelbild. | [0,1,3,4,5] |
| `mirror/grid-124` | Blattmuster 17 — Ergänze rechts das Spiegelbild. | [0,3,4,5,8] |
| `mirror/grid-248` | Blattmuster 18 — Ergänze rechts das Spiegelbild. | [3,4,5,7,8] |
| `mirror/grid-496` | Blattmuster 19 — Ergänze rechts das Spiegelbild. | [3,4,6,7,8] |
| `mirror/grid-91` | Blattmuster 20 — Ergänze rechts das Spiegelbild. | [1,2,4,5,8] |
| `mirror/grid-182` | Blattmuster 21 — Ergänze rechts das Spiegelbild. | [0,1,3,4,7] |
| `mirror/grid-364` | Blattmuster 22 — Ergänze rechts das Spiegelbild. | [0,3,5,6,8] |
| `mirror/grid-341` | Blattmuster 23 — Ergänze rechts das Spiegelbild. | [0,2,4,6,8] |
| `mirror/grid-170` | Blattmuster 24 — Ergänze rechts das Spiegelbild. | [1,3,5,7] |
| `mirror/grid-85` | Blattmuster 25 — Ergänze rechts das Spiegelbild. | [0,2,4,8] |
| `mirror/grid-340` | Blattmuster 26 — Ergänze rechts das Spiegelbild. | [0,4,6,8] |
| `mirror/grid-325` | Blattmuster 27 — Ergänze rechts das Spiegelbild. | [0,2,6,8] |
| `mirror/grid-387` | Blattmuster 28 — Ergänze rechts das Spiegelbild. | [1,2,6,7] |
| `mirror/grid-457` | Blattmuster 29 — Ergänze rechts das Spiegelbild. | [2,5,6,7,8] |
| `mirror/grid-199` | Blattmuster 30 — Ergänze rechts das Spiegelbild. | [0,1,2,7,8] |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "mirror/grid-7",
    "label": "Blattmuster 1",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        1,
        2
      ],
      "answer": [
        0,
        1,
        2
      ]
    }
  },
  {
    "id": "mirror/grid-56",
    "label": "Blattmuster 2",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        3,
        4,
        5
      ],
      "answer": [
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "mirror/grid-448",
    "label": "Blattmuster 3",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        6,
        7,
        8
      ],
      "answer": [
        6,
        7,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-73",
    "label": "Blattmuster 4",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        3,
        6
      ],
      "answer": [
        2,
        5,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-146",
    "label": "Blattmuster 5",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        1,
        4,
        7
      ],
      "answer": [
        1,
        4,
        7
      ]
    }
  },
  {
    "id": "mirror/grid-292",
    "label": "Blattmuster 6",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        2,
        5,
        8
      ],
      "answer": [
        0,
        3,
        6
      ]
    }
  },
  {
    "id": "mirror/grid-273",
    "label": "Blattmuster 7",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        4,
        8
      ],
      "answer": [
        2,
        4,
        6
      ]
    }
  },
  {
    "id": "mirror/grid-84",
    "label": "Blattmuster 8",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        2,
        4,
        6
      ],
      "answer": [
        0,
        4,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-15",
    "label": "Blattmuster 9",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        1,
        2,
        3
      ],
      "answer": [
        0,
        1,
        2,
        5
      ]
    }
  },
  {
    "id": "mirror/grid-30",
    "label": "Blattmuster 10",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        1,
        2,
        3,
        4
      ],
      "answer": [
        0,
        1,
        4,
        5
      ]
    }
  },
  {
    "id": "mirror/grid-60",
    "label": "Blattmuster 11",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        2,
        3,
        4,
        5
      ],
      "answer": [
        0,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "mirror/grid-120",
    "label": "Blattmuster 12",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        3,
        4,
        5,
        6
      ],
      "answer": [
        3,
        4,
        5,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-240",
    "label": "Blattmuster 13",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        4,
        5,
        6,
        7
      ],
      "answer": [
        3,
        4,
        7,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-480",
    "label": "Blattmuster 14",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        5,
        6,
        7,
        8
      ],
      "answer": [
        3,
        6,
        7,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-31",
    "label": "Blattmuster 15",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        1,
        2,
        3,
        4
      ],
      "answer": [
        0,
        1,
        2,
        4,
        5
      ]
    }
  },
  {
    "id": "mirror/grid-62",
    "label": "Blattmuster 16",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        1,
        2,
        3,
        4,
        5
      ],
      "answer": [
        0,
        1,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "mirror/grid-124",
    "label": "Blattmuster 17",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        2,
        3,
        4,
        5,
        6
      ],
      "answer": [
        0,
        3,
        4,
        5,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-248",
    "label": "Blattmuster 18",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        3,
        4,
        5,
        6,
        7
      ],
      "answer": [
        3,
        4,
        5,
        7,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-496",
    "label": "Blattmuster 19",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        4,
        5,
        6,
        7,
        8
      ],
      "answer": [
        3,
        4,
        6,
        7,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-91",
    "label": "Blattmuster 20",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        1,
        3,
        4,
        6
      ],
      "answer": [
        1,
        2,
        4,
        5,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-182",
    "label": "Blattmuster 21",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        1,
        2,
        4,
        5,
        7
      ],
      "answer": [
        0,
        1,
        3,
        4,
        7
      ]
    }
  },
  {
    "id": "mirror/grid-364",
    "label": "Blattmuster 22",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        2,
        3,
        5,
        6,
        8
      ],
      "answer": [
        0,
        3,
        5,
        6,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-341",
    "label": "Blattmuster 23",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        2,
        4,
        6,
        8
      ],
      "answer": [
        0,
        2,
        4,
        6,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-170",
    "label": "Blattmuster 24",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        1,
        3,
        5,
        7
      ],
      "answer": [
        1,
        3,
        5,
        7
      ]
    }
  },
  {
    "id": "mirror/grid-85",
    "label": "Blattmuster 25",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        2,
        4,
        6
      ],
      "answer": [
        0,
        2,
        4,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-340",
    "label": "Blattmuster 26",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        2,
        4,
        6,
        8
      ],
      "answer": [
        0,
        4,
        6,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-325",
    "label": "Blattmuster 27",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        2,
        6,
        8
      ],
      "answer": [
        0,
        2,
        6,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-387",
    "label": "Blattmuster 28",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        1,
        7,
        8
      ],
      "answer": [
        1,
        2,
        6,
        7
      ]
    }
  },
  {
    "id": "mirror/grid-457",
    "label": "Blattmuster 29",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        3,
        6,
        7,
        8
      ],
      "answer": [
        2,
        5,
        6,
        7,
        8
      ]
    }
  },
  {
    "id": "mirror/grid-199",
    "label": "Blattmuster 30",
    "question": {
      "kind": "mirror",
      "prompt": "Ergänze rechts das Spiegelbild.",
      "width": 3,
      "rows": 3,
      "left": [
        0,
        1,
        2,
        6,
        7
      ],
      "answer": [
        0,
        1,
        2,
        7,
        8
      ]
    }
  }
]
```
