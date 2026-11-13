# Silben klopfen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `syllable`
- Host: bird
- Related competence: **D.1.A.1.b** — Wörter in Silben zerlegen
- Difficulty: 1–3 Silben; vertraute Bildwörter
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
| `syllable/word-0` | Hase — Hase | 2 |
| `syllable/word-1` | Biber — Biber | 2 |
| `syllable/word-2` | Igel — Igel | 2 |
| `syllable/word-3` | Feder — Feder | 2 |
| `syllable/word-4` | Rose — Rose | 2 |
| `syllable/word-5` | Lupe — Lupe | 2 |
| `syllable/word-6` | Blume — Blume | 2 |
| `syllable/word-7` | Tanne — Tanne | 2 |
| `syllable/word-8` | Apfel — Apfel | 2 |
| `syllable/word-9` | Raupe — Raupe | 2 |
| `syllable/word-10` | Beere — Beere | 2 |
| `syllable/word-11` | Biene — Biene | 2 |
| `syllable/word-12` | Maus — Maus | 1 |
| `syllable/word-13` | Baum — Baum | 1 |
| `syllable/word-14` | Pilz — Pilz | 1 |
| `syllable/word-15` | Nuss — Nuss | 1 |
| `syllable/word-16` | Fisch — Fisch | 1 |
| `syllable/word-17` | Nest — Nest | 1 |
| `syllable/word-18` | Blatt — Blatt | 1 |
| `syllable/word-19` | Sonne — Sonne | 2 |
| `syllable/word-20` | Schmetterling — Schmetterling | 3 |
| `syllable/word-21` | Ameise — Ameise | 3 |
| `syllable/word-22` | Banane — Banane | 3 |
| `syllable/word-23` | Tomate — Tomate | 3 |
| `syllable/word-24` | Kamera — Kamera | 3 |
| `syllable/word-25` | Nadel — Nadel | 2 |
| `syllable/word-26` | Gabel — Gabel | 2 |
| `syllable/word-27` | Glocke — Glocke | 2 |
| `syllable/word-28` | Karotte — Karotte | 3 |
| `syllable/word-29` | Wolke — Wolke | 2 |
| `syllable/word-30` | Schaufel — Schaufel | 2 |
| `syllable/word-31` | Kuchen — Kuchen | 2 |
| `syllable/word-32` | Regen — Regen | 2 |
| `syllable/word-33` | Vogel — Vogel | 2 |
| `syllable/word-34` | Schnecke — Schnecke | 2 |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "syllable/word-0",
    "label": "Hase",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Hase",
      "picture": "hare-sit",
      "parts": [
        "Ha",
        "se"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-1",
    "label": "Biber",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Biber",
      "picture": "beaver",
      "parts": [
        "Bi",
        "ber"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-2",
    "label": "Igel",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Igel",
      "picture": "hedgehog",
      "parts": [
        "I",
        "gel"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-3",
    "label": "Feder",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Feder",
      "picture": "forest-feather",
      "parts": [
        "Fe",
        "der"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-4",
    "label": "Rose",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Rose",
      "picture": "forest-rose",
      "parts": [
        "Ro",
        "se"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-5",
    "label": "Lupe",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Lupe",
      "picture": "magnifier",
      "parts": [
        "Lu",
        "pe"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-6",
    "label": "Blume",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Blume",
      "picture": "forest-flower",
      "parts": [
        "Blu",
        "me"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-7",
    "label": "Tanne",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Tanne",
      "picture": "forest-fir",
      "parts": [
        "Tan",
        "ne"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-8",
    "label": "Apfel",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Apfel",
      "picture": "forest-apple",
      "parts": [
        "Ap",
        "fel"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-9",
    "label": "Raupe",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Raupe",
      "picture": "caterpillar",
      "parts": [
        "Rau",
        "pe"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-10",
    "label": "Beere",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Beere",
      "picture": "forest-berry",
      "parts": [
        "Bee",
        "re"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-11",
    "label": "Biene",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Biene",
      "picture": "bee",
      "parts": [
        "Bie",
        "ne"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-12",
    "label": "Maus",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Maus",
      "picture": "mouse-sit",
      "parts": [
        "Maus"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-13",
    "label": "Baum",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Baum",
      "picture": "tree",
      "parts": [
        "Baum"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-14",
    "label": "Pilz",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Pilz",
      "picture": "forest-mushroom",
      "parts": [
        "Pilz"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-15",
    "label": "Nuss",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Nuss",
      "picture": "forest-nut",
      "parts": [
        "Nuss"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-16",
    "label": "Fisch",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Fisch",
      "picture": "fish-swim",
      "parts": [
        "Fisch"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-17",
    "label": "Nest",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Nest",
      "picture": "nest",
      "parts": [
        "Nest"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-18",
    "label": "Blatt",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Blatt",
      "picture": "forest-leaf",
      "parts": [
        "Blatt"
      ],
      "answer": 1,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-19",
    "label": "Sonne",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Sonne",
      "picture": "sun",
      "parts": [
        "Son",
        "ne"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-20",
    "label": "Schmetterling",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Schmetterling",
      "picture": "butterfly",
      "parts": [
        "Schmet",
        "ter",
        "ling"
      ],
      "answer": 3,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-21",
    "label": "Ameise",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Ameise",
      "picture": "ant",
      "parts": [
        "A",
        "mei",
        "se"
      ],
      "answer": 3,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-22",
    "label": "Banane",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Banane",
      "picture": "banana",
      "parts": [
        "Ba",
        "na",
        "ne"
      ],
      "answer": 3,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-23",
    "label": "Tomate",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Tomate",
      "picture": "tomato",
      "parts": [
        "To",
        "ma",
        "te"
      ],
      "answer": 3,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-24",
    "label": "Kamera",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Kamera",
      "picture": "camera",
      "parts": [
        "Ka",
        "me",
        "ra"
      ],
      "answer": 3,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-25",
    "label": "Nadel",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Nadel",
      "picture": "needle",
      "parts": [
        "Na",
        "del"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-26",
    "label": "Gabel",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Gabel",
      "picture": "fork",
      "parts": [
        "Ga",
        "bel"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-27",
    "label": "Glocke",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Glocke",
      "picture": "bell",
      "parts": [
        "Glo",
        "cke"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-28",
    "label": "Karotte",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Karotte",
      "picture": "carrot",
      "parts": [
        "Ka",
        "rot",
        "te"
      ],
      "answer": 3,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-29",
    "label": "Wolke",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Wolke",
      "picture": "cloud",
      "parts": [
        "Wol",
        "ke"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-30",
    "label": "Schaufel",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Schaufel",
      "picture": "spade",
      "parts": [
        "Schau",
        "fel"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-31",
    "label": "Kuchen",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Kuchen",
      "picture": "cake",
      "parts": [
        "Ku",
        "chen"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-32",
    "label": "Regen",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Regen",
      "picture": "rain",
      "parts": [
        "Re",
        "gen"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-33",
    "label": "Vogel",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Vogel",
      "picture": "bird-sit",
      "parts": [
        "Vo",
        "gel"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "syllable/word-34",
    "label": "Schnecke",
    "question": {
      "kind": "syllable",
      "prompt": "Klopfe die Silben. Wie viele hörst du?",
      "word": "Schnecke",
      "picture": "snail",
      "parts": [
        "Schne",
        "cke"
      ],
      "answer": 2,
      "choices": [
        1,
        2,
        3
      ]
    }
  }
]
```
