# Tierrätsel

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-hedgehog`
- Host: hedgehog
- Related competence: **NMG.2.4.a; D.2.B.1.b** — Tiermerkmale erkennen und Fragen lesen
- Difficulty: 25 kurze Tierfragen; drei Bildantworten
- Pool: 25 explicit iterations; a round selects five.
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
| `friends-hedgehog/riddle-0` | Wer hat Stacheln? — Wer hat Stacheln? | "hedgehog" |
| `friends-hedgehog/riddle-1` | Wer hat Flossen? — Wer hat Flossen? | "fish" |
| `friends-hedgehog/riddle-2` | Wer quakt? — Wer quakt? | "frog" |
| `friends-hedgehog/riddle-3` | Wer summt? — Wer summt? | "bee" |
| `friends-hedgehog/riddle-4` | Wer bellt? — Wer bellt? | "dog" |
| `friends-hedgehog/riddle-5` | Wer miaut? — Wer miaut? | "cat" |
| `friends-hedgehog/riddle-6` | Wer muht? — Wer muht? | "cow" |
| `friends-hedgehog/riddle-7` | Wer hat acht Beine? — Wer hat acht Beine? | "spider" |
| `friends-hedgehog/riddle-8` | Wer trägt sein Haus? — Wer trägt sein Haus? | "snail" |
| `friends-hedgehog/riddle-9` | Wer hat einen Panzer? — Wer hat einen Panzer? | "tortoise" |
| `friends-hedgehog/riddle-10` | Wer hat lange Ohren? — Wer hat lange Ohren? | "rabbit" |
| `friends-hedgehog/riddle-11` | Wer hat bunte Flügel? — Wer hat bunte Flügel? | "butterfly" |
| `friends-hedgehog/riddle-12` | Wer hat Federn? — Wer hat Federn? | "bird" |
| `friends-hedgehog/riddle-13` | Wer hat Punkte auf dem Rücken? — Wer hat Punkte auf dem Rücken? | "ladybird" |
| `friends-hedgehog/riddle-14` | Wer hat Wolle? — Wer hat Wolle? | "sheep" |
| `friends-hedgehog/riddle-15` | Wer frisst Nüsse? — Wer frisst Nüsse? | "squirrel" |
| `friends-hedgehog/riddle-16` | Wer hat einen Rüssel? — Wer hat einen Rüssel? | "elephant" |
| `friends-hedgehog/riddle-17` | Wer hat einen sehr langen Hals? — Wer hat einen sehr langen Hals? | "giraffe" |
| `friends-hedgehog/riddle-18` | Wer hat eine Mähne? — Wer hat eine Mähne? | "lion" |
| `friends-hedgehog/riddle-19` | Wer hat schwarze und weisse Streifen? — Wer hat schwarze und weisse Streifen? | "zebra" |
| `friends-hedgehog/riddle-20` | Wer trägt einen Höcker? — Wer trägt einen Höcker? | "camel" |
| `friends-hedgehog/riddle-21` | Wer hat orangefarbenes Fell mit schwarzen Streifen? — Wer hat orangefarbenes Fell mit schwarzen Streifen? | "tiger" |
| `friends-hedgehog/riddle-22` | Welcher Vogel kann nicht fliegen, aber gut schwimmen? — Welcher Vogel kann nicht fliegen, aber gut schwimmen? | "penguin" |
| `friends-hedgehog/riddle-23` | Wer hat schwarze und weisse Streifen im Gesicht? — Wer hat schwarze und weisse Streifen im Gesicht? | "badger" |
| `friends-hedgehog/riddle-24` | Wer baut einen Damm? — Wer baut einen Damm? | "beaver" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-hedgehog/riddle-0",
    "label": "Wer hat Stacheln?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat Stacheln?",
      "answer": "hedgehog",
      "choices": [
        "hedgehog",
        "fish",
        "frog"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-1",
    "label": "Wer hat Flossen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat Flossen?",
      "answer": "fish",
      "choices": [
        "fish",
        "dog",
        "bee"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-2",
    "label": "Wer quakt?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer quakt?",
      "answer": "frog",
      "choices": [
        "frog",
        "cat",
        "bird"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-3",
    "label": "Wer summt?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer summt?",
      "answer": "bee",
      "choices": [
        "bee",
        "cow",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-4",
    "label": "Wer bellt?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer bellt?",
      "answer": "dog",
      "choices": [
        "dog",
        "frog",
        "butterfly"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-5",
    "label": "Wer miaut?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer miaut?",
      "answer": "cat",
      "choices": [
        "cat",
        "fish",
        "pig"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-6",
    "label": "Wer muht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer muht?",
      "answer": "cow",
      "choices": [
        "cow",
        "bee",
        "spider"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-7",
    "label": "Wer hat acht Beine?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat acht Beine?",
      "answer": "spider",
      "choices": [
        "spider",
        "bird",
        "fish"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-8",
    "label": "Wer trägt sein Haus?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer trägt sein Haus?",
      "answer": "snail",
      "choices": [
        "snail",
        "dog",
        "sheep"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-9",
    "label": "Wer hat einen Panzer?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat einen Panzer?",
      "answer": "tortoise",
      "choices": [
        "tortoise",
        "rabbit",
        "bee"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-10",
    "label": "Wer hat lange Ohren?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat lange Ohren?",
      "answer": "rabbit",
      "choices": [
        "rabbit",
        "fish",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-11",
    "label": "Wer hat bunte Flügel?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat bunte Flügel?",
      "answer": "butterfly",
      "choices": [
        "butterfly",
        "pig",
        "frog"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-12",
    "label": "Wer hat Federn?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat Federn?",
      "answer": "bird",
      "choices": [
        "bird",
        "cow",
        "spider"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-13",
    "label": "Wer hat Punkte auf dem Rücken?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat Punkte auf dem Rücken?",
      "answer": "ladybird",
      "choices": [
        "ladybird",
        "sheep",
        "dog"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-14",
    "label": "Wer hat Wolle?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat Wolle?",
      "answer": "sheep",
      "choices": [
        "sheep",
        "fish",
        "ant"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-15",
    "label": "Wer frisst Nüsse?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer frisst Nüsse?",
      "answer": "squirrel",
      "choices": [
        "squirrel",
        "spider",
        "fish"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-16",
    "label": "Wer hat einen Rüssel?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat einen Rüssel?",
      "answer": "elephant",
      "choices": [
        "elephant",
        "cat",
        "fish"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-17",
    "label": "Wer hat einen sehr langen Hals?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat einen sehr langen Hals?",
      "answer": "giraffe",
      "choices": [
        "giraffe",
        "pig",
        "frog"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-18",
    "label": "Wer hat eine Mähne?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat eine Mähne?",
      "answer": "lion",
      "choices": [
        "lion",
        "sheep",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-19",
    "label": "Wer hat schwarze und weisse Streifen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat schwarze und weisse Streifen?",
      "answer": "zebra",
      "choices": [
        "zebra",
        "dog",
        "bee"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-20",
    "label": "Wer trägt einen Höcker?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer trägt einen Höcker?",
      "answer": "camel",
      "choices": [
        "camel",
        "cat",
        "spider"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-21",
    "label": "Wer hat orangefarbenes Fell mit schwarzen Streifen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat orangefarbenes Fell mit schwarzen Streifen?",
      "answer": "tiger",
      "choices": [
        "tiger",
        "cow",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-22",
    "label": "Welcher Vogel kann nicht fliegen, aber gut schwimmen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welcher Vogel kann nicht fliegen, aber gut schwimmen?",
      "answer": "penguin",
      "choices": [
        "penguin",
        "bird",
        "butterfly"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-23",
    "label": "Wer hat schwarze und weisse Streifen im Gesicht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat schwarze und weisse Streifen im Gesicht?",
      "answer": "badger",
      "choices": [
        "badger",
        "pig",
        "fish"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-24",
    "label": "Wer baut einen Damm?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer baut einen Damm?",
      "answer": "beaver",
      "choices": [
        "beaver",
        "cat",
        "ant"
      ]
    }
  }
]
```
