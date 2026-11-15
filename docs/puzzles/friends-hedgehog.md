# Tierrätsel

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-hedgehog`
- Host: hedgehog
- Related competence: **NMG.2.4.a; D.2.B.1.b** — Tiermerkmale erkennen und Fragen lesen
- Difficulty: 25 kurze Fragen zu sichtbaren Tiermerkmalen; zwei Bildantworten
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
| `friends-hedgehog/riddle-0` | Wer hat Stacheln? — Wer hat Stacheln? | "hedgehog" |
| `friends-hedgehog/riddle-1` | Wer hat eine blaue Kappe? — Wer hat eine blaue Kappe? | "bird-sit" |
| `friends-hedgehog/riddle-2` | Wer hat Flossen? — Wer hat Flossen? | "fish-swim" |
| `friends-hedgehog/riddle-3` | Wer macht Honig? — Wer macht Honig? | "bee" |
| `friends-hedgehog/riddle-4` | Wer trägt ein Schneckenhaus? — Wer trägt ein Schneckenhaus? | "snail" |
| `friends-hedgehog/riddle-5` | Wer hat acht Beine? — Wer hat acht Beine? | "spider" |
| `friends-hedgehog/riddle-6` | Wer hat bunte Flügel? — Wer hat bunte Flügel? | "butterfly" |
| `friends-hedgehog/riddle-7` | Wer wird ein Schmetterling? — Wer wird ein Schmetterling? | "caterpillar" |
| `friends-hedgehog/riddle-8` | Wer ist rot mit schwarzen Punkten? — Wer ist rot mit schwarzen Punkten? | "ladybird" |
| `friends-hedgehog/riddle-9` | Wer hat lange Ohren? — Wer hat lange Ohren? | "hare-sit" |
| `friends-hedgehog/riddle-10` | Wer sammelt Nüsse? — Wer sammelt Nüsse? | "squirrel-sit" |
| `friends-hedgehog/riddle-11` | Wer hat Streifen im Gesicht? — Wer hat Streifen im Gesicht? | "badger-walk" |
| `friends-hedgehog/riddle-12` | Wer hat einen flachen Schwanz? — Wer hat einen flachen Schwanz? | "beaver" |
| `friends-hedgehog/riddle-13` | Wer quakt? — Wer quakt? | "frog-sit" |
| `friends-hedgehog/riddle-14` | Wer lebt im Ameisenhaufen? — Wer lebt im Ameisenhaufen? | "ant" |
| `friends-hedgehog/riddle-15` | Wer hat einen dünnen Schwanz? — Wer hat einen dünnen Schwanz? | "mouse-sit" |
| `friends-hedgehog/riddle-16` | Wer hat eine weisse Schwanzspitze? — Wer hat eine weisse Schwanzspitze? | "forest-fox" |
| `friends-hedgehog/riddle-17` | Wer hat ein kleines Geweih? — Wer hat ein kleines Geweih? | "roe-stand" |
| `friends-hedgehog/riddle-18` | Wer klopft am Baum? — Wer klopft am Baum? | "forest-woodpecker" |
| `friends-hedgehog/riddle-19` | Wer schläft mit dem Kopf unten? — Wer schläft mit dem Kopf unten? | "forest-bat" |
| `friends-hedgehog/riddle-20` | Wer hat grosse, runde Augen? — Wer hat grosse, runde Augen? | "forest-owl" |
| `friends-hedgehog/riddle-21` | Wer hat eine rote Brust? — Wer hat eine rote Brust? | "forest-robin" |
| `friends-hedgehog/riddle-22` | Wer hat Pinsel an den Ohren? — Wer hat Pinsel an den Ohren? | "forest-lynx" |
| `friends-hedgehog/riddle-23` | Wer hat einen hellen Fleck am Hals? — Wer hat einen hellen Fleck am Hals? | "forest-marten" |
| `friends-hedgehog/riddle-24` | Wer kriecht ohne Beine? — Wer kriecht ohne Beine? | "vocab-worm" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-hedgehog/riddle-0",
    "label": "Wer hat Stacheln?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat Stacheln?",
      "answer": "hedgehog",
      "choices": [
        "hedgehog",
        "mouse-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-1",
    "label": "Wer hat eine blaue Kappe?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat eine blaue Kappe?",
      "answer": "bird-sit",
      "choices": [
        "bird-sit",
        "forest-robin"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-2",
    "label": "Wer hat Flossen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat Flossen?",
      "answer": "fish-swim",
      "choices": [
        "fish-swim",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-3",
    "label": "Wer macht Honig?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer macht Honig?",
      "answer": "bee",
      "choices": [
        "bee",
        "spider"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-4",
    "label": "Wer trägt ein Schneckenhaus?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer trägt ein Schneckenhaus?",
      "answer": "snail",
      "choices": [
        "snail",
        "caterpillar"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-5",
    "label": "Wer hat acht Beine?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat acht Beine?",
      "answer": "spider",
      "choices": [
        "spider",
        "bird-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-6",
    "label": "Wer hat bunte Flügel?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat bunte Flügel?",
      "answer": "butterfly",
      "choices": [
        "butterfly",
        "vocab-worm"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-7",
    "label": "Wer wird ein Schmetterling?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer wird ein Schmetterling?",
      "answer": "caterpillar",
      "choices": [
        "caterpillar",
        "snail"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-8",
    "label": "Wer ist rot mit schwarzen Punkten?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer ist rot mit schwarzen Punkten?",
      "answer": "ladybird",
      "choices": [
        "ladybird",
        "bee"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-9",
    "label": "Wer hat lange Ohren?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat lange Ohren?",
      "answer": "hare-sit",
      "choices": [
        "hare-sit",
        "hedgehog"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-10",
    "label": "Wer sammelt Nüsse?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer sammelt Nüsse?",
      "answer": "squirrel-sit",
      "choices": [
        "squirrel-sit",
        "frog-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-11",
    "label": "Wer hat Streifen im Gesicht?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat Streifen im Gesicht?",
      "answer": "badger-walk",
      "choices": [
        "badger-walk",
        "forest-fox"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-12",
    "label": "Wer hat einen flachen Schwanz?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat einen flachen Schwanz?",
      "answer": "beaver",
      "choices": [
        "beaver",
        "hare-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-13",
    "label": "Wer quakt?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer quakt?",
      "answer": "frog-sit",
      "choices": [
        "frog-sit",
        "mouse-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-14",
    "label": "Wer lebt im Ameisenhaufen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer lebt im Ameisenhaufen?",
      "answer": "ant",
      "choices": [
        "ant",
        "spider"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-15",
    "label": "Wer hat einen dünnen Schwanz?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat einen dünnen Schwanz?",
      "answer": "mouse-sit",
      "choices": [
        "mouse-sit",
        "squirrel-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-16",
    "label": "Wer hat eine weisse Schwanzspitze?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat eine weisse Schwanzspitze?",
      "answer": "forest-fox",
      "choices": [
        "forest-fox",
        "badger-walk"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-17",
    "label": "Wer hat ein kleines Geweih?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat ein kleines Geweih?",
      "answer": "roe-stand",
      "choices": [
        "roe-stand",
        "hare-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-18",
    "label": "Wer klopft am Baum?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer klopft am Baum?",
      "answer": "forest-woodpecker",
      "choices": [
        "forest-woodpecker",
        "frog-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-19",
    "label": "Wer schläft mit dem Kopf unten?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer schläft mit dem Kopf unten?",
      "answer": "forest-bat",
      "choices": [
        "forest-bat",
        "squirrel-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-20",
    "label": "Wer hat grosse, runde Augen?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat grosse, runde Augen?",
      "answer": "forest-owl",
      "choices": [
        "forest-owl",
        "vocab-worm"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-21",
    "label": "Wer hat eine rote Brust?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat eine rote Brust?",
      "answer": "forest-robin",
      "choices": [
        "forest-robin",
        "bird-sit"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-22",
    "label": "Wer hat Pinsel an den Ohren?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat Pinsel an den Ohren?",
      "answer": "forest-lynx",
      "choices": [
        "forest-lynx",
        "forest-fox"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-23",
    "label": "Wer hat einen hellen Fleck am Hals?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer hat einen hellen Fleck am Hals?",
      "answer": "forest-marten",
      "choices": [
        "forest-marten",
        "vocab-worm"
      ]
    }
  },
  {
    "id": "friends-hedgehog/riddle-24",
    "label": "Wer kriecht ohne Beine?",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Wer kriecht ohne Beine?",
      "answer": "vocab-worm",
      "choices": [
        "vocab-worm",
        "ant"
      ]
    }
  }
]
```
