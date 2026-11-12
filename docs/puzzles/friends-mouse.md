# Wörter und Bilder

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-mouse`
- Host: mouse
- Related competence: **D.2.A.1.b** — Wörter mit Bildern verbinden
- Difficulty: 25 vertraute Nomen; eingeführte Buchstaben
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
| `friends-mouse/word-0` | Maus — Maus | "mouse" |
| `friends-mouse/word-1` | Haus — Haus | "vocab-house" |
| `friends-mouse/word-2` | Hut — Hut | "hat" |
| `friends-mouse/word-3` | Rose — Rose | "rose" |
| `friends-mouse/word-4` | Nase — Nase | "nose" |
| `friends-mouse/word-5` | Fisch — Fisch | "fish" |
| `friends-mouse/word-6` | Tisch — Tisch | "vocab-table" |
| `friends-mouse/word-7` | Ball — Ball | "ball" |
| `friends-mouse/word-8` | Baum — Baum | "tree" |
| `friends-mouse/word-9` | Boot — Boot | "boat" |
| `friends-mouse/word-10` | Kuh — Kuh | "cow" |
| `friends-mouse/word-11` | Schuh — Schuh | "vocab-shoe" |
| `friends-mouse/word-12` | Bein — Bein | "vocab-leg" |
| `friends-mouse/word-13` | Stein — Stein | "vocab-stone" |
| `friends-mouse/word-14` | Buch — Buch | "book" |
| `friends-mouse/word-15` | Hase — Hase | "hare" |
| `friends-mouse/word-16` | Dose — Dose | "tin" |
| `friends-mouse/word-17` | Nuss — Nuss | "nut" |
| `friends-mouse/word-18` | Hose — Hose | "trousers" |
| `friends-mouse/word-19` | Bus — Bus | "bus" |
| `friends-mouse/word-20` | Stern — Stern | "star" |
| `friends-mouse/word-21` | Turm — Turm | "vocab-tower" |
| `friends-mouse/word-22` | Wurm — Wurm | "vocab-worm" |
| `friends-mouse/word-23` | Tuch — Tuch | "vocab-cloth" |
| `friends-mouse/word-24` | Topf — Topf | "vocab-pot" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-mouse/word-0",
    "label": "Maus",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Maus",
      "answer": "mouse",
      "choices": [
        "mouse",
        "rose",
        "ball"
      ]
    }
  },
  {
    "id": "friends-mouse/word-1",
    "label": "Haus",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Haus",
      "answer": "vocab-house",
      "choices": [
        "vocab-house",
        "nose",
        "tree"
      ]
    }
  },
  {
    "id": "friends-mouse/word-2",
    "label": "Hut",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Hut",
      "answer": "hat",
      "choices": [
        "hat",
        "fish",
        "boat"
      ]
    }
  },
  {
    "id": "friends-mouse/word-3",
    "label": "Rose",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Rose",
      "answer": "rose",
      "choices": [
        "rose",
        "vocab-table",
        "cow"
      ]
    }
  },
  {
    "id": "friends-mouse/word-4",
    "label": "Nase",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Nase",
      "answer": "nose",
      "choices": [
        "nose",
        "ball",
        "vocab-shoe"
      ]
    }
  },
  {
    "id": "friends-mouse/word-5",
    "label": "Fisch",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Fisch",
      "answer": "fish",
      "choices": [
        "fish",
        "tree",
        "vocab-leg"
      ]
    }
  },
  {
    "id": "friends-mouse/word-6",
    "label": "Tisch",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Tisch",
      "answer": "vocab-table",
      "choices": [
        "vocab-table",
        "boat",
        "vocab-stone"
      ]
    }
  },
  {
    "id": "friends-mouse/word-7",
    "label": "Ball",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Ball",
      "answer": "ball",
      "choices": [
        "ball",
        "cow",
        "book"
      ]
    }
  },
  {
    "id": "friends-mouse/word-8",
    "label": "Baum",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Baum",
      "answer": "tree",
      "choices": [
        "tree",
        "vocab-shoe",
        "hare"
      ]
    }
  },
  {
    "id": "friends-mouse/word-9",
    "label": "Boot",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Boot",
      "answer": "boat",
      "choices": [
        "boat",
        "vocab-leg",
        "tin"
      ]
    }
  },
  {
    "id": "friends-mouse/word-10",
    "label": "Kuh",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Kuh",
      "answer": "cow",
      "choices": [
        "cow",
        "vocab-stone",
        "nut"
      ]
    }
  },
  {
    "id": "friends-mouse/word-11",
    "label": "Schuh",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Schuh",
      "answer": "vocab-shoe",
      "choices": [
        "vocab-shoe",
        "book",
        "trousers"
      ]
    }
  },
  {
    "id": "friends-mouse/word-12",
    "label": "Bein",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Bein",
      "answer": "vocab-leg",
      "choices": [
        "vocab-leg",
        "hare",
        "bus"
      ]
    }
  },
  {
    "id": "friends-mouse/word-13",
    "label": "Stein",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Stein",
      "answer": "vocab-stone",
      "choices": [
        "vocab-stone",
        "tin",
        "star"
      ]
    }
  },
  {
    "id": "friends-mouse/word-14",
    "label": "Buch",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Buch",
      "answer": "book",
      "choices": [
        "book",
        "nut",
        "vocab-tower"
      ]
    }
  },
  {
    "id": "friends-mouse/word-15",
    "label": "Hase",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Hase",
      "answer": "hare",
      "choices": [
        "hare",
        "trousers",
        "vocab-worm"
      ]
    }
  },
  {
    "id": "friends-mouse/word-16",
    "label": "Dose",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Dose",
      "answer": "tin",
      "choices": [
        "tin",
        "bus",
        "vocab-cloth"
      ]
    }
  },
  {
    "id": "friends-mouse/word-17",
    "label": "Nuss",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Nuss",
      "answer": "nut",
      "choices": [
        "nut",
        "star",
        "vocab-pot"
      ]
    }
  },
  {
    "id": "friends-mouse/word-18",
    "label": "Hose",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Hose",
      "answer": "trousers",
      "choices": [
        "trousers",
        "vocab-tower",
        "mouse"
      ]
    }
  },
  {
    "id": "friends-mouse/word-19",
    "label": "Bus",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Bus",
      "answer": "bus",
      "choices": [
        "bus",
        "vocab-worm",
        "vocab-house"
      ]
    }
  },
  {
    "id": "friends-mouse/word-20",
    "label": "Stern",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Stern",
      "answer": "star",
      "choices": [
        "star",
        "vocab-cloth",
        "hat"
      ]
    }
  },
  {
    "id": "friends-mouse/word-21",
    "label": "Turm",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Turm",
      "answer": "vocab-tower",
      "choices": [
        "vocab-tower",
        "vocab-pot",
        "rose"
      ]
    }
  },
  {
    "id": "friends-mouse/word-22",
    "label": "Wurm",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Wurm",
      "answer": "vocab-worm",
      "choices": [
        "vocab-worm",
        "mouse",
        "nose"
      ]
    }
  },
  {
    "id": "friends-mouse/word-23",
    "label": "Tuch",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Tuch",
      "answer": "vocab-cloth",
      "choices": [
        "vocab-cloth",
        "vocab-house",
        "fish"
      ]
    }
  },
  {
    "id": "friends-mouse/word-24",
    "label": "Topf",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Topf",
      "answer": "vocab-pot",
      "choices": [
        "vocab-pot",
        "hat",
        "vocab-table"
      ]
    }
  }
]
```
