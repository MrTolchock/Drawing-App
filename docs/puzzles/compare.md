# Beeren vergleichen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `compare`
- Host: squirrel
- Related competence: **MA.1.A.1.a (Übung)** — Mengen vergleichen
- Difficulty: 1–10 Beeren; mehr oder gleich viele
- Pool: 28 explicit iterations; a round selects five.
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
| `compare/1-1` | 1 und 1 — Wo sind mehr Beeren? | "equal" |
| `compare/1-3` | 1 und 3 — Wo sind mehr Beeren? | "right" |
| `compare/2-2` | 2 und 2 — Wo sind mehr Beeren? | "equal" |
| `compare/2-1` | 2 und 1 — Wo sind mehr Beeren? | "left" |
| `compare/2-4` | 2 und 4 — Wo sind mehr Beeren? | "right" |
| `compare/3-3` | 3 und 3 — Wo sind mehr Beeren? | "equal" |
| `compare/3-2` | 3 und 2 — Wo sind mehr Beeren? | "left" |
| `compare/3-5` | 3 und 5 — Wo sind mehr Beeren? | "right" |
| `compare/4-4` | 4 und 4 — Wo sind mehr Beeren? | "equal" |
| `compare/4-3` | 4 und 3 — Wo sind mehr Beeren? | "left" |
| `compare/4-6` | 4 und 6 — Wo sind mehr Beeren? | "right" |
| `compare/5-5` | 5 und 5 — Wo sind mehr Beeren? | "equal" |
| `compare/5-4` | 5 und 4 — Wo sind mehr Beeren? | "left" |
| `compare/5-7` | 5 und 7 — Wo sind mehr Beeren? | "right" |
| `compare/6-6` | 6 und 6 — Wo sind mehr Beeren? | "equal" |
| `compare/6-5` | 6 und 5 — Wo sind mehr Beeren? | "left" |
| `compare/6-8` | 6 und 8 — Wo sind mehr Beeren? | "right" |
| `compare/7-7` | 7 und 7 — Wo sind mehr Beeren? | "equal" |
| `compare/7-6` | 7 und 6 — Wo sind mehr Beeren? | "left" |
| `compare/7-9` | 7 und 9 — Wo sind mehr Beeren? | "right" |
| `compare/8-8` | 8 und 8 — Wo sind mehr Beeren? | "equal" |
| `compare/8-7` | 8 und 7 — Wo sind mehr Beeren? | "left" |
| `compare/8-10` | 8 und 10 — Wo sind mehr Beeren? | "right" |
| `compare/9-9` | 9 und 9 — Wo sind mehr Beeren? | "equal" |
| `compare/9-8` | 9 und 8 — Wo sind mehr Beeren? | "left" |
| `compare/9-10` | 9 und 10 — Wo sind mehr Beeren? | "right" |
| `compare/10-10` | 10 und 10 — Wo sind mehr Beeren? | "equal" |
| `compare/10-9` | 10 und 9 — Wo sind mehr Beeren? | "left" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "compare/1-1",
    "label": "1 und 1",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 1,
      "b": 1,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/1-3",
    "label": "1 und 3",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 1,
      "b": 3,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/2-2",
    "label": "2 und 2",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 2,
      "b": 2,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/2-1",
    "label": "2 und 1",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 2,
      "b": 1,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/2-4",
    "label": "2 und 4",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 2,
      "b": 4,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/3-3",
    "label": "3 und 3",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 3,
      "b": 3,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/3-2",
    "label": "3 und 2",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 3,
      "b": 2,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/3-5",
    "label": "3 und 5",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 3,
      "b": 5,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/4-4",
    "label": "4 und 4",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 4,
      "b": 4,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/4-3",
    "label": "4 und 3",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 4,
      "b": 3,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/4-6",
    "label": "4 und 6",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 4,
      "b": 6,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/5-5",
    "label": "5 und 5",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 5,
      "b": 5,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/5-4",
    "label": "5 und 4",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 5,
      "b": 4,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/5-7",
    "label": "5 und 7",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 5,
      "b": 7,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/6-6",
    "label": "6 und 6",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 6,
      "b": 6,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/6-5",
    "label": "6 und 5",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 6,
      "b": 5,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/6-8",
    "label": "6 und 8",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 6,
      "b": 8,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/7-7",
    "label": "7 und 7",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 7,
      "b": 7,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/7-6",
    "label": "7 und 6",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 7,
      "b": 6,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/7-9",
    "label": "7 und 9",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 7,
      "b": 9,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/8-8",
    "label": "8 und 8",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 8,
      "b": 8,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/8-7",
    "label": "8 und 7",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 8,
      "b": 7,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/8-10",
    "label": "8 und 10",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 8,
      "b": 10,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/9-9",
    "label": "9 und 9",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 9,
      "b": 9,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/9-8",
    "label": "9 und 8",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 9,
      "b": 8,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/9-10",
    "label": "9 und 10",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 9,
      "b": 10,
      "answer": "right",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/10-10",
    "label": "10 und 10",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 10,
      "b": 10,
      "answer": "equal",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  },
  {
    "id": "compare/10-9",
    "label": "10 und 9",
    "question": {
      "kind": "compare",
      "prompt": "Wo sind mehr Beeren?",
      "a": 10,
      "b": 9,
      "answer": "left",
      "choices": [
        "left",
        "equal",
        "right"
      ]
    }
  }
]
```
