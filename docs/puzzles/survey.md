# Waldumfrage

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `survey`
- Host: owl
- Related competence: **MA.3.C.1.a/b** — Eine Bildumfrage auswerten
- Difficulty: Drei Obstsorten; 1–6 Stimmen; zählen oder eindeutiges Maximum
- Pool: 30 explicit iterations; a round selects five.
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
| `survey/survey-0` | Umfrage 1 / count — Wie viele Freunde wählen den Apfel? | 1 |
| `survey/survey-1` | Umfrage 2 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-2` | Umfrage 3 / count — Wie viele Freunde wählen die Beere? | 2 |
| `survey/survey-3` | Umfrage 4 / most — Welches Obst mögen die meisten Freunde? | "forest-berry" |
| `survey/survey-4` | Umfrage 5 / count — Wie viele Freunde wählen die Birne? | 5 |
| `survey/survey-5` | Umfrage 6 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-6` | Umfrage 7 / count — Wie viele Freunde wählen den Apfel? | 1 |
| `survey/survey-7` | Umfrage 8 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-8` | Umfrage 9 / count — Wie viele Freunde wählen die Beere? | 5 |
| `survey/survey-9` | Umfrage 10 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-10` | Umfrage 11 / count — Wie viele Freunde wählen die Birne? | 5 |
| `survey/survey-11` | Umfrage 12 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-12` | Umfrage 13 / count — Wie viele Freunde wählen den Apfel? | 1 |
| `survey/survey-13` | Umfrage 14 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-14` | Umfrage 15 / count — Wie viele Freunde wählen die Beere? | 3 |
| `survey/survey-15` | Umfrage 16 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-16` | Umfrage 17 / count — Wie viele Freunde wählen die Birne? | 5 |
| `survey/survey-17` | Umfrage 18 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-18` | Umfrage 19 / count — Wie viele Freunde wählen den Apfel? | 1 |
| `survey/survey-19` | Umfrage 20 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-20` | Umfrage 21 / count — Wie viele Freunde wählen die Beere? | 1 |
| `survey/survey-21` | Umfrage 22 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-22` | Umfrage 23 / count — Wie viele Freunde wählen die Birne? | 5 |
| `survey/survey-23` | Umfrage 24 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-24` | Umfrage 25 / count — Wie viele Freunde wählen den Apfel? | 1 |
| `survey/survey-25` | Umfrage 26 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-26` | Umfrage 27 / count — Wie viele Freunde wählen die Beere? | 4 |
| `survey/survey-27` | Umfrage 28 / most — Welches Obst mögen die meisten Freunde? | "pear" |
| `survey/survey-28` | Umfrage 29 / count — Wie viele Freunde wählen die Birne? | 5 |
| `survey/survey-29` | Umfrage 30 / most — Welches Obst mögen die meisten Freunde? | "pear" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "survey/survey-0",
    "label": "Umfrage 1 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen den Apfel?",
      "counts": [
        1,
        4,
        1
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "count",
      "answer": 1,
      "choices": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "survey/survey-1",
    "label": "Umfrage 2 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        2,
        5,
        4
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-2",
    "label": "Umfrage 3 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Beere?",
      "counts": [
        3,
        6,
        2
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "count",
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "survey/survey-3",
    "label": "Umfrage 4 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        1,
        4,
        5
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "most",
      "answer": "forest-berry",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-4",
    "label": "Umfrage 5 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Birne?",
      "counts": [
        2,
        5,
        3
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "count",
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "survey/survey-5",
    "label": "Umfrage 6 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        3,
        6,
        1
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-6",
    "label": "Umfrage 7 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen den Apfel?",
      "counts": [
        1,
        4,
        4
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "count",
      "answer": 1,
      "choices": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "survey/survey-7",
    "label": "Umfrage 8 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        2,
        5,
        2
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-8",
    "label": "Umfrage 9 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Beere?",
      "counts": [
        3,
        6,
        5
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "count",
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "survey/survey-9",
    "label": "Umfrage 10 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        1,
        4,
        3
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-10",
    "label": "Umfrage 11 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Birne?",
      "counts": [
        2,
        5,
        1
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "count",
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "survey/survey-11",
    "label": "Umfrage 12 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        3,
        6,
        4
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-12",
    "label": "Umfrage 13 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen den Apfel?",
      "counts": [
        1,
        4,
        2
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "count",
      "answer": 1,
      "choices": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "survey/survey-13",
    "label": "Umfrage 14 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        2,
        6,
        5
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-14",
    "label": "Umfrage 15 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Beere?",
      "counts": [
        3,
        6,
        3
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "count",
      "answer": 3,
      "choices": [
        3,
        2,
        4
      ]
    }
  },
  {
    "id": "survey/survey-15",
    "label": "Umfrage 16 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        1,
        4,
        1
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-16",
    "label": "Umfrage 17 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Birne?",
      "counts": [
        2,
        5,
        4
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "count",
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "survey/survey-17",
    "label": "Umfrage 18 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        3,
        6,
        2
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-18",
    "label": "Umfrage 19 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen den Apfel?",
      "counts": [
        1,
        4,
        5
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "count",
      "answer": 1,
      "choices": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "survey/survey-19",
    "label": "Umfrage 20 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        2,
        5,
        3
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-20",
    "label": "Umfrage 21 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Beere?",
      "counts": [
        3,
        6,
        1
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "count",
      "answer": 1,
      "choices": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "survey/survey-21",
    "label": "Umfrage 22 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        1,
        6,
        4
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-22",
    "label": "Umfrage 23 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Birne?",
      "counts": [
        2,
        5,
        2
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "count",
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "survey/survey-23",
    "label": "Umfrage 24 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        3,
        6,
        5
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-24",
    "label": "Umfrage 25 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen den Apfel?",
      "counts": [
        1,
        4,
        3
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "count",
      "answer": 1,
      "choices": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "survey/survey-25",
    "label": "Umfrage 26 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        2,
        5,
        1
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-26",
    "label": "Umfrage 27 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Beere?",
      "counts": [
        3,
        6,
        4
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "count",
      "answer": 4,
      "choices": [
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "survey/survey-27",
    "label": "Umfrage 28 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        1,
        4,
        2
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 0,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  },
  {
    "id": "survey/survey-28",
    "label": "Umfrage 29 / count",
    "question": {
      "kind": "survey",
      "prompt": "Wie viele Freunde wählen die Birne?",
      "counts": [
        2,
        5,
        5
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 1,
      "task": "count",
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "survey/survey-29",
    "label": "Umfrage 30 / most",
    "question": {
      "kind": "survey",
      "prompt": "Welches Obst mögen die meisten Freunde?",
      "counts": [
        3,
        6,
        3
      ],
      "fruit": [
        "forest-apple",
        "pear",
        "forest-berry"
      ],
      "target": 2,
      "task": "most",
      "answer": "pear",
      "choices": [
        "forest-apple",
        "pear",
        "forest-berry"
      ]
    }
  }
]
```
