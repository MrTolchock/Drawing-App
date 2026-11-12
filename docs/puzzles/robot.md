# Waldpost

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `robot`
- Host: beaver
- Related competence: **MA.2.A.1.c (Unterstützung)** — Benachbarte Schritte im Raum planen
- Difficulty: 4 × 4; sichtbares Ziel und gesperrte Hecken
- Pool: 30 explicit iterations; a round selects five.
- Review: every iteration plus the puzzle checklist must be approved for this exact revision. New/changed items or difficulty require review again.

## Mapping to the blueprint

| Contract | Implementation |
| --- | --- |
| Drawn pictures | Existing woodland sheets; SVG for geometry and tracing |
| Shared page | Waldbuch paper, host, Andika, five progress leaves |
| Guidance | One optional rule explanation; no hints or next-task button |
| Sound | Enabled button clicks, success/retry, mute respected |
| Round | Five distinct sampled iterations; saved questions/partial work |
| Ending | 900 ms correct feedback, then 2.2 s celebration; reduced motion |
| Review | Isolated real-renderer previews, individual decisions, revision gate |

## Every iteration

| Stable iteration ID | Content / configuration | Expected answer or solution |
| --- | --- | --- |
| `robot/0-0` | Weg 1 / 1 — Bring den Brief zum Briefkasten. | 0 → 15 (freie Nachbarschritte) |
| `robot/0-1` | Weg 1 / 2 — Bring den Brief zum Briefkasten. | 12 → 3 (freie Nachbarschritte) |
| `robot/0-2` | Weg 1 / 3 — Bring den Brief zum Briefkasten. | 3 → 12 (freie Nachbarschritte) |
| `robot/0-3` | Weg 1 / 4 — Bring den Brief zum Briefkasten. | 15 → 0 (freie Nachbarschritte) |
| `robot/0-4` | Weg 1 / 5 — Bring den Brief zum Briefkasten. | 0 → 3 (freie Nachbarschritte) |
| `robot/0-5` | Weg 1 / 6 — Bring den Brief zum Briefkasten. | 12 → 15 (freie Nachbarschritte) |
| `robot/1-0` | Weg 2 / 1 — Bring den Brief zum Briefkasten. | 0 → 15 (freie Nachbarschritte) |
| `robot/1-1` | Weg 2 / 2 — Bring den Brief zum Briefkasten. | 12 → 3 (freie Nachbarschritte) |
| `robot/1-2` | Weg 2 / 3 — Bring den Brief zum Briefkasten. | 3 → 12 (freie Nachbarschritte) |
| `robot/1-3` | Weg 2 / 4 — Bring den Brief zum Briefkasten. | 15 → 0 (freie Nachbarschritte) |
| `robot/1-4` | Weg 2 / 5 — Bring den Brief zum Briefkasten. | 0 → 3 (freie Nachbarschritte) |
| `robot/1-5` | Weg 2 / 6 — Bring den Brief zum Briefkasten. | 12 → 15 (freie Nachbarschritte) |
| `robot/2-0` | Weg 3 / 1 — Bring den Brief zum Briefkasten. | 0 → 15 (freie Nachbarschritte) |
| `robot/2-1` | Weg 3 / 2 — Bring den Brief zum Briefkasten. | 12 → 3 (freie Nachbarschritte) |
| `robot/2-2` | Weg 3 / 3 — Bring den Brief zum Briefkasten. | 3 → 12 (freie Nachbarschritte) |
| `robot/2-3` | Weg 3 / 4 — Bring den Brief zum Briefkasten. | 15 → 0 (freie Nachbarschritte) |
| `robot/2-4` | Weg 3 / 5 — Bring den Brief zum Briefkasten. | 0 → 3 (freie Nachbarschritte) |
| `robot/2-5` | Weg 3 / 6 — Bring den Brief zum Briefkasten. | 12 → 15 (freie Nachbarschritte) |
| `robot/3-0` | Weg 4 / 1 — Bring den Brief zum Briefkasten. | 0 → 15 (freie Nachbarschritte) |
| `robot/3-1` | Weg 4 / 2 — Bring den Brief zum Briefkasten. | 12 → 3 (freie Nachbarschritte) |
| `robot/3-2` | Weg 4 / 3 — Bring den Brief zum Briefkasten. | 3 → 12 (freie Nachbarschritte) |
| `robot/3-3` | Weg 4 / 4 — Bring den Brief zum Briefkasten. | 15 → 0 (freie Nachbarschritte) |
| `robot/3-4` | Weg 4 / 5 — Bring den Brief zum Briefkasten. | 0 → 3 (freie Nachbarschritte) |
| `robot/3-5` | Weg 4 / 6 — Bring den Brief zum Briefkasten. | 12 → 15 (freie Nachbarschritte) |
| `robot/4-0` | Weg 5 / 1 — Bring den Brief zum Briefkasten. | 0 → 15 (freie Nachbarschritte) |
| `robot/4-1` | Weg 5 / 2 — Bring den Brief zum Briefkasten. | 12 → 3 (freie Nachbarschritte) |
| `robot/4-2` | Weg 5 / 3 — Bring den Brief zum Briefkasten. | 3 → 12 (freie Nachbarschritte) |
| `robot/4-3` | Weg 5 / 4 — Bring den Brief zum Briefkasten. | 15 → 0 (freie Nachbarschritte) |
| `robot/4-4` | Weg 5 / 5 — Bring den Brief zum Briefkasten. | 0 → 3 (freie Nachbarschritte) |
| `robot/4-5` | Weg 5 / 6 — Bring den Brief zum Briefkasten. | 12 → 15 (freie Nachbarschritte) |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "robot/0-0",
    "label": "Weg 1 / 1",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 15,
      "obstacles": [
        5,
        6
      ]
    }
  },
  {
    "id": "robot/0-1",
    "label": "Weg 1 / 2",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 3,
      "obstacles": [
        5,
        6
      ]
    }
  },
  {
    "id": "robot/0-2",
    "label": "Weg 1 / 3",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 3,
      "goal": 12,
      "obstacles": [
        5,
        6
      ]
    }
  },
  {
    "id": "robot/0-3",
    "label": "Weg 1 / 4",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 15,
      "goal": 0,
      "obstacles": [
        5,
        6
      ]
    }
  },
  {
    "id": "robot/0-4",
    "label": "Weg 1 / 5",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 3,
      "obstacles": [
        5,
        6
      ]
    }
  },
  {
    "id": "robot/0-5",
    "label": "Weg 1 / 6",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 15,
      "obstacles": [
        5,
        6
      ]
    }
  },
  {
    "id": "robot/1-0",
    "label": "Weg 2 / 1",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 15,
      "obstacles": [
        5,
        9
      ]
    }
  },
  {
    "id": "robot/1-1",
    "label": "Weg 2 / 2",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 3,
      "obstacles": [
        5,
        9
      ]
    }
  },
  {
    "id": "robot/1-2",
    "label": "Weg 2 / 3",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 3,
      "goal": 12,
      "obstacles": [
        5,
        9
      ]
    }
  },
  {
    "id": "robot/1-3",
    "label": "Weg 2 / 4",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 15,
      "goal": 0,
      "obstacles": [
        5,
        9
      ]
    }
  },
  {
    "id": "robot/1-4",
    "label": "Weg 2 / 5",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 3,
      "obstacles": [
        5,
        9
      ]
    }
  },
  {
    "id": "robot/1-5",
    "label": "Weg 2 / 6",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 15,
      "obstacles": [
        5,
        9
      ]
    }
  },
  {
    "id": "robot/2-0",
    "label": "Weg 3 / 1",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 15,
      "obstacles": [
        6,
        10
      ]
    }
  },
  {
    "id": "robot/2-1",
    "label": "Weg 3 / 2",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 3,
      "obstacles": [
        6,
        10
      ]
    }
  },
  {
    "id": "robot/2-2",
    "label": "Weg 3 / 3",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 3,
      "goal": 12,
      "obstacles": [
        6,
        10
      ]
    }
  },
  {
    "id": "robot/2-3",
    "label": "Weg 3 / 4",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 15,
      "goal": 0,
      "obstacles": [
        6,
        10
      ]
    }
  },
  {
    "id": "robot/2-4",
    "label": "Weg 3 / 5",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 3,
      "obstacles": [
        6,
        10
      ]
    }
  },
  {
    "id": "robot/2-5",
    "label": "Weg 3 / 6",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 15,
      "obstacles": [
        6,
        10
      ]
    }
  },
  {
    "id": "robot/3-0",
    "label": "Weg 4 / 1",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 15,
      "obstacles": [
        9,
        10
      ]
    }
  },
  {
    "id": "robot/3-1",
    "label": "Weg 4 / 2",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 3,
      "obstacles": [
        9,
        10
      ]
    }
  },
  {
    "id": "robot/3-2",
    "label": "Weg 4 / 3",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 3,
      "goal": 12,
      "obstacles": [
        9,
        10
      ]
    }
  },
  {
    "id": "robot/3-3",
    "label": "Weg 4 / 4",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 15,
      "goal": 0,
      "obstacles": [
        9,
        10
      ]
    }
  },
  {
    "id": "robot/3-4",
    "label": "Weg 4 / 5",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 3,
      "obstacles": [
        9,
        10
      ]
    }
  },
  {
    "id": "robot/3-5",
    "label": "Weg 4 / 6",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 15,
      "obstacles": [
        9,
        10
      ]
    }
  },
  {
    "id": "robot/4-0",
    "label": "Weg 5 / 1",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 15,
      "obstacles": [
        2,
        5,
        9
      ]
    }
  },
  {
    "id": "robot/4-1",
    "label": "Weg 5 / 2",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 3,
      "obstacles": [
        2,
        5,
        9
      ]
    }
  },
  {
    "id": "robot/4-2",
    "label": "Weg 5 / 3",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 3,
      "goal": 12,
      "obstacles": [
        2,
        5,
        9
      ]
    }
  },
  {
    "id": "robot/4-3",
    "label": "Weg 5 / 4",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 15,
      "goal": 0,
      "obstacles": [
        2,
        5,
        9
      ]
    }
  },
  {
    "id": "robot/4-4",
    "label": "Weg 5 / 5",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 0,
      "goal": 3,
      "obstacles": [
        2,
        5,
        9
      ]
    }
  },
  {
    "id": "robot/4-5",
    "label": "Weg 5 / 6",
    "question": {
      "kind": "robot",
      "mode": "route",
      "prompt": "Bring den Brief zum Briefkasten.",
      "size": 4,
      "start": 12,
      "goal": 15,
      "obstacles": [
        2,
        5,
        9
      ]
    }
  }
]
```
