# Farbwörter verstehen

[Alle Rätsel](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stabile Rätsel-ID: `colour-words`
- Host: kingfisher
- Related competence: **D.2.A.1.b** — Farbwörter verstehen
- Difficulty: Sechs Farbwörter; drei verschiedenfarbige Blumen zur Auswahl
- Pool: 30 Aufgaben; eine Runde enthält fünf.
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
| `colour-words/rot-gelb-blau` | Farbe rot zwischen gelb und blau — Die Blume ist rot. | "rot" |
| `colour-words/rot-blau-rosa` | Farbe rot zwischen blau und rosa — Die Blume ist rot. | "rot" |
| `colour-words/rot-rosa-weiss` | Farbe rot zwischen rosa und weiss — Die Blume ist rot. | "rot" |
| `colour-words/rot-weiss-lila` | Farbe rot zwischen weiss und lila — Die Blume ist rot. | "rot" |
| `colour-words/rot-lila-gelb` | Farbe rot zwischen lila und gelb — Die Blume ist rot. | "rot" |
| `colour-words/gelb-rot-blau` | Farbe gelb zwischen rot und blau — Die Blume ist gelb. | "gelb" |
| `colour-words/gelb-blau-rosa` | Farbe gelb zwischen blau und rosa — Die Blume ist gelb. | "gelb" |
| `colour-words/gelb-rosa-weiss` | Farbe gelb zwischen rosa und weiss — Die Blume ist gelb. | "gelb" |
| `colour-words/gelb-weiss-lila` | Farbe gelb zwischen weiss und lila — Die Blume ist gelb. | "gelb" |
| `colour-words/gelb-lila-rot` | Farbe gelb zwischen lila und rot — Die Blume ist gelb. | "gelb" |
| `colour-words/blau-rot-gelb` | Farbe blau zwischen rot und gelb — Die Blume ist blau. | "blau" |
| `colour-words/blau-gelb-rosa` | Farbe blau zwischen gelb und rosa — Die Blume ist blau. | "blau" |
| `colour-words/blau-rosa-weiss` | Farbe blau zwischen rosa und weiss — Die Blume ist blau. | "blau" |
| `colour-words/blau-weiss-lila` | Farbe blau zwischen weiss und lila — Die Blume ist blau. | "blau" |
| `colour-words/blau-lila-rot` | Farbe blau zwischen lila und rot — Die Blume ist blau. | "blau" |
| `colour-words/rosa-rot-gelb` | Farbe rosa zwischen rot und gelb — Die Blume ist rosa. | "rosa" |
| `colour-words/rosa-gelb-blau` | Farbe rosa zwischen gelb und blau — Die Blume ist rosa. | "rosa" |
| `colour-words/rosa-blau-weiss` | Farbe rosa zwischen blau und weiss — Die Blume ist rosa. | "rosa" |
| `colour-words/rosa-weiss-lila` | Farbe rosa zwischen weiss und lila — Die Blume ist rosa. | "rosa" |
| `colour-words/rosa-lila-rot` | Farbe rosa zwischen lila und rot — Die Blume ist rosa. | "rosa" |
| `colour-words/weiss-rot-gelb` | Farbe weiss zwischen rot und gelb — Die Blume ist weiss. | "weiss" |
| `colour-words/weiss-gelb-blau` | Farbe weiss zwischen gelb und blau — Die Blume ist weiss. | "weiss" |
| `colour-words/weiss-blau-rosa` | Farbe weiss zwischen blau und rosa — Die Blume ist weiss. | "weiss" |
| `colour-words/weiss-rosa-lila` | Farbe weiss zwischen rosa und lila — Die Blume ist weiss. | "weiss" |
| `colour-words/weiss-lila-rot` | Farbe weiss zwischen lila und rot — Die Blume ist weiss. | "weiss" |
| `colour-words/lila-rot-gelb` | Farbe lila zwischen rot und gelb — Die Blume ist lila. | "lila" |
| `colour-words/lila-gelb-blau` | Farbe lila zwischen gelb und blau — Die Blume ist lila. | "lila" |
| `colour-words/lila-blau-rosa` | Farbe lila zwischen blau und rosa — Die Blume ist lila. | "lila" |
| `colour-words/lila-rosa-weiss` | Farbe lila zwischen rosa und weiss — Die Blume ist lila. | "lila" |
| `colour-words/lila-weiss-rot` | Farbe lila zwischen weiss und rot — Die Blume ist lila. | "lila" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "colour-words/rot-gelb-blau",
    "label": "Farbe rot zwischen gelb und blau",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rot.",
      "answer": "rot",
      "choices": [
        [
          "rot",
          "#bf5143"
        ],
        [
          "gelb",
          "#deb845"
        ],
        [
          "blau",
          "#5d91b4"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rot-blau-rosa",
    "label": "Farbe rot zwischen blau und rosa",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rot.",
      "answer": "rot",
      "choices": [
        [
          "rot",
          "#bf5143"
        ],
        [
          "blau",
          "#5d91b4"
        ],
        [
          "rosa",
          "#ce8a9b"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rot-rosa-weiss",
    "label": "Farbe rot zwischen rosa und weiss",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rot.",
      "answer": "rot",
      "choices": [
        [
          "rot",
          "#bf5143"
        ],
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "weiss",
          "#f8f4df"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rot-weiss-lila",
    "label": "Farbe rot zwischen weiss und lila",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rot.",
      "answer": "rot",
      "choices": [
        [
          "rot",
          "#bf5143"
        ],
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "lila",
          "#9874b1"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rot-lila-gelb",
    "label": "Farbe rot zwischen lila und gelb",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rot.",
      "answer": "rot",
      "choices": [
        [
          "rot",
          "#bf5143"
        ],
        [
          "lila",
          "#9874b1"
        ],
        [
          "gelb",
          "#deb845"
        ]
      ]
    }
  },
  {
    "id": "colour-words/gelb-rot-blau",
    "label": "Farbe gelb zwischen rot und blau",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist gelb.",
      "answer": "gelb",
      "choices": [
        [
          "gelb",
          "#deb845"
        ],
        [
          "rot",
          "#bf5143"
        ],
        [
          "blau",
          "#5d91b4"
        ]
      ]
    }
  },
  {
    "id": "colour-words/gelb-blau-rosa",
    "label": "Farbe gelb zwischen blau und rosa",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist gelb.",
      "answer": "gelb",
      "choices": [
        [
          "gelb",
          "#deb845"
        ],
        [
          "blau",
          "#5d91b4"
        ],
        [
          "rosa",
          "#ce8a9b"
        ]
      ]
    }
  },
  {
    "id": "colour-words/gelb-rosa-weiss",
    "label": "Farbe gelb zwischen rosa und weiss",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist gelb.",
      "answer": "gelb",
      "choices": [
        [
          "gelb",
          "#deb845"
        ],
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "weiss",
          "#f8f4df"
        ]
      ]
    }
  },
  {
    "id": "colour-words/gelb-weiss-lila",
    "label": "Farbe gelb zwischen weiss und lila",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist gelb.",
      "answer": "gelb",
      "choices": [
        [
          "gelb",
          "#deb845"
        ],
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "lila",
          "#9874b1"
        ]
      ]
    }
  },
  {
    "id": "colour-words/gelb-lila-rot",
    "label": "Farbe gelb zwischen lila und rot",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist gelb.",
      "answer": "gelb",
      "choices": [
        [
          "gelb",
          "#deb845"
        ],
        [
          "lila",
          "#9874b1"
        ],
        [
          "rot",
          "#bf5143"
        ]
      ]
    }
  },
  {
    "id": "colour-words/blau-rot-gelb",
    "label": "Farbe blau zwischen rot und gelb",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist blau.",
      "answer": "blau",
      "choices": [
        [
          "blau",
          "#5d91b4"
        ],
        [
          "rot",
          "#bf5143"
        ],
        [
          "gelb",
          "#deb845"
        ]
      ]
    }
  },
  {
    "id": "colour-words/blau-gelb-rosa",
    "label": "Farbe blau zwischen gelb und rosa",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist blau.",
      "answer": "blau",
      "choices": [
        [
          "blau",
          "#5d91b4"
        ],
        [
          "gelb",
          "#deb845"
        ],
        [
          "rosa",
          "#ce8a9b"
        ]
      ]
    }
  },
  {
    "id": "colour-words/blau-rosa-weiss",
    "label": "Farbe blau zwischen rosa und weiss",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist blau.",
      "answer": "blau",
      "choices": [
        [
          "blau",
          "#5d91b4"
        ],
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "weiss",
          "#f8f4df"
        ]
      ]
    }
  },
  {
    "id": "colour-words/blau-weiss-lila",
    "label": "Farbe blau zwischen weiss und lila",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist blau.",
      "answer": "blau",
      "choices": [
        [
          "blau",
          "#5d91b4"
        ],
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "lila",
          "#9874b1"
        ]
      ]
    }
  },
  {
    "id": "colour-words/blau-lila-rot",
    "label": "Farbe blau zwischen lila und rot",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist blau.",
      "answer": "blau",
      "choices": [
        [
          "blau",
          "#5d91b4"
        ],
        [
          "lila",
          "#9874b1"
        ],
        [
          "rot",
          "#bf5143"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rosa-rot-gelb",
    "label": "Farbe rosa zwischen rot und gelb",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rosa.",
      "answer": "rosa",
      "choices": [
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "rot",
          "#bf5143"
        ],
        [
          "gelb",
          "#deb845"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rosa-gelb-blau",
    "label": "Farbe rosa zwischen gelb und blau",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rosa.",
      "answer": "rosa",
      "choices": [
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "gelb",
          "#deb845"
        ],
        [
          "blau",
          "#5d91b4"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rosa-blau-weiss",
    "label": "Farbe rosa zwischen blau und weiss",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rosa.",
      "answer": "rosa",
      "choices": [
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "blau",
          "#5d91b4"
        ],
        [
          "weiss",
          "#f8f4df"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rosa-weiss-lila",
    "label": "Farbe rosa zwischen weiss und lila",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rosa.",
      "answer": "rosa",
      "choices": [
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "lila",
          "#9874b1"
        ]
      ]
    }
  },
  {
    "id": "colour-words/rosa-lila-rot",
    "label": "Farbe rosa zwischen lila und rot",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist rosa.",
      "answer": "rosa",
      "choices": [
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "lila",
          "#9874b1"
        ],
        [
          "rot",
          "#bf5143"
        ]
      ]
    }
  },
  {
    "id": "colour-words/weiss-rot-gelb",
    "label": "Farbe weiss zwischen rot und gelb",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist weiss.",
      "answer": "weiss",
      "choices": [
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "rot",
          "#bf5143"
        ],
        [
          "gelb",
          "#deb845"
        ]
      ]
    }
  },
  {
    "id": "colour-words/weiss-gelb-blau",
    "label": "Farbe weiss zwischen gelb und blau",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist weiss.",
      "answer": "weiss",
      "choices": [
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "gelb",
          "#deb845"
        ],
        [
          "blau",
          "#5d91b4"
        ]
      ]
    }
  },
  {
    "id": "colour-words/weiss-blau-rosa",
    "label": "Farbe weiss zwischen blau und rosa",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist weiss.",
      "answer": "weiss",
      "choices": [
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "blau",
          "#5d91b4"
        ],
        [
          "rosa",
          "#ce8a9b"
        ]
      ]
    }
  },
  {
    "id": "colour-words/weiss-rosa-lila",
    "label": "Farbe weiss zwischen rosa und lila",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist weiss.",
      "answer": "weiss",
      "choices": [
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "lila",
          "#9874b1"
        ]
      ]
    }
  },
  {
    "id": "colour-words/weiss-lila-rot",
    "label": "Farbe weiss zwischen lila und rot",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist weiss.",
      "answer": "weiss",
      "choices": [
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "lila",
          "#9874b1"
        ],
        [
          "rot",
          "#bf5143"
        ]
      ]
    }
  },
  {
    "id": "colour-words/lila-rot-gelb",
    "label": "Farbe lila zwischen rot und gelb",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist lila.",
      "answer": "lila",
      "choices": [
        [
          "lila",
          "#9874b1"
        ],
        [
          "rot",
          "#bf5143"
        ],
        [
          "gelb",
          "#deb845"
        ]
      ]
    }
  },
  {
    "id": "colour-words/lila-gelb-blau",
    "label": "Farbe lila zwischen gelb und blau",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist lila.",
      "answer": "lila",
      "choices": [
        [
          "lila",
          "#9874b1"
        ],
        [
          "gelb",
          "#deb845"
        ],
        [
          "blau",
          "#5d91b4"
        ]
      ]
    }
  },
  {
    "id": "colour-words/lila-blau-rosa",
    "label": "Farbe lila zwischen blau und rosa",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist lila.",
      "answer": "lila",
      "choices": [
        [
          "lila",
          "#9874b1"
        ],
        [
          "blau",
          "#5d91b4"
        ],
        [
          "rosa",
          "#ce8a9b"
        ]
      ]
    }
  },
  {
    "id": "colour-words/lila-rosa-weiss",
    "label": "Farbe lila zwischen rosa und weiss",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist lila.",
      "answer": "lila",
      "choices": [
        [
          "lila",
          "#9874b1"
        ],
        [
          "rosa",
          "#ce8a9b"
        ],
        [
          "weiss",
          "#f8f4df"
        ]
      ]
    }
  },
  {
    "id": "colour-words/lila-weiss-rot",
    "label": "Farbe lila zwischen weiss und rot",
    "question": {
      "kind": "colours",
      "prompt": "Welche Blume passt zum Satz?",
      "text": "Die Blume ist lila.",
      "answer": "lila",
      "choices": [
        [
          "lila",
          "#9874b1"
        ],
        [
          "weiss",
          "#f8f4df"
        ],
        [
          "rot",
          "#bf5143"
        ]
      ]
    }
  }
]
```
