# Wer wohnt wo?

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-deer`
- Host: deer
- Related competence: **NMG.2.1.a; D.2.B.1.b** — Lebensräume und Nahrung zuordnen
- Difficulty: 25 kurze Naturfragen; drei Bildantworten
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
| `friends-deer/riddle-0` | Wo schwimmt der Fisch? — Wo schwimmt der Fisch? | "water" |
| `friends-deer/riddle-1` | Wo brütet der Vogel? — Wo brütet der Vogel? | "nest" |
| `friends-deer/riddle-2` | Was frisst der Hase gern? — Was frisst der Hase gern? | "carrot" |
| `friends-deer/riddle-3` | Was legt der Vogel? — Was legt der Vogel? | "egg" |
| `friends-deer/riddle-4` | Was frisst das Eichhörnchen? — Was frisst das Eichhörnchen? | "forest-nut" |
| `friends-deer/riddle-5` | Wo klettert das Eichhörnchen? — Wo klettert das Eichhörnchen? | "tree" |
| `friends-deer/riddle-6` | Wo holt die Biene Nektar? — Wo holt die Biene Nektar? | "flower" |
| `friends-deer/riddle-7` | Was wächst am Baum? — Was wächst am Baum? | "apple" |
| `friends-deer/riddle-8` | Wer lebt im Wasser? — Wer lebt im Wasser? | "fish" |
| `friends-deer/riddle-9` | Wer wohnt im Nest? — Wer wohnt im Nest? | "bird" |
| `friends-deer/riddle-10` | Wer frisst Blätter? — Wer frisst Blätter? | "caterpillar" |
| `friends-deer/riddle-11` | Wer baut ein Netz? — Wer baut ein Netz? | "spider" |
| `friends-deer/riddle-12` | Was wächst unter den Bäumen? — Was wächst unter den Bäumen? | "forest-mushroom" |
| `friends-deer/riddle-13` | Was leuchtet in der Nacht? — Was leuchtet in der Nacht? | "moon" |
| `friends-deer/riddle-14` | Was scheint am Tag? — Was scheint am Tag? | "sun" |
| `friends-deer/riddle-15` | Wer frisst Gras? — Wer frisst Gras? | "cow" |
| `friends-deer/riddle-16` | Wo sammelt der Schmetterling Nektar? — Wo sammelt der Schmetterling Nektar? | "flower" |
| `friends-deer/riddle-17` | Was knabbert der Biber ab? — Was knabbert der Biber ab? | "tree" |
| `friends-deer/riddle-18` | Was pickt der Vogel aus der Erde? — Was pickt der Vogel aus der Erde? | "vocab-worm" |
| `friends-deer/riddle-19` | Was frisst die Schnecke? — Was frisst die Schnecke? | "leaf" |
| `friends-deer/riddle-20` | Wo sucht der Igel kleine Tiere? — Wo sucht der Igel kleine Tiere? | "leaf" |
| `friends-deer/riddle-21` | Was stellt die Biene aus Nektar her? — Was stellt die Biene aus Nektar her? | "honey" |
| `friends-deer/riddle-22` | Wo kann der Frosch schwimmen? — Wo kann der Frosch schwimmen? | "water" |
| `friends-deer/riddle-23` | Was knabbert der Hase auf der Wiese? — Was knabbert der Hase auf der Wiese? | "leaf" |
| `friends-deer/riddle-24` | Was hängt an einer Weinrebe? — Was hängt an einer Weinrebe? | "grapes" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-deer/riddle-0",
    "label": "Wo schwimmt der Fisch?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo schwimmt der Fisch?",
      "answer": "water",
      "choices": [
        "water",
        "tree",
        "nest"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-1",
    "label": "Wo brütet der Vogel?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo brütet der Vogel?",
      "answer": "nest",
      "choices": [
        "nest",
        "water",
        "carrot"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-2",
    "label": "Was frisst der Hase gern?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was frisst der Hase gern?",
      "answer": "carrot",
      "choices": [
        "carrot",
        "fish",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-3",
    "label": "Was legt der Vogel?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was legt der Vogel?",
      "answer": "egg",
      "choices": [
        "egg",
        "apple",
        "flower"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-4",
    "label": "Was frisst das Eichhörnchen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was frisst das Eichhörnchen?",
      "answer": "forest-nut",
      "choices": [
        "forest-nut",
        "fish",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-5",
    "label": "Wo klettert das Eichhörnchen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo klettert das Eichhörnchen?",
      "answer": "tree",
      "choices": [
        "tree",
        "water",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-6",
    "label": "Wo holt die Biene Nektar?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo holt die Biene Nektar?",
      "answer": "flower",
      "choices": [
        "flower",
        "fish",
        "nest"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-7",
    "label": "Was wächst am Baum?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wächst am Baum?",
      "answer": "apple",
      "choices": [
        "apple",
        "carrot",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-8",
    "label": "Wer lebt im Wasser?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer lebt im Wasser?",
      "answer": "fish",
      "choices": [
        "fish",
        "cow",
        "bee"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-9",
    "label": "Wer wohnt im Nest?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer wohnt im Nest?",
      "answer": "bird",
      "choices": [
        "bird",
        "pig",
        "snail"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-10",
    "label": "Wer frisst Blätter?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer frisst Blätter?",
      "answer": "caterpillar",
      "choices": [
        "caterpillar",
        "fish",
        "spider"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-11",
    "label": "Wer baut ein Netz?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer baut ein Netz?",
      "answer": "spider",
      "choices": [
        "spider",
        "cow",
        "fish"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-12",
    "label": "Was wächst unter den Bäumen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was wächst unter den Bäumen?",
      "answer": "forest-mushroom",
      "choices": [
        "forest-mushroom",
        "fish",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-13",
    "label": "Was leuchtet in der Nacht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was leuchtet in der Nacht?",
      "answer": "moon",
      "choices": [
        "moon",
        "sun",
        "flower"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-14",
    "label": "Was scheint am Tag?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was scheint am Tag?",
      "answer": "sun",
      "choices": [
        "sun",
        "moon",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-15",
    "label": "Wer frisst Gras?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer frisst Gras?",
      "answer": "cow",
      "choices": [
        "cow",
        "spider",
        "fish"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-16",
    "label": "Wo sammelt der Schmetterling Nektar?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo sammelt der Schmetterling Nektar?",
      "answer": "flower",
      "choices": [
        "flower",
        "water",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-17",
    "label": "Was knabbert der Biber ab?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was knabbert der Biber ab?",
      "answer": "tree",
      "choices": [
        "tree",
        "fish",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-18",
    "label": "Was pickt der Vogel aus der Erde?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was pickt der Vogel aus der Erde?",
      "answer": "vocab-worm",
      "choices": [
        "vocab-worm",
        "boat",
        "moon"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-19",
    "label": "Was frisst die Schnecke?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was frisst die Schnecke?",
      "answer": "leaf",
      "choices": [
        "leaf",
        "fish",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-20",
    "label": "Wo sucht der Igel kleine Tiere?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo sucht der Igel kleine Tiere?",
      "answer": "leaf",
      "choices": [
        "leaf",
        "cloud",
        "moon"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-21",
    "label": "Was stellt die Biene aus Nektar her?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was stellt die Biene aus Nektar her?",
      "answer": "honey",
      "choices": [
        "honey",
        "cheese",
        "egg"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-22",
    "label": "Wo kann der Frosch schwimmen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wo kann der Frosch schwimmen?",
      "answer": "water",
      "choices": [
        "water",
        "cloud",
        "tree"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-23",
    "label": "Was knabbert der Hase auf der Wiese?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was knabbert der Hase auf der Wiese?",
      "answer": "leaf",
      "choices": [
        "leaf",
        "moon",
        "nest"
      ]
    }
  },
  {
    "id": "friends-deer/riddle-24",
    "label": "Was hängt an einer Weinrebe?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Was hängt an einer Weinrebe?",
      "answer": "grapes",
      "choices": [
        "grapes",
        "egg",
        "fish"
      ]
    }
  }
]
```
