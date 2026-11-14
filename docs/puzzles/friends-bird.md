# Reimpaare lesen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-bird`
- Host: bird
- Related competence: **D.2.A.1.b; D.1.A.1.b** — Wörter lesen und Reime erkennen
- Difficulty: 25 verschiedene Reimpaare ohne vertauschte Doppelungen; eingeführte Buchstaben
- Pool: 25 explicit iterations; a round selects five.
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
| `friends-bird/rhyme-0` | Tisch – Fisch — Tisch | "Fisch" |
| `friends-bird/rhyme-1` | Bein – Stein — Bein | "Stein" |
| `friends-bird/rhyme-2` | Kuh – Schuh — Kuh | "Schuh" |
| `friends-bird/rhyme-3` | Hase – Nase — Hase | "Nase" |
| `friends-bird/rhyme-4` | Rose – Dose — Rose | "Dose" |
| `friends-bird/rhyme-5` | Buch – Tuch — Buch | "Tuch" |
| `friends-bird/rhyme-6` | Hose – Rose — Hose | "Rose" |
| `friends-bird/rhyme-7` | Turm – Wurm — Turm | "Wurm" |
| `friends-bird/rhyme-8` | Topf – Kopf — Topf | "Kopf" |
| `friends-bird/rhyme-9` | Hand – Sand — Hand | "Sand" |
| `friends-bird/rhyme-10` | Schal – Wal — Schal | "Wal" |
| `friends-bird/rhyme-11` | Seil – Pfeil — Seil | "Pfeil" |
| `friends-bird/rhyme-12` | Tasse – Kasse — Tasse | "Kasse" |
| `friends-bird/rhyme-13` | Bank – Schrank — Bank | "Schrank" |
| `friends-bird/rhyme-14` | Stern – Kern — Stern | "Kern" |
| `friends-bird/rhyme-15` | Maus – Haus — Maus | "Haus" |
| `friends-bird/rhyme-16` | Nuss – Bus — Nuss | "Bus" |
| `friends-bird/rhyme-17` | Boot – Brot — Boot | "Brot" |
| `friends-bird/rhyme-18` | Biene – Schiene — Biene | "Schiene" |
| `friends-bird/rhyme-19` | Schnecke – Decke — Schnecke | "Decke" |
| `friends-bird/rhyme-20` | Sonne – Tonne — Sonne | "Tonne" |
| `friends-bird/rhyme-21` | Kanne – Tanne — Kanne | "Tanne" |
| `friends-bird/rhyme-22` | Mund – Hund — Mund | "Hund" |
| `friends-bird/rhyme-23` | Dach – Bach — Dach | "Bach" |
| `friends-bird/rhyme-24` | Ziege – Fliege — Ziege | "Fliege" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-bird/rhyme-0",
    "label": "Tisch – Fisch",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Tisch",
      "picture": "vocab-table",
      "answer": "Fisch",
      "choices": [
        "Fisch",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-1",
    "label": "Bein – Stein",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Bein",
      "picture": "vocab-leg",
      "answer": "Stein",
      "choices": [
        "Stein",
        "Boot"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-2",
    "label": "Kuh – Schuh",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Kuh",
      "picture": "cow",
      "answer": "Schuh",
      "choices": [
        "Schuh",
        "Ball"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-3",
    "label": "Hase – Nase",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Hase",
      "picture": "hare",
      "answer": "Nase",
      "choices": [
        "Nase",
        "Baum"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-4",
    "label": "Rose – Dose",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Rose",
      "picture": "rose",
      "answer": "Dose",
      "choices": [
        "Dose",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-5",
    "label": "Buch – Tuch",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Buch",
      "picture": "book",
      "answer": "Tuch",
      "choices": [
        "Tuch",
        "Ball"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-6",
    "label": "Hose – Rose",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Hose",
      "picture": "trousers",
      "answer": "Rose",
      "choices": [
        "Rose",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-7",
    "label": "Turm – Wurm",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Turm",
      "picture": "vocab-tower",
      "answer": "Wurm",
      "choices": [
        "Wurm",
        "Boot"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-8",
    "label": "Topf – Kopf",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Topf",
      "picture": "vocab-pot",
      "answer": "Kopf",
      "choices": [
        "Kopf",
        "Baum"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-9",
    "label": "Hand – Sand",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Hand",
      "picture": "vocab-hand",
      "answer": "Sand",
      "choices": [
        "Sand",
        "Kuh"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-10",
    "label": "Schal – Wal",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Schal",
      "picture": "vocab-scarf",
      "answer": "Wal",
      "choices": [
        "Wal",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-11",
    "label": "Seil – Pfeil",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Seil",
      "picture": "vocab-rope",
      "answer": "Pfeil",
      "choices": [
        "Pfeil",
        "Rose"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-12",
    "label": "Tasse – Kasse",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Tasse",
      "picture": "vocab-cup",
      "answer": "Kasse",
      "choices": [
        "Kasse",
        "Schuh"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-13",
    "label": "Bank – Schrank",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Bank",
      "picture": "vocab-bench",
      "answer": "Schrank",
      "choices": [
        "Schrank",
        "Fisch"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-14",
    "label": "Stern – Kern",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Stern",
      "picture": "star",
      "answer": "Kern",
      "choices": [
        "Kern",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-15",
    "label": "Maus – Haus",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Maus",
      "picture": "mouse",
      "answer": "Haus",
      "choices": [
        "Haus",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-16",
    "label": "Nuss – Bus",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Nuss",
      "picture": "nut",
      "answer": "Bus",
      "choices": [
        "Bus",
        "Baum"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-17",
    "label": "Boot – Brot",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Boot",
      "picture": "boat",
      "answer": "Brot",
      "choices": [
        "Brot",
        "Maus"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-18",
    "label": "Biene – Schiene",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Biene",
      "picture": "bee",
      "answer": "Schiene",
      "choices": [
        "Schiene",
        "Rose"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-19",
    "label": "Schnecke – Decke",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Schnecke",
      "picture": "snail",
      "answer": "Decke",
      "choices": [
        "Decke",
        "Ball"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-20",
    "label": "Sonne – Tonne",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Sonne",
      "picture": "sun",
      "answer": "Tonne",
      "choices": [
        "Tonne",
        "Kuh"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-21",
    "label": "Kanne – Tanne",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Kanne",
      "picture": "rhyme-jug",
      "answer": "Tanne",
      "choices": [
        "Tanne",
        "Hut"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-22",
    "label": "Mund – Hund",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Mund",
      "picture": "rhyme-mouth",
      "answer": "Hund",
      "choices": [
        "Hund",
        "Stern"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-23",
    "label": "Dach – Bach",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Dach",
      "picture": "rhyme-roof",
      "answer": "Bach",
      "choices": [
        "Bach",
        "Schuh"
      ]
    }
  },
  {
    "id": "friends-bird/rhyme-24",
    "label": "Ziege – Fliege",
    "question": {
      "kind": "rhyme",
      "prompt": "Welches Wort reimt sich?",
      "text": "Ziege",
      "picture": "rhyme-goat",
      "answer": "Fliege",
      "choices": [
        "Fliege",
        "Nase"
      ]
    }
  }
]
```
