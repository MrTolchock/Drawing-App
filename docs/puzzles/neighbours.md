# Zahlennachbarn

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `neighbours`
- Host: squirrel
- Related competence: **MA.1.A.2.a/b** — Zahlennachbarn bestimmen
- Difficulty: Mitte 1–18; Mengenrahmen bis 20; ein Nachbar kann vorgegeben sein
- Pool: 36 explicit iterations; a round selects five.
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
| `neighbours/1-both` | Mitte 1 — Welche Zahlen kommen davor und danach? | [0,2] |
| `neighbours/1-left` | Mitte 1 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [0,2] |
| `neighbours/2-both` | Mitte 2 — Welche Zahlen kommen davor und danach? | [1,3] |
| `neighbours/2-left` | Mitte 2 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [1,3] |
| `neighbours/3-both` | Mitte 3 — Welche Zahlen kommen davor und danach? | [2,4] |
| `neighbours/3-left` | Mitte 3 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [2,4] |
| `neighbours/4-both` | Mitte 4 — Welche Zahlen kommen davor und danach? | [3,5] |
| `neighbours/4-left` | Mitte 4 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [3,5] |
| `neighbours/5-both` | Mitte 5 — Welche Zahlen kommen davor und danach? | [4,6] |
| `neighbours/5-left` | Mitte 5 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [4,6] |
| `neighbours/6-both` | Mitte 6 — Welche Zahlen kommen davor und danach? | [5,7] |
| `neighbours/6-left` | Mitte 6 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [5,7] |
| `neighbours/7-both` | Mitte 7 — Welche Zahlen kommen davor und danach? | [6,8] |
| `neighbours/7-left` | Mitte 7 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [6,8] |
| `neighbours/8-both` | Mitte 8 — Welche Zahlen kommen davor und danach? | [7,9] |
| `neighbours/8-left` | Mitte 8 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [7,9] |
| `neighbours/9-both` | Mitte 9 — Welche Zahlen kommen davor und danach? | [8,10] |
| `neighbours/9-left` | Mitte 9 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [8,10] |
| `neighbours/10-both` | Mitte 10 — Welche Zahlen kommen davor und danach? | [9,11] |
| `neighbours/10-left` | Mitte 10 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [9,11] |
| `neighbours/11-both` | Mitte 11 — Welche Zahlen kommen davor und danach? | [10,12] |
| `neighbours/11-left` | Mitte 11 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [10,12] |
| `neighbours/12-both` | Mitte 12 — Welche Zahlen kommen davor und danach? | [11,13] |
| `neighbours/12-left` | Mitte 12 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [11,13] |
| `neighbours/13-both` | Mitte 13 — Welche Zahlen kommen davor und danach? | [12,14] |
| `neighbours/13-left` | Mitte 13 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [12,14] |
| `neighbours/14-both` | Mitte 14 — Welche Zahlen kommen davor und danach? | [13,15] |
| `neighbours/14-left` | Mitte 14 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [13,15] |
| `neighbours/15-both` | Mitte 15 — Welche Zahlen kommen davor und danach? | [14,16] |
| `neighbours/15-left` | Mitte 15 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [14,16] |
| `neighbours/16-both` | Mitte 16 — Welche Zahlen kommen davor und danach? | [15,17] |
| `neighbours/16-left` | Mitte 16 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [15,17] |
| `neighbours/17-both` | Mitte 17 — Welche Zahlen kommen davor und danach? | [16,18] |
| `neighbours/17-left` | Mitte 17 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [16,18] |
| `neighbours/18-both` | Mitte 18 — Welche Zahlen kommen davor und danach? | [17,19] |
| `neighbours/18-left` | Mitte 18 / Vorgänger gegeben — Welche Zahlen kommen davor und danach? | [17,19] |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "neighbours/1-both",
    "label": "Mitte 1",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 1,
      "given": null,
      "answer": [
        0,
        2
      ],
      "choices": [
        0,
        2,
        3
      ]
    }
  },
  {
    "id": "neighbours/1-left",
    "label": "Mitte 1 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 1,
      "given": "left",
      "answer": [
        0,
        2
      ],
      "choices": [
        0,
        2,
        3
      ]
    }
  },
  {
    "id": "neighbours/2-both",
    "label": "Mitte 2",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 2,
      "given": null,
      "answer": [
        1,
        3
      ],
      "choices": [
        0,
        1,
        3,
        4
      ]
    }
  },
  {
    "id": "neighbours/2-left",
    "label": "Mitte 2 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 2,
      "given": "left",
      "answer": [
        1,
        3
      ],
      "choices": [
        0,
        1,
        3,
        4
      ]
    }
  },
  {
    "id": "neighbours/3-both",
    "label": "Mitte 3",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 3,
      "given": null,
      "answer": [
        2,
        4
      ],
      "choices": [
        1,
        2,
        4,
        5
      ]
    }
  },
  {
    "id": "neighbours/3-left",
    "label": "Mitte 3 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 3,
      "given": "left",
      "answer": [
        2,
        4
      ],
      "choices": [
        1,
        2,
        4,
        5
      ]
    }
  },
  {
    "id": "neighbours/4-both",
    "label": "Mitte 4",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 4,
      "given": null,
      "answer": [
        3,
        5
      ],
      "choices": [
        2,
        3,
        5,
        6
      ]
    }
  },
  {
    "id": "neighbours/4-left",
    "label": "Mitte 4 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 4,
      "given": "left",
      "answer": [
        3,
        5
      ],
      "choices": [
        2,
        3,
        5,
        6
      ]
    }
  },
  {
    "id": "neighbours/5-both",
    "label": "Mitte 5",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 5,
      "given": null,
      "answer": [
        4,
        6
      ],
      "choices": [
        3,
        4,
        6,
        7
      ]
    }
  },
  {
    "id": "neighbours/5-left",
    "label": "Mitte 5 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 5,
      "given": "left",
      "answer": [
        4,
        6
      ],
      "choices": [
        3,
        4,
        6,
        7
      ]
    }
  },
  {
    "id": "neighbours/6-both",
    "label": "Mitte 6",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 6,
      "given": null,
      "answer": [
        5,
        7
      ],
      "choices": [
        4,
        5,
        7,
        8
      ]
    }
  },
  {
    "id": "neighbours/6-left",
    "label": "Mitte 6 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 6,
      "given": "left",
      "answer": [
        5,
        7
      ],
      "choices": [
        4,
        5,
        7,
        8
      ]
    }
  },
  {
    "id": "neighbours/7-both",
    "label": "Mitte 7",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 7,
      "given": null,
      "answer": [
        6,
        8
      ],
      "choices": [
        5,
        6,
        8,
        9
      ]
    }
  },
  {
    "id": "neighbours/7-left",
    "label": "Mitte 7 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 7,
      "given": "left",
      "answer": [
        6,
        8
      ],
      "choices": [
        5,
        6,
        8,
        9
      ]
    }
  },
  {
    "id": "neighbours/8-both",
    "label": "Mitte 8",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 8,
      "given": null,
      "answer": [
        7,
        9
      ],
      "choices": [
        6,
        7,
        9,
        10
      ]
    }
  },
  {
    "id": "neighbours/8-left",
    "label": "Mitte 8 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 8,
      "given": "left",
      "answer": [
        7,
        9
      ],
      "choices": [
        6,
        7,
        9,
        10
      ]
    }
  },
  {
    "id": "neighbours/9-both",
    "label": "Mitte 9",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 9,
      "given": null,
      "answer": [
        8,
        10
      ],
      "choices": [
        7,
        8,
        10,
        11
      ]
    }
  },
  {
    "id": "neighbours/9-left",
    "label": "Mitte 9 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 9,
      "given": "left",
      "answer": [
        8,
        10
      ],
      "choices": [
        7,
        8,
        10,
        11
      ]
    }
  },
  {
    "id": "neighbours/10-both",
    "label": "Mitte 10",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 10,
      "given": null,
      "answer": [
        9,
        11
      ],
      "choices": [
        8,
        9,
        11,
        12
      ]
    }
  },
  {
    "id": "neighbours/10-left",
    "label": "Mitte 10 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 10,
      "given": "left",
      "answer": [
        9,
        11
      ],
      "choices": [
        8,
        9,
        11,
        12
      ]
    }
  },
  {
    "id": "neighbours/11-both",
    "label": "Mitte 11",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 11,
      "given": null,
      "answer": [
        10,
        12
      ],
      "choices": [
        9,
        10,
        12,
        13
      ]
    }
  },
  {
    "id": "neighbours/11-left",
    "label": "Mitte 11 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 11,
      "given": "left",
      "answer": [
        10,
        12
      ],
      "choices": [
        9,
        10,
        12,
        13
      ]
    }
  },
  {
    "id": "neighbours/12-both",
    "label": "Mitte 12",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 12,
      "given": null,
      "answer": [
        11,
        13
      ],
      "choices": [
        10,
        11,
        13,
        14
      ]
    }
  },
  {
    "id": "neighbours/12-left",
    "label": "Mitte 12 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 12,
      "given": "left",
      "answer": [
        11,
        13
      ],
      "choices": [
        10,
        11,
        13,
        14
      ]
    }
  },
  {
    "id": "neighbours/13-both",
    "label": "Mitte 13",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 13,
      "given": null,
      "answer": [
        12,
        14
      ],
      "choices": [
        11,
        12,
        14,
        15
      ]
    }
  },
  {
    "id": "neighbours/13-left",
    "label": "Mitte 13 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 13,
      "given": "left",
      "answer": [
        12,
        14
      ],
      "choices": [
        11,
        12,
        14,
        15
      ]
    }
  },
  {
    "id": "neighbours/14-both",
    "label": "Mitte 14",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 14,
      "given": null,
      "answer": [
        13,
        15
      ],
      "choices": [
        12,
        13,
        15,
        16
      ]
    }
  },
  {
    "id": "neighbours/14-left",
    "label": "Mitte 14 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 14,
      "given": "left",
      "answer": [
        13,
        15
      ],
      "choices": [
        12,
        13,
        15,
        16
      ]
    }
  },
  {
    "id": "neighbours/15-both",
    "label": "Mitte 15",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 15,
      "given": null,
      "answer": [
        14,
        16
      ],
      "choices": [
        13,
        14,
        16,
        17
      ]
    }
  },
  {
    "id": "neighbours/15-left",
    "label": "Mitte 15 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 15,
      "given": "left",
      "answer": [
        14,
        16
      ],
      "choices": [
        13,
        14,
        16,
        17
      ]
    }
  },
  {
    "id": "neighbours/16-both",
    "label": "Mitte 16",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 16,
      "given": null,
      "answer": [
        15,
        17
      ],
      "choices": [
        14,
        15,
        17,
        18
      ]
    }
  },
  {
    "id": "neighbours/16-left",
    "label": "Mitte 16 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 16,
      "given": "left",
      "answer": [
        15,
        17
      ],
      "choices": [
        14,
        15,
        17,
        18
      ]
    }
  },
  {
    "id": "neighbours/17-both",
    "label": "Mitte 17",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 17,
      "given": null,
      "answer": [
        16,
        18
      ],
      "choices": [
        15,
        16,
        18,
        19
      ]
    }
  },
  {
    "id": "neighbours/17-left",
    "label": "Mitte 17 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 17,
      "given": "left",
      "answer": [
        16,
        18
      ],
      "choices": [
        15,
        16,
        18,
        19
      ]
    }
  },
  {
    "id": "neighbours/18-both",
    "label": "Mitte 18",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 18,
      "given": null,
      "answer": [
        17,
        19
      ],
      "choices": [
        16,
        17,
        19,
        20
      ]
    }
  },
  {
    "id": "neighbours/18-left",
    "label": "Mitte 18 / Vorgänger gegeben",
    "question": {
      "kind": "neighbours",
      "prompt": "Welche Zahlen kommen davor und danach?",
      "n": 18,
      "given": "left",
      "answer": [
        17,
        19
      ],
      "choices": [
        16,
        17,
        19,
        20
      ]
    }
  }
]
```
