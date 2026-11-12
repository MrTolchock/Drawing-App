# Silben-Puzzle

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `read-puzzle`
- Host: mouse
- Related competence: **D.2.A.1.b** — Silben zu Wörtern verbinden
- Difficulty: 28 Bildwörter; zwei bis drei Silben; ein Ablenker
- Pool: 28 explicit iterations; a round selects five.
- Review: every iteration plus the puzzle checklist must be approved for this exact revision. New/changed items or difficulty require review again.

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
| Review | Isolated real-renderer previews, individual decisions, revision gate |

## Every iteration

| Stable iteration ID | Content / configuration | Expected answer or solution |
| --- | --- | --- |
| `read-puzzle/word-0` | Hase — Hase | "Hase" |
| `read-puzzle/word-1` | Biber — Biber | "Biber" |
| `read-puzzle/word-2` | Igel — Igel | "Igel" |
| `read-puzzle/word-3` | Feder — Feder | "Feder" |
| `read-puzzle/word-4` | Rose — Rose | "Rose" |
| `read-puzzle/word-5` | Lupe — Lupe | "Lupe" |
| `read-puzzle/word-6` | Blume — Blume | "Blume" |
| `read-puzzle/word-7` | Tanne — Tanne | "Tanne" |
| `read-puzzle/word-8` | Apfel — Apfel | "Apfel" |
| `read-puzzle/word-9` | Raupe — Raupe | "Raupe" |
| `read-puzzle/word-10` | Beere — Beere | "Beere" |
| `read-puzzle/word-11` | Biene — Biene | "Biene" |
| `read-puzzle/word-19` | Sonne — Sonne | "Sonne" |
| `read-puzzle/word-20` | Schmetterling — Schmetterling | "Schmetterling" |
| `read-puzzle/word-21` | Ameise — Ameise | "Ameise" |
| `read-puzzle/word-22` | Banane — Banane | "Banane" |
| `read-puzzle/word-23` | Tomate — Tomate | "Tomate" |
| `read-puzzle/word-24` | Kamera — Kamera | "Kamera" |
| `read-puzzle/word-25` | Nadel — Nadel | "Nadel" |
| `read-puzzle/word-26` | Gabel — Gabel | "Gabel" |
| `read-puzzle/word-27` | Glocke — Glocke | "Glocke" |
| `read-puzzle/word-28` | Karotte — Karotte | "Karotte" |
| `read-puzzle/word-29` | Wolke — Wolke | "Wolke" |
| `read-puzzle/word-30` | Schaufel — Schaufel | "Schaufel" |
| `read-puzzle/word-31` | Kuchen — Kuchen | "Kuchen" |
| `read-puzzle/word-32` | Regen — Regen | "Regen" |
| `read-puzzle/word-33` | Vogel — Vogel | "Vogel" |
| `read-puzzle/word-34` | Schnecke — Schnecke | "Schnecke" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "read-puzzle/word-0",
    "label": "Hase",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Hase",
      "picture": "hare-sit",
      "parts": [
        "Ha",
        "se"
      ],
      "chips": [
        "Ha",
        "se",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Hase"
    }
  },
  {
    "id": "read-puzzle/word-1",
    "label": "Biber",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Biber",
      "picture": "beaver",
      "parts": [
        "Bi",
        "ber"
      ],
      "chips": [
        "Bi",
        "ber",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Biber"
    }
  },
  {
    "id": "read-puzzle/word-2",
    "label": "Igel",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Igel",
      "picture": "hedgehog",
      "parts": [
        "I",
        "gel"
      ],
      "chips": [
        "I",
        "gel",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Igel"
    }
  },
  {
    "id": "read-puzzle/word-3",
    "label": "Feder",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Feder",
      "picture": "forest-feather",
      "parts": [
        "Fe",
        "der"
      ],
      "chips": [
        "Fe",
        "der",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Feder"
    }
  },
  {
    "id": "read-puzzle/word-4",
    "label": "Rose",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Rose",
      "picture": "forest-rose",
      "parts": [
        "Ro",
        "se"
      ],
      "chips": [
        "Ro",
        "se",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Rose"
    }
  },
  {
    "id": "read-puzzle/word-5",
    "label": "Lupe",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Lupe",
      "picture": "magnifier",
      "parts": [
        "Lu",
        "pe"
      ],
      "chips": [
        "Lu",
        "pe",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Lupe"
    }
  },
  {
    "id": "read-puzzle/word-6",
    "label": "Blume",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Blume",
      "picture": "forest-flower",
      "parts": [
        "Blu",
        "me"
      ],
      "chips": [
        "Blu",
        "me",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Blume"
    }
  },
  {
    "id": "read-puzzle/word-7",
    "label": "Tanne",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Tanne",
      "picture": "forest-fir",
      "parts": [
        "Tan",
        "ne"
      ],
      "chips": [
        "Tan",
        "ne",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Tanne"
    }
  },
  {
    "id": "read-puzzle/word-8",
    "label": "Apfel",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Apfel",
      "picture": "forest-apple",
      "parts": [
        "Ap",
        "fel"
      ],
      "chips": [
        "Ap",
        "fel",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Apfel"
    }
  },
  {
    "id": "read-puzzle/word-9",
    "label": "Raupe",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Raupe",
      "picture": "caterpillar",
      "parts": [
        "Rau",
        "pe"
      ],
      "chips": [
        "Rau",
        "pe",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Raupe"
    }
  },
  {
    "id": "read-puzzle/word-10",
    "label": "Beere",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Beere",
      "picture": "forest-berry",
      "parts": [
        "Bee",
        "re"
      ],
      "chips": [
        "Bee",
        "re",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Beere"
    }
  },
  {
    "id": "read-puzzle/word-11",
    "label": "Biene",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Biene",
      "picture": "bee",
      "parts": [
        "Bie",
        "ne"
      ],
      "chips": [
        "Bie",
        "ne",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Biene"
    }
  },
  {
    "id": "read-puzzle/word-19",
    "label": "Sonne",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Sonne",
      "picture": "sun",
      "parts": [
        "Son",
        "ne"
      ],
      "chips": [
        "Son",
        "ne",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Sonne"
    }
  },
  {
    "id": "read-puzzle/word-20",
    "label": "Schmetterling",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Schmetterling",
      "picture": "butterfly",
      "parts": [
        "Schmet",
        "ter",
        "ling"
      ],
      "chips": [
        "Schmet",
        "ter",
        "ling",
        "ma"
      ],
      "order": [
        0,
        1,
        2,
        3
      ],
      "answer": "Schmetterling"
    }
  },
  {
    "id": "read-puzzle/word-21",
    "label": "Ameise",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Ameise",
      "picture": "ant",
      "parts": [
        "A",
        "mei",
        "se"
      ],
      "chips": [
        "A",
        "mei",
        "se",
        "ma"
      ],
      "order": [
        0,
        1,
        2,
        3
      ],
      "answer": "Ameise"
    }
  },
  {
    "id": "read-puzzle/word-22",
    "label": "Banane",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Banane",
      "picture": "banana",
      "parts": [
        "Ba",
        "na",
        "ne"
      ],
      "chips": [
        "Ba",
        "na",
        "ne",
        "ma"
      ],
      "order": [
        0,
        1,
        2,
        3
      ],
      "answer": "Banane"
    }
  },
  {
    "id": "read-puzzle/word-23",
    "label": "Tomate",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Tomate",
      "picture": "tomato",
      "parts": [
        "To",
        "ma",
        "te"
      ],
      "chips": [
        "To",
        "ma",
        "te",
        "lo"
      ],
      "order": [
        0,
        1,
        2,
        3
      ],
      "answer": "Tomate"
    }
  },
  {
    "id": "read-puzzle/word-24",
    "label": "Kamera",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Kamera",
      "picture": "camera",
      "parts": [
        "Ka",
        "me",
        "ra"
      ],
      "chips": [
        "Ka",
        "me",
        "ra",
        "ma"
      ],
      "order": [
        0,
        1,
        2,
        3
      ],
      "answer": "Kamera"
    }
  },
  {
    "id": "read-puzzle/word-25",
    "label": "Nadel",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Nadel",
      "picture": "needle",
      "parts": [
        "Na",
        "del"
      ],
      "chips": [
        "Na",
        "del",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Nadel"
    }
  },
  {
    "id": "read-puzzle/word-26",
    "label": "Gabel",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Gabel",
      "picture": "fork",
      "parts": [
        "Ga",
        "bel"
      ],
      "chips": [
        "Ga",
        "bel",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Gabel"
    }
  },
  {
    "id": "read-puzzle/word-27",
    "label": "Glocke",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Glocke",
      "picture": "bell",
      "parts": [
        "Glo",
        "cke"
      ],
      "chips": [
        "Glo",
        "cke",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Glocke"
    }
  },
  {
    "id": "read-puzzle/word-28",
    "label": "Karotte",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Karotte",
      "picture": "carrot",
      "parts": [
        "Ka",
        "rot",
        "te"
      ],
      "chips": [
        "Ka",
        "rot",
        "te",
        "ma"
      ],
      "order": [
        0,
        1,
        2,
        3
      ],
      "answer": "Karotte"
    }
  },
  {
    "id": "read-puzzle/word-29",
    "label": "Wolke",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Wolke",
      "picture": "cloud",
      "parts": [
        "Wol",
        "ke"
      ],
      "chips": [
        "Wol",
        "ke",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Wolke"
    }
  },
  {
    "id": "read-puzzle/word-30",
    "label": "Schaufel",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Schaufel",
      "picture": "spade",
      "parts": [
        "Schau",
        "fel"
      ],
      "chips": [
        "Schau",
        "fel",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Schaufel"
    }
  },
  {
    "id": "read-puzzle/word-31",
    "label": "Kuchen",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Kuchen",
      "picture": "cake",
      "parts": [
        "Ku",
        "chen"
      ],
      "chips": [
        "Ku",
        "chen",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Kuchen"
    }
  },
  {
    "id": "read-puzzle/word-32",
    "label": "Regen",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Regen",
      "picture": "rain",
      "parts": [
        "Re",
        "gen"
      ],
      "chips": [
        "Re",
        "gen",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Regen"
    }
  },
  {
    "id": "read-puzzle/word-33",
    "label": "Vogel",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Vogel",
      "picture": "bird-sit",
      "parts": [
        "Vo",
        "gel"
      ],
      "chips": [
        "Vo",
        "gel",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Vogel"
    }
  },
  {
    "id": "read-puzzle/word-34",
    "label": "Schnecke",
    "question": {
      "kind": "syllables",
      "prompt": "Setze das Wort aus Silben zusammen.",
      "word": "Schnecke",
      "picture": "snail",
      "parts": [
        "Schne",
        "cke"
      ],
      "chips": [
        "Schne",
        "cke",
        "ma"
      ],
      "order": [
        0,
        1,
        2
      ],
      "answer": "Schnecke"
    }
  }
]
```
