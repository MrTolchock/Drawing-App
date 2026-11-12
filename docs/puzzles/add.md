# Äpfel rechnen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `add`
- Host: squirrel
- Related competence: **MA.1.A.3.a** — Sichtbare Gruppen addieren
- Difficulty: Zwei positive Summanden; Summe höchstens 10
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
| `add/1-1` | 1 + 1 — Wie viele Äpfel sind es zusammen? | 2 |
| `add/1-2` | 1 + 2 — Wie viele Äpfel sind es zusammen? | 3 |
| `add/1-3` | 1 + 3 — Wie viele Äpfel sind es zusammen? | 4 |
| `add/1-4` | 1 + 4 — Wie viele Äpfel sind es zusammen? | 5 |
| `add/1-5` | 1 + 5 — Wie viele Äpfel sind es zusammen? | 6 |
| `add/1-6` | 1 + 6 — Wie viele Äpfel sind es zusammen? | 7 |
| `add/1-7` | 1 + 7 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/1-8` | 1 + 8 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/2-1` | 2 + 1 — Wie viele Äpfel sind es zusammen? | 3 |
| `add/2-2` | 2 + 2 — Wie viele Äpfel sind es zusammen? | 4 |
| `add/2-3` | 2 + 3 — Wie viele Äpfel sind es zusammen? | 5 |
| `add/2-4` | 2 + 4 — Wie viele Äpfel sind es zusammen? | 6 |
| `add/2-5` | 2 + 5 — Wie viele Äpfel sind es zusammen? | 7 |
| `add/2-6` | 2 + 6 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/2-7` | 2 + 7 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/3-1` | 3 + 1 — Wie viele Äpfel sind es zusammen? | 4 |
| `add/3-2` | 3 + 2 — Wie viele Äpfel sind es zusammen? | 5 |
| `add/3-3` | 3 + 3 — Wie viele Äpfel sind es zusammen? | 6 |
| `add/3-4` | 3 + 4 — Wie viele Äpfel sind es zusammen? | 7 |
| `add/3-5` | 3 + 5 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/3-6` | 3 + 6 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/4-1` | 4 + 1 — Wie viele Äpfel sind es zusammen? | 5 |
| `add/4-2` | 4 + 2 — Wie viele Äpfel sind es zusammen? | 6 |
| `add/4-3` | 4 + 3 — Wie viele Äpfel sind es zusammen? | 7 |
| `add/4-4` | 4 + 4 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/4-5` | 4 + 5 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/5-1` | 5 + 1 — Wie viele Äpfel sind es zusammen? | 6 |
| `add/5-2` | 5 + 2 — Wie viele Äpfel sind es zusammen? | 7 |
| `add/5-3` | 5 + 3 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/5-4` | 5 + 4 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/6-1` | 6 + 1 — Wie viele Äpfel sind es zusammen? | 7 |
| `add/6-2` | 6 + 2 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/6-3` | 6 + 3 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/7-1` | 7 + 1 — Wie viele Äpfel sind es zusammen? | 8 |
| `add/7-2` | 7 + 2 — Wie viele Äpfel sind es zusammen? | 9 |
| `add/8-1` | 8 + 1 — Wie viele Äpfel sind es zusammen? | 9 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "add/1-1",
    "label": "1 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 1,
      "answer": 2,
      "choices": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "add/1-2",
    "label": "1 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 2,
      "answer": 3,
      "choices": [
        3,
        2,
        4
      ]
    }
  },
  {
    "id": "add/1-3",
    "label": "1 + 3",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 3,
      "answer": 4,
      "choices": [
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "add/1-4",
    "label": "1 + 4",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 4,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "add/1-5",
    "label": "1 + 5",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 5,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "add/1-6",
    "label": "1 + 6",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 6,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ]
    }
  },
  {
    "id": "add/1-7",
    "label": "1 + 7",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 7,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/1-8",
    "label": "1 + 8",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 1,
      "b": 8,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/2-1",
    "label": "2 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 1,
      "answer": 3,
      "choices": [
        3,
        2,
        4
      ]
    }
  },
  {
    "id": "add/2-2",
    "label": "2 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 2,
      "answer": 4,
      "choices": [
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "add/2-3",
    "label": "2 + 3",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 3,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "add/2-4",
    "label": "2 + 4",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 4,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "add/2-5",
    "label": "2 + 5",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 5,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ]
    }
  },
  {
    "id": "add/2-6",
    "label": "2 + 6",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 6,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/2-7",
    "label": "2 + 7",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 2,
      "b": 7,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/3-1",
    "label": "3 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 3,
      "b": 1,
      "answer": 4,
      "choices": [
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "add/3-2",
    "label": "3 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 3,
      "b": 2,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "add/3-3",
    "label": "3 + 3",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 3,
      "b": 3,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "add/3-4",
    "label": "3 + 4",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 3,
      "b": 4,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ]
    }
  },
  {
    "id": "add/3-5",
    "label": "3 + 5",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 3,
      "b": 5,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/3-6",
    "label": "3 + 6",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 3,
      "b": 6,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/4-1",
    "label": "4 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 4,
      "b": 1,
      "answer": 5,
      "choices": [
        5,
        4,
        6
      ]
    }
  },
  {
    "id": "add/4-2",
    "label": "4 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 4,
      "b": 2,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "add/4-3",
    "label": "4 + 3",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 4,
      "b": 3,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ]
    }
  },
  {
    "id": "add/4-4",
    "label": "4 + 4",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 4,
      "b": 4,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/4-5",
    "label": "4 + 5",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 4,
      "b": 5,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/5-1",
    "label": "5 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 5,
      "b": 1,
      "answer": 6,
      "choices": [
        6,
        5,
        7
      ]
    }
  },
  {
    "id": "add/5-2",
    "label": "5 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 5,
      "b": 2,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ]
    }
  },
  {
    "id": "add/5-3",
    "label": "5 + 3",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 5,
      "b": 3,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/5-4",
    "label": "5 + 4",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 5,
      "b": 4,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/6-1",
    "label": "6 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 6,
      "b": 1,
      "answer": 7,
      "choices": [
        7,
        6,
        8
      ]
    }
  },
  {
    "id": "add/6-2",
    "label": "6 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 6,
      "b": 2,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/6-3",
    "label": "6 + 3",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 6,
      "b": 3,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/7-1",
    "label": "7 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 7,
      "b": 1,
      "answer": 8,
      "choices": [
        8,
        7,
        9
      ]
    }
  },
  {
    "id": "add/7-2",
    "label": "7 + 2",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 7,
      "b": 2,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  },
  {
    "id": "add/8-1",
    "label": "8 + 1",
    "question": {
      "kind": "add",
      "prompt": "Wie viele Äpfel sind es zusammen?",
      "a": 8,
      "b": 1,
      "answer": 9,
      "choices": [
        9,
        8,
        10
      ]
    }
  }
]
```
