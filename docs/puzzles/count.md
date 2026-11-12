# Waldkäfer zählen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `count`
- Host: squirrel
- Related competence: **MA.1.A.2.a** — Gezielt Mengen zählen
- Difficulty: 6–15 Marienkäfer zwischen Bienen und Schnecken
- Pool: 30 explicit iterations; a round selects five.
- Review: every iteration plus the puzzle checklist must be approved for this exact revision. New/changed items or difficulty require review again.

## Mapping to the blueprint

| Contract | Implementation |
| --- | --- |
| Drawn pictures | Existing woodland sheets; SVG for geometry and tracing |
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
| `count/6-2` | 6 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 6 |
| `count/6-3` | 6 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 6 |
| `count/6-4` | 6 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 6 |
| `count/7-2` | 7 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 7 |
| `count/7-3` | 7 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 7 |
| `count/7-4` | 7 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 7 |
| `count/8-2` | 8 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 8 |
| `count/8-3` | 8 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 8 |
| `count/8-4` | 8 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 8 |
| `count/9-2` | 9 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 9 |
| `count/9-3` | 9 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 9 |
| `count/9-4` | 9 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 9 |
| `count/10-2` | 10 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 10 |
| `count/10-3` | 10 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 10 |
| `count/10-4` | 10 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 10 |
| `count/11-2` | 11 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 11 |
| `count/11-3` | 11 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 11 |
| `count/11-4` | 11 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 11 |
| `count/12-2` | 12 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 12 |
| `count/12-3` | 12 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 12 |
| `count/12-4` | 12 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 12 |
| `count/13-2` | 13 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 13 |
| `count/13-3` | 13 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 13 |
| `count/13-4` | 13 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 13 |
| `count/14-2` | 14 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 14 |
| `count/14-3` | 14 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 14 |
| `count/14-4` | 14 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 14 |
| `count/15-2` | 15 Käfer, 2 Bienen — Wie viele rote Marienkäfer sind hier? | 15 |
| `count/15-3` | 15 Käfer, 3 Bienen — Wie viele rote Marienkäfer sind hier? | 15 |
| `count/15-4` | 15 Käfer, 4 Bienen — Wie viele rote Marienkäfer sind hier? | 15 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "count/6-2",
    "label": "6 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 6,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/6-3",
    "label": "6 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 6,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/6-4",
    "label": "6 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 6,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/7-2",
    "label": "7 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 7,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/7-3",
    "label": "7 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 7,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/7-4",
    "label": "7 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 7,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/8-2",
    "label": "8 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 8,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/8-3",
    "label": "8 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 8,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/8-4",
    "label": "8 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 8,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/9-2",
    "label": "9 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 9,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/9-3",
    "label": "9 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 9,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/9-4",
    "label": "9 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 9,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/10-2",
    "label": "10 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 10,
      "answer": 10,
      "choices": [
        10,
        9,
        11
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/10-3",
    "label": "10 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 10,
      "answer": 10,
      "choices": [
        10,
        9,
        11
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/10-4",
    "label": "10 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 10,
      "answer": 10,
      "choices": [
        10,
        9,
        11
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/11-2",
    "label": "11 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 11,
      "answer": 11,
      "choices": [
        11,
        10,
        12
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/11-3",
    "label": "11 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 11,
      "answer": 11,
      "choices": [
        11,
        10,
        12
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/11-4",
    "label": "11 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 11,
      "answer": 11,
      "choices": [
        11,
        10,
        12
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/12-2",
    "label": "12 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 12,
      "answer": 12,
      "choices": [
        12,
        11,
        13
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/12-3",
    "label": "12 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 12,
      "answer": 12,
      "choices": [
        12,
        11,
        13
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/12-4",
    "label": "12 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 12,
      "answer": 12,
      "choices": [
        12,
        11,
        13
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/13-2",
    "label": "13 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 13,
      "answer": 13,
      "choices": [
        13,
        12,
        14
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/13-3",
    "label": "13 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 13,
      "answer": 13,
      "choices": [
        13,
        12,
        14
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/13-4",
    "label": "13 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 13,
      "answer": 13,
      "choices": [
        13,
        12,
        14
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/14-2",
    "label": "14 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 14,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/14-3",
    "label": "14 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 14,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/14-4",
    "label": "14 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 14,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/15-2",
    "label": "15 Käfer, 2 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 15,
      "answer": 15,
      "choices": [
        15,
        14,
        16
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/15-3",
    "label": "15 Käfer, 3 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 15,
      "answer": 15,
      "choices": [
        15,
        14,
        16
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  },
  {
    "id": "count/15-4",
    "label": "15 Käfer, 4 Bienen",
    "question": {
      "kind": "count",
      "prompt": "Wie viele rote Marienkäfer sind hier?",
      "count": 15,
      "answer": 15,
      "choices": [
        15,
        14,
        16
      ],
      "bugs": [
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "ladybird",
        "bee",
        "bee",
        "bee",
        "bee",
        "snail",
        "snail"
      ]
    }
  }
]
```
