# Naturrätsel

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-badger`
- Host: badger
- Related competence: **NMG.2.3.a; D.2.B.1.b** — Wachstum und Naturveränderungen erkennen
- Difficulty: 25 kurze Fragen zu Wetter, Pflanzen und Entwicklung
- Pool: 25 explicit iterations; a round selects five.
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
| `friends-badger/riddle-0` | Was fällt aus der Wolke? — Was fällt aus der Wolke? | "rain" |
| `friends-badger/riddle-1` | Woraus fällt der Regen? — Woraus fällt der Regen? | "cloud" |
| `friends-badger/riddle-2` | Was wächst aus der Bohne? — Was wächst aus der Bohne? | "seedling" |
| `friends-badger/riddle-3` | Was baut man aus Schnee? — Was baut man aus Schnee? | "snowman" |
| `friends-badger/riddle-4` | Wer schlüpft aus dem Ei? — Wer schlüpft aus dem Ei? | "chick" |
| `friends-badger/riddle-5` | Was fällt im Herbst vom Baum? — Was fällt im Herbst vom Baum? | "leaf" |
| `friends-badger/riddle-6` | Was trinken die Pflanzen? — Was trinken die Pflanzen? | "water" |
| `friends-badger/riddle-7` | Was machen die Bienen? — Was machen die Bienen? | "honey" |
| `friends-badger/riddle-8` | Woraus kommt der Schmetterling? — Woraus kommt der Schmetterling? | "cocoon" |
| `friends-badger/riddle-9` | Was wird aus der Raupe? — Was wird aus der Raupe? | "butterfly" |
| `friends-badger/riddle-10` | Was siehst du am Abend? — Was siehst du am Abend? | "sunset" |
| `friends-badger/riddle-11` | Womit gräbt man in der Erde? — Womit gräbt man in der Erde? | "spade" |
| `friends-badger/riddle-12` | Wer gräbt Gänge in der Erde? — Wer gräbt Gänge in der Erde? | "vocab-worm" |
| `friends-badger/riddle-13` | Welche Blume schaut zur Sonne? — Welche Blume schaut zur Sonne? | "sunflower" |
| `friends-badger/riddle-14` | Welcher Baum hat Nadeln? — Welcher Baum hat Nadeln? | "fir" |
| `friends-badger/riddle-15` | Wer hat Streifen im Gesicht? — Wer hat Streifen im Gesicht? | "badger" |
| `friends-badger/riddle-16` | Was braucht eine Pflanze neben Wasser zum Wachsen? — Was braucht eine Pflanze neben Wasser zum Wachsen? | "sun" |
| `friends-badger/riddle-17` | Was wird aus einer Apfelblüte? — Was wird aus einer Apfelblüte? | "apple" |
| `friends-badger/riddle-18` | Was wächst aus einem Samen in der Erde? — Was wächst aus einem Samen in der Erde? | "plant" |
| `friends-badger/riddle-19` | Was sammeln wir im Herbst unter der Eiche? — Was sammeln wir im Herbst unter der Eiche? | "forest-nut" |
| `friends-badger/riddle-20` | Was sehen wir bei klarem Himmel in der Nacht? — Was sehen wir bei klarem Himmel in der Nacht? | "moon" |
| `friends-badger/riddle-21` | Was wächst auf der Erdbeerpflanze? — Was wächst auf der Erdbeerpflanze? | "strawberry" |
| `friends-badger/riddle-22` | Womit giessen wir die Pflanzen? — Womit giessen wir die Pflanzen? | "bucket" |
| `friends-badger/riddle-23` | Was schützt einen Samen in der Erde vor dem Austrocknen? — Was schützt einen Samen in der Erde vor dem Austrocknen? | "water" |
| `friends-badger/riddle-24` | Was blüht zuerst, bevor die Birne reif wird? — Was blüht zuerst, bevor die Birne reif wird? | "flower" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-badger/riddle-0",
    "label": "Was fällt aus der Wolke?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was fällt aus der Wolke?",
      "answer": "rain",
      "choices": [
        "rain",
        "sun",
        "leaf"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-1",
    "label": "Woraus fällt der Regen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Woraus fällt der Regen?",
      "answer": "cloud",
      "choices": [
        "cloud",
        "moon",
        "flower"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-2",
    "label": "Was wächst aus der Bohne?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wächst aus der Bohne?",
      "answer": "seedling",
      "choices": [
        "seedling",
        "chick",
        "snowman"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-3",
    "label": "Was baut man aus Schnee?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was baut man aus Schnee?",
      "answer": "snowman",
      "choices": [
        "snowman",
        "boat",
        "nest"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-4",
    "label": "Wer schlüpft aus dem Ei?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer schlüpft aus dem Ei?",
      "answer": "chick",
      "choices": [
        "chick",
        "fish",
        "bee"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-5",
    "label": "Was fällt im Herbst vom Baum?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was fällt im Herbst vom Baum?",
      "answer": "leaf",
      "choices": [
        "leaf",
        "egg",
        "moon"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-6",
    "label": "Was trinken die Pflanzen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was trinken die Pflanzen?",
      "answer": "water",
      "choices": [
        "water",
        "honey",
        "cheese"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-7",
    "label": "Was machen die Bienen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was machen die Bienen?",
      "answer": "honey",
      "choices": [
        "honey",
        "cheese",
        "egg"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-8",
    "label": "Woraus kommt der Schmetterling?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Woraus kommt der Schmetterling?",
      "answer": "cocoon",
      "choices": [
        "cocoon",
        "nest",
        "bucket"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-9",
    "label": "Was wird aus der Raupe?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wird aus der Raupe?",
      "answer": "butterfly",
      "choices": [
        "butterfly",
        "bee",
        "bird"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-10",
    "label": "Was siehst du am Abend?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was siehst du am Abend?",
      "answer": "sunset",
      "choices": [
        "sunset",
        "rain",
        "snowman"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-11",
    "label": "Womit gräbt man in der Erde?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Womit gräbt man in der Erde?",
      "answer": "spade",
      "choices": [
        "spade",
        "spoon",
        "fork"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-12",
    "label": "Wer gräbt Gänge in der Erde?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer gräbt Gänge in der Erde?",
      "answer": "vocab-worm",
      "choices": [
        "vocab-worm",
        "bird",
        "fish"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-13",
    "label": "Welche Blume schaut zur Sonne?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welche Blume schaut zur Sonne?",
      "answer": "sunflower",
      "choices": [
        "sunflower",
        "forest-rose",
        "fir"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-14",
    "label": "Welcher Baum hat Nadeln?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welcher Baum hat Nadeln?",
      "answer": "fir",
      "choices": [
        "fir",
        "tree",
        "sunflower"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-15",
    "label": "Wer hat Streifen im Gesicht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat Streifen im Gesicht?",
      "answer": "badger",
      "choices": [
        "badger",
        "pig",
        "sheep"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-16",
    "label": "Was braucht eine Pflanze neben Wasser zum Wachsen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was braucht eine Pflanze neben Wasser zum Wachsen?",
      "answer": "sun",
      "choices": [
        "sun",
        "moon",
        "cheese"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-17",
    "label": "Was wird aus einer Apfelblüte?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wird aus einer Apfelblüte?",
      "answer": "apple",
      "choices": [
        "apple",
        "egg",
        "snowman"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-18",
    "label": "Was wächst aus einem Samen in der Erde?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wächst aus einem Samen in der Erde?",
      "answer": "plant",
      "choices": [
        "plant",
        "fish",
        "moon"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-19",
    "label": "Was sammeln wir im Herbst unter der Eiche?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was sammeln wir im Herbst unter der Eiche?",
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "egg",
        "snowman"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-20",
    "label": "Was sehen wir bei klarem Himmel in der Nacht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was sehen wir bei klarem Himmel in der Nacht?",
      "answer": "moon",
      "choices": [
        "moon",
        "sun",
        "sunflower"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-21",
    "label": "Was wächst auf der Erdbeerpflanze?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wächst auf der Erdbeerpflanze?",
      "answer": "strawberry",
      "choices": [
        "strawberry",
        "carrot",
        "egg"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-22",
    "label": "Womit giessen wir die Pflanzen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Womit giessen wir die Pflanzen?",
      "answer": "bucket",
      "choices": [
        "bucket",
        "fork",
        "hat"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-23",
    "label": "Was schützt einen Samen in der Erde vor dem Austrocknen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was schützt einen Samen in der Erde vor dem Austrocknen?",
      "answer": "water",
      "choices": [
        "water",
        "cheese",
        "snowman"
      ]
    }
  },
  {
    "id": "friends-badger/riddle-24",
    "label": "Was blüht zuerst, bevor die Birne reif wird?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was blüht zuerst, bevor die Birne reif wird?",
      "answer": "flower",
      "choices": [
        "flower",
        "fish",
        "egg"
      ]
    }
  }
]
```
