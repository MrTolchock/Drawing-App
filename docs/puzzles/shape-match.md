# Formen wiedererkennen

[Alle Rätsel](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stabile Rätsel-ID: `shape-match`
- Host: ibex
- Related competence: **MA.2.A.1.a** — Ebene Formen unabhängig von ihrer Lage erkennen
- Difficulty: Kreis, Dreieck, Quadrat und Rechteck; 25 unterschiedliche Ansichten
- Pool: 25 Aufgaben; eine Runde enthält fünf.
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

## Alle Aufgaben

| Stabile Aufgaben-ID | Inhalt / Konfiguration | Expected answer or solution |
| --- | --- | --- |
| `shape-match/circle-0` | Kreis / 0 Grad — Welche Form ist das? | "circle" |
| `shape-match/square-0` | Quadrat / 0 Grad — Welche Form ist das? | "square" |
| `shape-match/square-15` | Quadrat / 15 Grad — Welche Form ist das? | "square" |
| `shape-match/square-30` | Quadrat / 30 Grad — Welche Form ist das? | "square" |
| `shape-match/square-45` | Quadrat / 45 Grad — Welche Form ist das? | "square" |
| `shape-match/square-60` | Quadrat / 60 Grad — Welche Form ist das? | "square" |
| `shape-match/square-75` | Quadrat / 75 Grad — Welche Form ist das? | "square" |
| `shape-match/rectangle-0` | Rechteck / 0 Grad — Welche Form ist das? | "rectangle" |
| `shape-match/rectangle-30` | Rechteck / 30 Grad — Welche Form ist das? | "rectangle" |
| `shape-match/rectangle-60` | Rechteck / 60 Grad — Welche Form ist das? | "rectangle" |
| `shape-match/rectangle-90` | Rechteck / 90 Grad — Welche Form ist das? | "rectangle" |
| `shape-match/rectangle-120` | Rechteck / 120 Grad — Welche Form ist das? | "rectangle" |
| `shape-match/rectangle-150` | Rechteck / 150 Grad — Welche Form ist das? | "rectangle" |
| `shape-match/triangle-0` | Dreieck / 0 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-30` | Dreieck / 30 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-60` | Dreieck / 60 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-90` | Dreieck / 90 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-120` | Dreieck / 120 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-150` | Dreieck / 150 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-180` | Dreieck / 180 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-210` | Dreieck / 210 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-240` | Dreieck / 240 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-270` | Dreieck / 270 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-300` | Dreieck / 300 Grad — Welche Form ist das? | "triangle" |
| `shape-match/triangle-330` | Dreieck / 330 Grad — Welche Form ist das? | "triangle" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "shape-match/circle-0",
    "label": "Kreis / 0 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "circle",
      "rotation": 0,
      "answer": "circle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/square-0",
    "label": "Quadrat / 0 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "square",
      "rotation": 0,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/square-15",
    "label": "Quadrat / 15 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "square",
      "rotation": 15,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/square-30",
    "label": "Quadrat / 30 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "square",
      "rotation": 30,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/square-45",
    "label": "Quadrat / 45 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "square",
      "rotation": 45,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/square-60",
    "label": "Quadrat / 60 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "square",
      "rotation": 60,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/square-75",
    "label": "Quadrat / 75 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "square",
      "rotation": 75,
      "answer": "square",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/rectangle-0",
    "label": "Rechteck / 0 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "rectangle",
      "rotation": 0,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/rectangle-30",
    "label": "Rechteck / 30 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "rectangle",
      "rotation": 30,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/rectangle-60",
    "label": "Rechteck / 60 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "rectangle",
      "rotation": 60,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/rectangle-90",
    "label": "Rechteck / 90 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "rectangle",
      "rotation": 90,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/rectangle-120",
    "label": "Rechteck / 120 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "rectangle",
      "rotation": 120,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/rectangle-150",
    "label": "Rechteck / 150 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "rectangle",
      "rotation": 150,
      "answer": "rectangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-0",
    "label": "Dreieck / 0 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 0,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-30",
    "label": "Dreieck / 30 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 30,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-60",
    "label": "Dreieck / 60 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 60,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-90",
    "label": "Dreieck / 90 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 90,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-120",
    "label": "Dreieck / 120 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 120,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-150",
    "label": "Dreieck / 150 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 150,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-180",
    "label": "Dreieck / 180 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 180,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-210",
    "label": "Dreieck / 210 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 210,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-240",
    "label": "Dreieck / 240 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 240,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-270",
    "label": "Dreieck / 270 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 270,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-300",
    "label": "Dreieck / 300 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 300,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  },
  {
    "id": "shape-match/triangle-330",
    "label": "Dreieck / 330 Grad",
    "question": {
      "kind": "shape-match",
      "prompt": "Welche Form ist das?",
      "form": "triangle",
      "rotation": 330,
      "answer": "triangle",
      "choices": [
        "circle",
        "triangle",
        "square",
        "rectangle"
      ]
    }
  }
]
```
