# Farben lesen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `read-colours`
- Host: mouse
- Related competence: **D.2.A.1.b/c** — Farbsätze genau lesen
- Difficulty: Fünf Farben; ein Satz oder zwei Sätze mit links/rechts
- Pool: 25 explicit iterations; a round selects five.
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
| `read-colours/rot` | rot — Die Blume ist rot. | "rot" |
| `read-colours/rot-gelb` | rot links / gelb rechts — Links steht eine rote Blume. Rechts steht eine gelbe Blume. | "scene:puzzle-flower-rot+puzzle-flower-gelb" |
| `read-colours/rot-blau` | rot links / blau rechts — Links steht eine rote Blume. Rechts steht eine blaue Blume. | "scene:puzzle-flower-rot+puzzle-flower-blau" |
| `read-colours/rot-rosa` | rot links / rosa rechts — Links steht eine rote Blume. Rechts steht eine rosa Blume. | "scene:puzzle-flower-rot+puzzle-flower-rosa" |
| `read-colours/rot-weiss` | rot links / weiss rechts — Links steht eine rote Blume. Rechts steht eine weisse Blume. | "scene:puzzle-flower-rot+puzzle-flower-weiss" |
| `read-colours/gelb` | gelb — Die Blume ist gelb. | "gelb" |
| `read-colours/gelb-rot` | gelb links / rot rechts — Links steht eine gelbe Blume. Rechts steht eine rote Blume. | "scene:puzzle-flower-gelb+puzzle-flower-rot" |
| `read-colours/gelb-blau` | gelb links / blau rechts — Links steht eine gelbe Blume. Rechts steht eine blaue Blume. | "scene:puzzle-flower-gelb+puzzle-flower-blau" |
| `read-colours/gelb-rosa` | gelb links / rosa rechts — Links steht eine gelbe Blume. Rechts steht eine rosa Blume. | "scene:puzzle-flower-gelb+puzzle-flower-rosa" |
| `read-colours/gelb-weiss` | gelb links / weiss rechts — Links steht eine gelbe Blume. Rechts steht eine weisse Blume. | "scene:puzzle-flower-gelb+puzzle-flower-weiss" |
| `read-colours/blau` | blau — Die Blume ist blau. | "blau" |
| `read-colours/blau-rot` | blau links / rot rechts — Links steht eine blaue Blume. Rechts steht eine rote Blume. | "scene:puzzle-flower-blau+puzzle-flower-rot" |
| `read-colours/blau-gelb` | blau links / gelb rechts — Links steht eine blaue Blume. Rechts steht eine gelbe Blume. | "scene:puzzle-flower-blau+puzzle-flower-gelb" |
| `read-colours/blau-rosa` | blau links / rosa rechts — Links steht eine blaue Blume. Rechts steht eine rosa Blume. | "scene:puzzle-flower-blau+puzzle-flower-rosa" |
| `read-colours/blau-weiss` | blau links / weiss rechts — Links steht eine blaue Blume. Rechts steht eine weisse Blume. | "scene:puzzle-flower-blau+puzzle-flower-weiss" |
| `read-colours/rosa` | rosa — Die Blume ist rosa. | "rosa" |
| `read-colours/rosa-rot` | rosa links / rot rechts — Links steht eine rosa Blume. Rechts steht eine rote Blume. | "scene:puzzle-flower-rosa+puzzle-flower-rot" |
| `read-colours/rosa-gelb` | rosa links / gelb rechts — Links steht eine rosa Blume. Rechts steht eine gelbe Blume. | "scene:puzzle-flower-rosa+puzzle-flower-gelb" |
| `read-colours/rosa-blau` | rosa links / blau rechts — Links steht eine rosa Blume. Rechts steht eine blaue Blume. | "scene:puzzle-flower-rosa+puzzle-flower-blau" |
| `read-colours/rosa-weiss` | rosa links / weiss rechts — Links steht eine rosa Blume. Rechts steht eine weisse Blume. | "scene:puzzle-flower-rosa+puzzle-flower-weiss" |
| `read-colours/weiss` | weiss — Die Blume ist weiss. | "weiss" |
| `read-colours/weiss-rot` | weiss links / rot rechts — Links steht eine weisse Blume. Rechts steht eine rote Blume. | "scene:puzzle-flower-weiss+puzzle-flower-rot" |
| `read-colours/weiss-gelb` | weiss links / gelb rechts — Links steht eine weisse Blume. Rechts steht eine gelbe Blume. | "scene:puzzle-flower-weiss+puzzle-flower-gelb" |
| `read-colours/weiss-blau` | weiss links / blau rechts — Links steht eine weisse Blume. Rechts steht eine blaue Blume. | "scene:puzzle-flower-weiss+puzzle-flower-blau" |
| `read-colours/weiss-rosa` | weiss links / rosa rechts — Links steht eine weisse Blume. Rechts steht eine rosa Blume. | "scene:puzzle-flower-weiss+puzzle-flower-rosa" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "read-colours/rot",
    "label": "rot",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt?",
      "text": "Die Blume ist rot.",
      "answer": "rot",
      "choices": [
        [
          "rot"
        ],
        [
          "gelb"
        ],
        [
          "blau"
        ]
      ]
    }
  },
  {
    "id": "read-colours/rot-gelb",
    "label": "rot links / gelb rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rote Blume. Rechts steht eine gelbe Blume.",
      "answer": "scene:puzzle-flower-rot+puzzle-flower-gelb",
      "choices": [
        "scene:puzzle-flower-rot+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-rot"
      ]
    }
  },
  {
    "id": "read-colours/rot-blau",
    "label": "rot links / blau rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rote Blume. Rechts steht eine blaue Blume.",
      "answer": "scene:puzzle-flower-rot+puzzle-flower-blau",
      "choices": [
        "scene:puzzle-flower-rot+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-rot"
      ]
    }
  },
  {
    "id": "read-colours/rot-rosa",
    "label": "rot links / rosa rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rote Blume. Rechts steht eine rosa Blume.",
      "answer": "scene:puzzle-flower-rot+puzzle-flower-rosa",
      "choices": [
        "scene:puzzle-flower-rot+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-rot"
      ]
    }
  },
  {
    "id": "read-colours/rot-weiss",
    "label": "rot links / weiss rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rote Blume. Rechts steht eine weisse Blume.",
      "answer": "scene:puzzle-flower-rot+puzzle-flower-weiss",
      "choices": [
        "scene:puzzle-flower-rot+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-rot"
      ]
    }
  },
  {
    "id": "read-colours/gelb",
    "label": "gelb",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt?",
      "text": "Die Blume ist gelb.",
      "answer": "gelb",
      "choices": [
        [
          "gelb"
        ],
        [
          "blau"
        ],
        [
          "rosa"
        ]
      ]
    }
  },
  {
    "id": "read-colours/gelb-rot",
    "label": "gelb links / rot rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine gelbe Blume. Rechts steht eine rote Blume.",
      "answer": "scene:puzzle-flower-gelb+puzzle-flower-rot",
      "choices": [
        "scene:puzzle-flower-gelb+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-gelb"
      ]
    }
  },
  {
    "id": "read-colours/gelb-blau",
    "label": "gelb links / blau rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine gelbe Blume. Rechts steht eine blaue Blume.",
      "answer": "scene:puzzle-flower-gelb+puzzle-flower-blau",
      "choices": [
        "scene:puzzle-flower-gelb+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-gelb"
      ]
    }
  },
  {
    "id": "read-colours/gelb-rosa",
    "label": "gelb links / rosa rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine gelbe Blume. Rechts steht eine rosa Blume.",
      "answer": "scene:puzzle-flower-gelb+puzzle-flower-rosa",
      "choices": [
        "scene:puzzle-flower-gelb+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-gelb"
      ]
    }
  },
  {
    "id": "read-colours/gelb-weiss",
    "label": "gelb links / weiss rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine gelbe Blume. Rechts steht eine weisse Blume.",
      "answer": "scene:puzzle-flower-gelb+puzzle-flower-weiss",
      "choices": [
        "scene:puzzle-flower-gelb+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-gelb"
      ]
    }
  },
  {
    "id": "read-colours/blau",
    "label": "blau",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt?",
      "text": "Die Blume ist blau.",
      "answer": "blau",
      "choices": [
        [
          "blau"
        ],
        [
          "rosa"
        ],
        [
          "weiss"
        ]
      ]
    }
  },
  {
    "id": "read-colours/blau-rot",
    "label": "blau links / rot rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine blaue Blume. Rechts steht eine rote Blume.",
      "answer": "scene:puzzle-flower-blau+puzzle-flower-rot",
      "choices": [
        "scene:puzzle-flower-blau+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-blau"
      ]
    }
  },
  {
    "id": "read-colours/blau-gelb",
    "label": "blau links / gelb rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine blaue Blume. Rechts steht eine gelbe Blume.",
      "answer": "scene:puzzle-flower-blau+puzzle-flower-gelb",
      "choices": [
        "scene:puzzle-flower-blau+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-blau"
      ]
    }
  },
  {
    "id": "read-colours/blau-rosa",
    "label": "blau links / rosa rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine blaue Blume. Rechts steht eine rosa Blume.",
      "answer": "scene:puzzle-flower-blau+puzzle-flower-rosa",
      "choices": [
        "scene:puzzle-flower-blau+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-blau"
      ]
    }
  },
  {
    "id": "read-colours/blau-weiss",
    "label": "blau links / weiss rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine blaue Blume. Rechts steht eine weisse Blume.",
      "answer": "scene:puzzle-flower-blau+puzzle-flower-weiss",
      "choices": [
        "scene:puzzle-flower-blau+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-blau"
      ]
    }
  },
  {
    "id": "read-colours/rosa",
    "label": "rosa",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt?",
      "text": "Die Blume ist rosa.",
      "answer": "rosa",
      "choices": [
        [
          "rosa"
        ],
        [
          "weiss"
        ],
        [
          "rot"
        ]
      ]
    }
  },
  {
    "id": "read-colours/rosa-rot",
    "label": "rosa links / rot rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rosa Blume. Rechts steht eine rote Blume.",
      "answer": "scene:puzzle-flower-rosa+puzzle-flower-rot",
      "choices": [
        "scene:puzzle-flower-rosa+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-rosa"
      ]
    }
  },
  {
    "id": "read-colours/rosa-gelb",
    "label": "rosa links / gelb rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rosa Blume. Rechts steht eine gelbe Blume.",
      "answer": "scene:puzzle-flower-rosa+puzzle-flower-gelb",
      "choices": [
        "scene:puzzle-flower-rosa+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-rosa"
      ]
    }
  },
  {
    "id": "read-colours/rosa-blau",
    "label": "rosa links / blau rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rosa Blume. Rechts steht eine blaue Blume.",
      "answer": "scene:puzzle-flower-rosa+puzzle-flower-blau",
      "choices": [
        "scene:puzzle-flower-rosa+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-rosa"
      ]
    }
  },
  {
    "id": "read-colours/rosa-weiss",
    "label": "rosa links / weiss rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine rosa Blume. Rechts steht eine weisse Blume.",
      "answer": "scene:puzzle-flower-rosa+puzzle-flower-weiss",
      "choices": [
        "scene:puzzle-flower-rosa+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-rosa"
      ]
    }
  },
  {
    "id": "read-colours/weiss",
    "label": "weiss",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt?",
      "text": "Die Blume ist weiss.",
      "answer": "weiss",
      "choices": [
        [
          "weiss"
        ],
        [
          "rot"
        ],
        [
          "gelb"
        ]
      ]
    }
  },
  {
    "id": "read-colours/weiss-rot",
    "label": "weiss links / rot rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine weisse Blume. Rechts steht eine rote Blume.",
      "answer": "scene:puzzle-flower-weiss+puzzle-flower-rot",
      "choices": [
        "scene:puzzle-flower-weiss+puzzle-flower-rot",
        "scene:puzzle-flower-rot+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-weiss"
      ]
    }
  },
  {
    "id": "read-colours/weiss-gelb",
    "label": "weiss links / gelb rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine weisse Blume. Rechts steht eine gelbe Blume.",
      "answer": "scene:puzzle-flower-weiss+puzzle-flower-gelb",
      "choices": [
        "scene:puzzle-flower-weiss+puzzle-flower-gelb",
        "scene:puzzle-flower-gelb+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-weiss"
      ]
    }
  },
  {
    "id": "read-colours/weiss-blau",
    "label": "weiss links / blau rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine weisse Blume. Rechts steht eine blaue Blume.",
      "answer": "scene:puzzle-flower-weiss+puzzle-flower-blau",
      "choices": [
        "scene:puzzle-flower-weiss+puzzle-flower-blau",
        "scene:puzzle-flower-blau+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-weiss"
      ]
    }
  },
  {
    "id": "read-colours/weiss-rosa",
    "label": "weiss links / rosa rechts",
    "question": {
      "kind": "reading",
      "prompt": "Welche Blumen passen?",
      "text": "Links steht eine weisse Blume. Rechts steht eine rosa Blume.",
      "answer": "scene:puzzle-flower-weiss+puzzle-flower-rosa",
      "choices": [
        "scene:puzzle-flower-weiss+puzzle-flower-rosa",
        "scene:puzzle-flower-rosa+puzzle-flower-weiss",
        "scene:puzzle-flower-weiss+puzzle-flower-weiss"
      ]
    }
  }
]
```
