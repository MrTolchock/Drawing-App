# Am Bach zählen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-kingfisher`
- Host: kingfisher
- Related competence: **MA.1.A.2.a** — Dinge am Bach zählen
- Difficulty: 2–20; sechs verschiedene Gegenstände
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
| `friends-kingfisher/forest-feather-2` | 2 × forest-feather — Wie viele Dinge sind hier? | 2 |
| `friends-kingfisher/forest-feather-5` | 5 × forest-feather — Wie viele Dinge sind hier? | 5 |
| `friends-kingfisher/forest-feather-9` | 9 × forest-feather — Wie viele Dinge sind hier? | 9 |
| `friends-kingfisher/forest-feather-14` | 14 × forest-feather — Wie viele Dinge sind hier? | 14 |
| `friends-kingfisher/forest-feather-20` | 20 × forest-feather — Wie viele Dinge sind hier? | 20 |
| `friends-kingfisher/forest-leaf-2` | 2 × forest-leaf — Wie viele Dinge sind hier? | 2 |
| `friends-kingfisher/forest-leaf-5` | 5 × forest-leaf — Wie viele Dinge sind hier? | 5 |
| `friends-kingfisher/forest-leaf-9` | 9 × forest-leaf — Wie viele Dinge sind hier? | 9 |
| `friends-kingfisher/forest-leaf-14` | 14 × forest-leaf — Wie viele Dinge sind hier? | 14 |
| `friends-kingfisher/forest-leaf-20` | 20 × forest-leaf — Wie viele Dinge sind hier? | 20 |
| `friends-kingfisher/forest-stone-2` | 2 × forest-stone — Wie viele Dinge sind hier? | 2 |
| `friends-kingfisher/forest-stone-5` | 5 × forest-stone — Wie viele Dinge sind hier? | 5 |
| `friends-kingfisher/forest-stone-9` | 9 × forest-stone — Wie viele Dinge sind hier? | 9 |
| `friends-kingfisher/forest-stone-14` | 14 × forest-stone — Wie viele Dinge sind hier? | 14 |
| `friends-kingfisher/forest-stone-20` | 20 × forest-stone — Wie viele Dinge sind hier? | 20 |
| `friends-kingfisher/forest-flower-2` | 2 × forest-flower — Wie viele Dinge sind hier? | 2 |
| `friends-kingfisher/forest-flower-5` | 5 × forest-flower — Wie viele Dinge sind hier? | 5 |
| `friends-kingfisher/forest-flower-9` | 9 × forest-flower — Wie viele Dinge sind hier? | 9 |
| `friends-kingfisher/forest-flower-14` | 14 × forest-flower — Wie viele Dinge sind hier? | 14 |
| `friends-kingfisher/forest-flower-20` | 20 × forest-flower — Wie viele Dinge sind hier? | 20 |
| `friends-kingfisher/forest-berry-2` | 2 × forest-berry — Wie viele Dinge sind hier? | 2 |
| `friends-kingfisher/forest-berry-5` | 5 × forest-berry — Wie viele Dinge sind hier? | 5 |
| `friends-kingfisher/forest-berry-9` | 9 × forest-berry — Wie viele Dinge sind hier? | 9 |
| `friends-kingfisher/forest-berry-14` | 14 × forest-berry — Wie viele Dinge sind hier? | 14 |
| `friends-kingfisher/forest-berry-20` | 20 × forest-berry — Wie viele Dinge sind hier? | 20 |
| `friends-kingfisher/forest-mushroom-2` | 2 × forest-mushroom — Wie viele Dinge sind hier? | 2 |
| `friends-kingfisher/forest-mushroom-5` | 5 × forest-mushroom — Wie viele Dinge sind hier? | 5 |
| `friends-kingfisher/forest-mushroom-9` | 9 × forest-mushroom — Wie viele Dinge sind hier? | 9 |
| `friends-kingfisher/forest-mushroom-14` | 14 × forest-mushroom — Wie viele Dinge sind hier? | 14 |
| `friends-kingfisher/forest-mushroom-20` | 20 × forest-mushroom — Wie viele Dinge sind hier? | 20 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-kingfisher/forest-feather-2",
    "label": "2 × forest-feather",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 2,
      "item": "forest-feather",
      "columns": 5,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-feather-5",
    "label": "5 × forest-feather",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 5,
      "item": "forest-feather",
      "columns": 5,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-feather-9",
    "label": "9 × forest-feather",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 9,
      "item": "forest-feather",
      "columns": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-feather-14",
    "label": "14 × forest-feather",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 14,
      "item": "forest-feather",
      "columns": 5,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-feather-20",
    "label": "20 × forest-feather",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 20,
      "item": "forest-feather",
      "columns": 5,
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-leaf-2",
    "label": "2 × forest-leaf",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 2,
      "item": "forest-leaf",
      "columns": 5,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-leaf-5",
    "label": "5 × forest-leaf",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 5,
      "item": "forest-leaf",
      "columns": 5,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-leaf-9",
    "label": "9 × forest-leaf",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 9,
      "item": "forest-leaf",
      "columns": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-leaf-14",
    "label": "14 × forest-leaf",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 14,
      "item": "forest-leaf",
      "columns": 5,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-leaf-20",
    "label": "20 × forest-leaf",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 20,
      "item": "forest-leaf",
      "columns": 5,
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-stone-2",
    "label": "2 × forest-stone",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 2,
      "item": "forest-stone",
      "columns": 5,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-stone-5",
    "label": "5 × forest-stone",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 5,
      "item": "forest-stone",
      "columns": 5,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-stone-9",
    "label": "9 × forest-stone",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 9,
      "item": "forest-stone",
      "columns": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-stone-14",
    "label": "14 × forest-stone",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 14,
      "item": "forest-stone",
      "columns": 5,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-stone-20",
    "label": "20 × forest-stone",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 20,
      "item": "forest-stone",
      "columns": 5,
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-flower-2",
    "label": "2 × forest-flower",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 2,
      "item": "forest-flower",
      "columns": 5,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-flower-5",
    "label": "5 × forest-flower",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 5,
      "item": "forest-flower",
      "columns": 5,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-flower-9",
    "label": "9 × forest-flower",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 9,
      "item": "forest-flower",
      "columns": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-flower-14",
    "label": "14 × forest-flower",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 14,
      "item": "forest-flower",
      "columns": 5,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-flower-20",
    "label": "20 × forest-flower",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 20,
      "item": "forest-flower",
      "columns": 5,
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-berry-2",
    "label": "2 × forest-berry",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 2,
      "item": "forest-berry",
      "columns": 5,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-berry-5",
    "label": "5 × forest-berry",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 5,
      "item": "forest-berry",
      "columns": 5,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-berry-9",
    "label": "9 × forest-berry",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 9,
      "item": "forest-berry",
      "columns": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-berry-14",
    "label": "14 × forest-berry",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 14,
      "item": "forest-berry",
      "columns": 5,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-berry-20",
    "label": "20 × forest-berry",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 20,
      "item": "forest-berry",
      "columns": 5,
      "answer": 20,
      "choices": [
        20,
        19,
        18
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-mushroom-2",
    "label": "2 × forest-mushroom",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 2,
      "item": "forest-mushroom",
      "columns": 5,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-mushroom-5",
    "label": "5 × forest-mushroom",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 5,
      "item": "forest-mushroom",
      "columns": 5,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-mushroom-9",
    "label": "9 × forest-mushroom",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 9,
      "item": "forest-mushroom",
      "columns": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-mushroom-14",
    "label": "14 × forest-mushroom",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 14,
      "item": "forest-mushroom",
      "columns": 5,
      "answer": 14,
      "choices": [
        14,
        13,
        15
      ]
    }
  },
  {
    "id": "friends-kingfisher/forest-mushroom-20",
    "label": "20 × forest-mushroom",
    "question": {
      "kind": "nuts",
      "prompt": "Wie viele Dinge sind hier?",
      "count": 20,
      "item": "forest-mushroom",
      "columns": 5,
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
