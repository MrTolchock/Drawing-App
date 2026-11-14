# Tierrätsel

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-hedgehog`
- Host: hedgehog
- Related competence: **NMG.2.4.a; D.2.B.1.b** — Tiermerkmale erkennen und Fragen lesen
- Difficulty: 25 kurze Fragen zu Schweizer Waldtieren; drei Bildantworten
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
| `friends-hedgehog/riddle-0` | Wer trägt Stacheln auf dem Rücken? — Wer trägt Stacheln auf dem Rücken? | "hedgehog" |
| `friends-hedgehog/riddle-1` | Welcher kleine Vogel hat eine blaue Kappe? — Welcher kleine Vogel hat eine blaue Kappe? | "bird-sit" |
| `friends-hedgehog/riddle-2` | Wer schwimmt mit Flossen im Bach? — Wer schwimmt mit Flossen im Bach? | "fish-swim" |
| `friends-hedgehog/riddle-3` | Wer sammelt Nektar und macht Honig? — Wer sammelt Nektar und macht Honig? | "bee" |
| `friends-hedgehog/riddle-4` | Wer trägt sein Haus auf dem Rücken? — Wer trägt sein Haus auf dem Rücken? | "snail" |
| `friends-hedgehog/riddle-5` | Wer hat acht Beine und baut ein Netz? — Wer hat acht Beine und baut ein Netz? | "spider" |
| `friends-hedgehog/riddle-6` | Wer war eine Raupe und hat nun bunte Flügel? — Wer war eine Raupe und hat nun bunte Flügel? | "butterfly" |
| `friends-hedgehog/riddle-7` | Wer frisst Blätter und wird ein Schmetterling? — Wer frisst Blätter und wird ein Schmetterling? | "caterpillar" |
| `friends-hedgehog/riddle-8` | Welcher kleine rote Käfer hat schwarze Punkte? — Welcher kleine rote Käfer hat schwarze Punkte? | "ladybird" |
| `friends-hedgehog/riddle-9` | Wer hat lange Ohren und kräftige Hinterbeine? — Wer hat lange Ohren und kräftige Hinterbeine? | "hare-sit" |
| `friends-hedgehog/riddle-10` | Wer hat einen buschigen Schwanz und sammelt Nüsse? — Wer hat einen buschigen Schwanz und sammelt Nüsse? | "squirrel-sit" |
| `friends-hedgehog/riddle-11` | Wer hat schwarze und weisse Streifen im Gesicht? — Wer hat schwarze und weisse Streifen im Gesicht? | "badger-walk" |
| `friends-hedgehog/riddle-12` | Wer hat einen breiten, flachen Schwanz? — Wer hat einen breiten, flachen Schwanz? | "beaver" |
| `friends-hedgehog/riddle-13` | Wer hüpft am Teich und quakt? — Wer hüpft am Teich und quakt? | "frog-sit" |
| `friends-hedgehog/riddle-14` | Wer lebt mit vielen anderen in einem Ameisenhaufen? — Wer lebt mit vielen anderen in einem Ameisenhaufen? | "ant" |
| `friends-hedgehog/riddle-15` | Wer hat einen langen, dünnen Schwanz? — Wer hat einen langen, dünnen Schwanz? | "mouse-sit" |
| `friends-hedgehog/riddle-16` | Wer hat rotes Fell und eine weisse Schwanzspitze? — Wer hat rotes Fell und eine weisse Schwanzspitze? | "fox-run" |
| `friends-hedgehog/riddle-17` | Wer hat schlanke Beine und ein kleines Geweih? — Wer hat schlanke Beine und ein kleines Geweih? | "roe-stand" |
| `friends-hedgehog/riddle-18` | Wer klopft mit seinem Schnabel an Baumstämme? — Wer klopft mit seinem Schnabel an Baumstämme? | "forest-woodpecker" |
| `friends-hedgehog/riddle-19` | Wer hängt beim Schlafen mit dem Kopf nach unten? — Wer hängt beim Schlafen mit dem Kopf nach unten? | "forest-bat" |
| `friends-hedgehog/riddle-20` | Welcher Vogel jagt in der Nacht? — Welcher Vogel jagt in der Nacht? | "forest-owl" |
| `friends-hedgehog/riddle-21` | Welcher kleine Vogel hat eine orangerote Brust? — Welcher kleine Vogel hat eine orangerote Brust? | "forest-robin" |
| `friends-hedgehog/riddle-22` | Welche Waldkatze hat Pinsel an den Ohren? — Welche Waldkatze hat Pinsel an den Ohren? | "forest-lynx" |
| `friends-hedgehog/riddle-23` | Wer hat braunes Fell und einen gelben Kehlfleck? — Wer hat braunes Fell und einen gelben Kehlfleck? | "forest-marten" |
| `friends-hedgehog/riddle-24` | Wer lebt in der Erde und hat keine Beine? — Wer lebt in der Erde und hat keine Beine? | "vocab-worm" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-hedgehog/riddle-0",
    "label": "Wer trägt Stacheln auf dem Rücken?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer trägt Stacheln auf dem Rücken?",
      "answer": "hedgehog",
      "choices": [
        "hedgehog",
        "mouse-sit",
        "frog-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-1",
    "label": "Welcher kleine Vogel hat eine blaue Kappe?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welcher kleine Vogel hat eine blaue Kappe?",
      "answer": "bird-sit",
      "choices": [
        "bird-sit",
        "forest-robin",
        "forest-woodpecker"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-2",
    "label": "Wer schwimmt mit Flossen im Bach?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer schwimmt mit Flossen im Bach?",
      "answer": "fish-swim",
      "choices": [
        "fish-swim",
        "beaver",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-3",
    "label": "Wer sammelt Nektar und macht Honig?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer sammelt Nektar und macht Honig?",
      "answer": "bee",
      "choices": [
        "bee",
        "spider",
        "ant"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-4",
    "label": "Wer trägt sein Haus auf dem Rücken?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer trägt sein Haus auf dem Rücken?",
      "answer": "snail",
      "choices": [
        "snail",
        "caterpillar",
        "vocab-worm"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-5",
    "label": "Wer hat acht Beine und baut ein Netz?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat acht Beine und baut ein Netz?",
      "answer": "spider",
      "choices": [
        "spider",
        "ant",
        "ladybird"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-6",
    "label": "Wer war eine Raupe und hat nun bunte Flügel?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer war eine Raupe und hat nun bunte Flügel?",
      "answer": "butterfly",
      "choices": [
        "butterfly",
        "bee",
        "bird-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-7",
    "label": "Wer frisst Blätter und wird ein Schmetterling?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer frisst Blätter und wird ein Schmetterling?",
      "answer": "caterpillar",
      "choices": [
        "caterpillar",
        "vocab-worm",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-8",
    "label": "Welcher kleine rote Käfer hat schwarze Punkte?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welcher kleine rote Käfer hat schwarze Punkte?",
      "answer": "ladybird",
      "choices": [
        "ladybird",
        "ant",
        "bee"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-9",
    "label": "Wer hat lange Ohren und kräftige Hinterbeine?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat lange Ohren und kräftige Hinterbeine?",
      "answer": "hare-sit",
      "choices": [
        "hare-sit",
        "hedgehog",
        "mouse-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-10",
    "label": "Wer hat einen buschigen Schwanz und sammelt Nüsse?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat einen buschigen Schwanz und sammelt Nüsse?",
      "answer": "squirrel-sit",
      "choices": [
        "squirrel-sit",
        "beaver",
        "frog-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-11",
    "label": "Wer hat schwarze und weisse Streifen im Gesicht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat schwarze und weisse Streifen im Gesicht?",
      "answer": "badger-walk",
      "choices": [
        "badger-walk",
        "fox-run",
        "squirrel-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-12",
    "label": "Wer hat einen breiten, flachen Schwanz?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat einen breiten, flachen Schwanz?",
      "answer": "beaver",
      "choices": [
        "beaver",
        "mouse-sit",
        "hare-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-13",
    "label": "Wer hüpft am Teich und quakt?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hüpft am Teich und quakt?",
      "answer": "frog-sit",
      "choices": [
        "frog-sit",
        "mouse-sit",
        "ant"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-14",
    "label": "Wer lebt mit vielen anderen in einem Ameisenhaufen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer lebt mit vielen anderen in einem Ameisenhaufen?",
      "answer": "ant",
      "choices": [
        "ant",
        "spider",
        "ladybird"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-15",
    "label": "Wer hat einen langen, dünnen Schwanz?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat einen langen, dünnen Schwanz?",
      "answer": "mouse-sit",
      "choices": [
        "mouse-sit",
        "hare-sit",
        "badger-walk"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-16",
    "label": "Wer hat rotes Fell und eine weisse Schwanzspitze?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat rotes Fell und eine weisse Schwanzspitze?",
      "answer": "fox-run",
      "choices": [
        "fox-run",
        "badger-walk",
        "roe-stand"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-17",
    "label": "Wer hat schlanke Beine und ein kleines Geweih?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat schlanke Beine und ein kleines Geweih?",
      "answer": "roe-stand",
      "choices": [
        "roe-stand",
        "hare-sit",
        "fox-run"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-18",
    "label": "Wer klopft mit seinem Schnabel an Baumstämme?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer klopft mit seinem Schnabel an Baumstämme?",
      "answer": "forest-woodpecker",
      "choices": [
        "forest-woodpecker",
        "forest-robin",
        "bird-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-19",
    "label": "Wer hängt beim Schlafen mit dem Kopf nach unten?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hängt beim Schlafen mit dem Kopf nach unten?",
      "answer": "forest-bat",
      "choices": [
        "forest-bat",
        "forest-owl",
        "squirrel-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-20",
    "label": "Welcher Vogel jagt in der Nacht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welcher Vogel jagt in der Nacht?",
      "answer": "forest-owl",
      "choices": [
        "forest-owl",
        "forest-robin",
        "forest-woodpecker"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-21",
    "label": "Welcher kleine Vogel hat eine orangerote Brust?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welcher kleine Vogel hat eine orangerote Brust?",
      "answer": "forest-robin",
      "choices": [
        "forest-robin",
        "bird-sit",
        "forest-woodpecker"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-22",
    "label": "Welche Waldkatze hat Pinsel an den Ohren?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Welche Waldkatze hat Pinsel an den Ohren?",
      "answer": "forest-lynx",
      "choices": [
        "forest-lynx",
        "fox-run",
        "badger-walk"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-23",
    "label": "Wer hat braunes Fell und einen gelben Kehlfleck?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer hat braunes Fell und einen gelben Kehlfleck?",
      "answer": "forest-marten",
      "choices": [
        "forest-marten",
        "fox-run",
        "forest-lynx"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-24",
    "label": "Wer lebt in der Erde und hat keine Beine?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Bild passt zur Frage?",
      "text": "Wer lebt in der Erde und hat keine Beine?",
      "answer": "vocab-worm",
      "choices": [
        "vocab-worm",
        "ant",
        "caterpillar"
      ]
    }
  }
]
```
