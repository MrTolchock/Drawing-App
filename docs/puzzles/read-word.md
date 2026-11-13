# Wort und Waldbild

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `read-word`
- Host: mouse
- Related competence: **D.2.A.1.b** — Waldwörter lesen
- Difficulty: Mindestens 25 konkrete Bildwörter
- Pool: 35 explicit iterations; a round selects five.
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
| `read-word/word-0` | Hase — Hase | "hare-sit" |
| `read-word/word-1` | Biber — Biber | "beaver" |
| `read-word/word-2` | Igel — Igel | "hedgehog" |
| `read-word/word-3` | Feder — Feder | "forest-feather" |
| `read-word/word-4` | Rose — Rose | "forest-rose" |
| `read-word/word-5` | Lupe — Lupe | "magnifier" |
| `read-word/word-6` | Blume — Blume | "forest-flower" |
| `read-word/word-7` | Tanne — Tanne | "forest-fir" |
| `read-word/word-8` | Apfel — Apfel | "forest-apple" |
| `read-word/word-9` | Raupe — Raupe | "caterpillar" |
| `read-word/word-10` | Beere — Beere | "forest-berry" |
| `read-word/word-11` | Biene — Biene | "bee" |
| `read-word/word-12` | Maus — Maus | "mouse-sit" |
| `read-word/word-13` | Baum — Baum | "tree" |
| `read-word/word-14` | Pilz — Pilz | "forest-mushroom" |
| `read-word/word-15` | Nuss — Nuss | "forest-nut" |
| `read-word/word-16` | Fisch — Fisch | "fish-swim" |
| `read-word/word-17` | Nest — Nest | "nest" |
| `read-word/word-18` | Blatt — Blatt | "forest-leaf" |
| `read-word/word-19` | Sonne — Sonne | "sun" |
| `read-word/word-20` | Schmetterling — Schmetterling | "butterfly" |
| `read-word/word-21` | Ameise — Ameise | "ant" |
| `read-word/word-22` | Banane — Banane | "banana" |
| `read-word/word-23` | Tomate — Tomate | "tomato" |
| `read-word/word-24` | Kamera — Kamera | "camera" |
| `read-word/word-25` | Nadel — Nadel | "needle" |
| `read-word/word-26` | Gabel — Gabel | "fork" |
| `read-word/word-27` | Glocke — Glocke | "bell" |
| `read-word/word-28` | Karotte — Karotte | "carrot" |
| `read-word/word-29` | Wolke — Wolke | "cloud" |
| `read-word/word-30` | Schaufel — Schaufel | "spade" |
| `read-word/word-31` | Kuchen — Kuchen | "cake" |
| `read-word/word-32` | Regen — Regen | "rain" |
| `read-word/word-33` | Vogel — Vogel | "bird-sit" |
| `read-word/word-34` | Schnecke — Schnecke | "snail" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "read-word/word-0",
    "label": "Hase",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Hase",
      "answer": "hare-sit",
      "choices": [
        "hare-sit",
        "forest-rose",
        "caterpillar"
      ]
    }
  },
  {
    "id": "read-word/word-1",
    "label": "Biber",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Biber",
      "answer": "beaver",
      "choices": [
        "beaver",
        "magnifier",
        "forest-berry"
      ]
    }
  },
  {
    "id": "read-word/word-2",
    "label": "Igel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Igel",
      "answer": "hedgehog",
      "choices": [
        "hedgehog",
        "forest-flower",
        "bee"
      ]
    }
  },
  {
    "id": "read-word/word-3",
    "label": "Feder",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Feder",
      "answer": "forest-feather",
      "choices": [
        "forest-feather",
        "forest-fir",
        "mouse-sit"
      ]
    }
  },
  {
    "id": "read-word/word-4",
    "label": "Rose",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Rose",
      "answer": "forest-rose",
      "choices": [
        "forest-rose",
        "forest-apple",
        "tree"
      ]
    }
  },
  {
    "id": "read-word/word-5",
    "label": "Lupe",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Lupe",
      "answer": "magnifier",
      "choices": [
        "magnifier",
        "caterpillar",
        "forest-mushroom"
      ]
    }
  },
  {
    "id": "read-word/word-6",
    "label": "Blume",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Blume",
      "answer": "forest-flower",
      "choices": [
        "forest-flower",
        "forest-berry",
        "forest-nut"
      ]
    }
  },
  {
    "id": "read-word/word-7",
    "label": "Tanne",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Tanne",
      "answer": "forest-fir",
      "choices": [
        "forest-fir",
        "bee",
        "fish-swim"
      ]
    }
  },
  {
    "id": "read-word/word-8",
    "label": "Apfel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Apfel",
      "answer": "forest-apple",
      "choices": [
        "forest-apple",
        "mouse-sit",
        "nest"
      ]
    }
  },
  {
    "id": "read-word/word-9",
    "label": "Raupe",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Raupe",
      "answer": "caterpillar",
      "choices": [
        "caterpillar",
        "tree",
        "forest-leaf"
      ]
    }
  },
  {
    "id": "read-word/word-10",
    "label": "Beere",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Beere",
      "answer": "forest-berry",
      "choices": [
        "forest-berry",
        "forest-mushroom",
        "sun"
      ]
    }
  },
  {
    "id": "read-word/word-11",
    "label": "Biene",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Biene",
      "answer": "bee",
      "choices": [
        "bee",
        "forest-nut",
        "butterfly"
      ]
    }
  },
  {
    "id": "read-word/word-12",
    "label": "Maus",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Maus",
      "answer": "mouse-sit",
      "choices": [
        "mouse-sit",
        "fish-swim",
        "ant"
      ]
    }
  },
  {
    "id": "read-word/word-13",
    "label": "Baum",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Baum",
      "answer": "tree",
      "choices": [
        "tree",
        "nest",
        "banana"
      ]
    }
  },
  {
    "id": "read-word/word-14",
    "label": "Pilz",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Pilz",
      "answer": "forest-mushroom",
      "choices": [
        "forest-mushroom",
        "forest-leaf",
        "tomato"
      ]
    }
  },
  {
    "id": "read-word/word-15",
    "label": "Nuss",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Nuss",
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "sun",
        "camera"
      ]
    }
  },
  {
    "id": "read-word/word-16",
    "label": "Fisch",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Fisch",
      "answer": "fish-swim",
      "choices": [
        "fish-swim",
        "butterfly",
        "needle"
      ]
    }
  },
  {
    "id": "read-word/word-17",
    "label": "Nest",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Nest",
      "answer": "nest",
      "choices": [
        "nest",
        "ant",
        "fork"
      ]
    }
  },
  {
    "id": "read-word/word-18",
    "label": "Blatt",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Blatt",
      "answer": "forest-leaf",
      "choices": [
        "forest-leaf",
        "banana",
        "bell"
      ]
    }
  },
  {
    "id": "read-word/word-19",
    "label": "Sonne",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Sonne",
      "answer": "sun",
      "choices": [
        "sun",
        "tomato",
        "carrot"
      ]
    }
  },
  {
    "id": "read-word/word-20",
    "label": "Schmetterling",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Schmetterling",
      "answer": "butterfly",
      "choices": [
        "butterfly",
        "camera",
        "cloud"
      ]
    }
  },
  {
    "id": "read-word/word-21",
    "label": "Ameise",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Ameise",
      "answer": "ant",
      "choices": [
        "ant",
        "needle",
        "spade"
      ]
    }
  },
  {
    "id": "read-word/word-22",
    "label": "Banane",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Banane",
      "answer": "banana",
      "choices": [
        "banana",
        "fork",
        "cake"
      ]
    }
  },
  {
    "id": "read-word/word-23",
    "label": "Tomate",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Tomate",
      "answer": "tomato",
      "choices": [
        "tomato",
        "bell",
        "rain"
      ]
    }
  },
  {
    "id": "read-word/word-24",
    "label": "Kamera",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Kamera",
      "answer": "camera",
      "choices": [
        "camera",
        "carrot",
        "bird-sit"
      ]
    }
  },
  {
    "id": "read-word/word-25",
    "label": "Nadel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Nadel",
      "answer": "needle",
      "choices": [
        "needle",
        "cloud",
        "snail"
      ]
    }
  },
  {
    "id": "read-word/word-26",
    "label": "Gabel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Gabel",
      "answer": "fork",
      "choices": [
        "fork",
        "spade",
        "hare-sit"
      ]
    }
  },
  {
    "id": "read-word/word-27",
    "label": "Glocke",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Glocke",
      "answer": "bell",
      "choices": [
        "bell",
        "cake",
        "beaver"
      ]
    }
  },
  {
    "id": "read-word/word-28",
    "label": "Karotte",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Karotte",
      "answer": "carrot",
      "choices": [
        "carrot",
        "rain",
        "hedgehog"
      ]
    }
  },
  {
    "id": "read-word/word-29",
    "label": "Wolke",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Wolke",
      "answer": "cloud",
      "choices": [
        "cloud",
        "bird-sit",
        "forest-feather"
      ]
    }
  },
  {
    "id": "read-word/word-30",
    "label": "Schaufel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Schaufel",
      "answer": "spade",
      "choices": [
        "spade",
        "snail",
        "forest-rose"
      ]
    }
  },
  {
    "id": "read-word/word-31",
    "label": "Kuchen",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Kuchen",
      "answer": "cake",
      "choices": [
        "cake",
        "hare-sit",
        "magnifier"
      ]
    }
  },
  {
    "id": "read-word/word-32",
    "label": "Regen",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Regen",
      "answer": "rain",
      "choices": [
        "rain",
        "beaver",
        "forest-flower"
      ]
    }
  },
  {
    "id": "read-word/word-33",
    "label": "Vogel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Vogel",
      "answer": "bird-sit",
      "choices": [
        "bird-sit",
        "hedgehog",
        "forest-fir"
      ]
    }
  },
  {
    "id": "read-word/word-34",
    "label": "Schnecke",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zum Wort?",
      "text": "Schnecke",
      "answer": "snail",
      "choices": [
        "snail",
        "forest-feather",
        "forest-apple"
      ]
    }
  }
]
```
