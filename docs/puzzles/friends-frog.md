# Tierwörter lesen

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `friends-frog`
- Host: frog
- Related competence: **D.2.A.1.b** — Tierwörter lesen
- Difficulty: 25 Tiernamen; ausschliesslich Tierbilder
- Pool: 25 explicit iterations; a round selects five.
- Review: solve every unconfirmed iteration to approve it; × rejects with an optional note. The final celebration approves the puzzle only when all iterations passed. Exact revisions gate release; changes require review again.

## Mapping to the blueprint

| Contract | Implementation |
| --- | --- |
| Picture roles | Drawn woodland subjects; painted host/companions; SVG geometry and tracing |
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
| `friends-frog/animal-0` | Frosch — Frosch | "frog" |
| `friends-frog/animal-1` | Igel — Igel | "hedgehog" |
| `friends-frog/animal-2` | Biene — Biene | "bee" |
| `friends-frog/animal-3` | Schnecke — Schnecke | "snail" |
| `friends-frog/animal-4` | Hund — Hund | "dog" |
| `friends-frog/animal-5` | Katze — Katze | "cat" |
| `friends-frog/animal-6` | Spinne — Spinne | "spider" |
| `friends-frog/animal-7` | Raupe — Raupe | "caterpillar" |
| `friends-frog/animal-8` | Bär — Bär | "bear" |
| `friends-frog/animal-9` | Schaf — Schaf | "sheep" |
| `friends-frog/animal-10` | Schwein — Schwein | "pig" |
| `friends-frog/animal-11` | Fuchs — Fuchs | "forest-fox" |
| `friends-frog/animal-12` | Ente — Ente | "duck-swim" |
| `friends-frog/animal-13` | Ameise — Ameise | "ant" |
| `friends-frog/animal-14` | Käfer — Käfer | "ladybird" |
| `friends-frog/animal-15` | Schildkröte — Schildkröte | "tortoise" |
| `friends-frog/animal-16` | Eichhörnchen — Eichhörnchen | "squirrel-sit" |
| `friends-frog/animal-17` | Zebra — Zebra | "zebra" |
| `friends-frog/animal-18` | Löwe — Löwe | "lion" |
| `friends-frog/animal-19` | Pinguin — Pinguin | "penguin" |
| `friends-frog/animal-20` | Kamel — Kamel | "camel" |
| `friends-frog/animal-21` | Tiger — Tiger | "tiger" |
| `friends-frog/animal-22` | Elefant — Elefant | "elephant" |
| `friends-frog/animal-23` | Giraffe — Giraffe | "giraffe" |
| `friends-frog/animal-24` | Dachs — Dachs | "badger" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "friends-frog/animal-0",
    "label": "Frosch",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Frosch",
      "answer": "frog",
      "choices": [
        "frog",
        "dog",
        "sheep"
      ]
    }
  },
  {
    "id": "friends-frog/animal-1",
    "label": "Igel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Igel",
      "answer": "hedgehog",
      "choices": [
        "hedgehog",
        "cat",
        "pig"
      ]
    }
  },
  {
    "id": "friends-frog/animal-2",
    "label": "Biene",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Biene",
      "answer": "bee",
      "choices": [
        "bee",
        "spider",
        "forest-fox"
      ]
    }
  },
  {
    "id": "friends-frog/animal-3",
    "label": "Schnecke",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Schnecke",
      "answer": "snail",
      "choices": [
        "snail",
        "caterpillar",
        "duck-swim"
      ]
    }
  },
  {
    "id": "friends-frog/animal-4",
    "label": "Hund",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Hund",
      "answer": "dog",
      "choices": [
        "dog",
        "bear",
        "ant"
      ]
    }
  },
  {
    "id": "friends-frog/animal-5",
    "label": "Katze",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Katze",
      "answer": "cat",
      "choices": [
        "cat",
        "sheep",
        "ladybird"
      ]
    }
  },
  {
    "id": "friends-frog/animal-6",
    "label": "Spinne",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Spinne",
      "answer": "spider",
      "choices": [
        "spider",
        "pig",
        "tortoise"
      ]
    }
  },
  {
    "id": "friends-frog/animal-7",
    "label": "Raupe",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Raupe",
      "answer": "caterpillar",
      "choices": [
        "caterpillar",
        "forest-fox",
        "squirrel-sit"
      ]
    }
  },
  {
    "id": "friends-frog/animal-8",
    "label": "Bär",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Bär",
      "answer": "bear",
      "choices": [
        "bear",
        "duck-swim",
        "zebra"
      ]
    }
  },
  {
    "id": "friends-frog/animal-9",
    "label": "Schaf",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Schaf",
      "answer": "sheep",
      "choices": [
        "sheep",
        "ant",
        "lion"
      ]
    }
  },
  {
    "id": "friends-frog/animal-10",
    "label": "Schwein",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Schwein",
      "answer": "pig",
      "choices": [
        "pig",
        "ladybird",
        "penguin"
      ]
    }
  },
  {
    "id": "friends-frog/animal-11",
    "label": "Fuchs",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Fuchs",
      "answer": "forest-fox",
      "choices": [
        "forest-fox",
        "tortoise",
        "camel"
      ]
    }
  },
  {
    "id": "friends-frog/animal-12",
    "label": "Ente",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Ente",
      "answer": "duck-swim",
      "choices": [
        "duck-swim",
        "squirrel-sit",
        "tiger"
      ]
    }
  },
  {
    "id": "friends-frog/animal-13",
    "label": "Ameise",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Ameise",
      "answer": "ant",
      "choices": [
        "ant",
        "zebra",
        "elephant"
      ]
    }
  },
  {
    "id": "friends-frog/animal-14",
    "label": "Käfer",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Käfer",
      "answer": "ladybird",
      "choices": [
        "ladybird",
        "lion",
        "giraffe"
      ]
    }
  },
  {
    "id": "friends-frog/animal-15",
    "label": "Schildkröte",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Schildkröte",
      "answer": "tortoise",
      "choices": [
        "tortoise",
        "penguin",
        "badger"
      ]
    }
  },
  {
    "id": "friends-frog/animal-16",
    "label": "Eichhörnchen",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Eichhörnchen",
      "answer": "squirrel-sit",
      "choices": [
        "squirrel-sit",
        "camel",
        "frog"
      ]
    }
  },
  {
    "id": "friends-frog/animal-17",
    "label": "Zebra",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Zebra",
      "answer": "zebra",
      "choices": [
        "zebra",
        "tiger",
        "hedgehog"
      ]
    }
  },
  {
    "id": "friends-frog/animal-18",
    "label": "Löwe",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Löwe",
      "answer": "lion",
      "choices": [
        "lion",
        "elephant",
        "bee"
      ]
    }
  },
  {
    "id": "friends-frog/animal-19",
    "label": "Pinguin",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Pinguin",
      "answer": "penguin",
      "choices": [
        "penguin",
        "giraffe",
        "snail"
      ]
    }
  },
  {
    "id": "friends-frog/animal-20",
    "label": "Kamel",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Kamel",
      "answer": "camel",
      "choices": [
        "camel",
        "badger",
        "dog"
      ]
    }
  },
  {
    "id": "friends-frog/animal-21",
    "label": "Tiger",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Tiger",
      "answer": "tiger",
      "choices": [
        "tiger",
        "frog",
        "cat"
      ]
    }
  },
  {
    "id": "friends-frog/animal-22",
    "label": "Elefant",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Elefant",
      "answer": "elephant",
      "choices": [
        "elephant",
        "hedgehog",
        "spider"
      ]
    }
  },
  {
    "id": "friends-frog/animal-23",
    "label": "Giraffe",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Giraffe",
      "answer": "giraffe",
      "choices": [
        "giraffe",
        "bee",
        "caterpillar"
      ]
    }
  },
  {
    "id": "friends-frog/animal-24",
    "label": "Dachs",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt zum Wort?",
      "text": "Dachs",
      "answer": "badger",
      "choices": [
        "badger",
        "snail",
        "bear"
      ]
    }
  }
]
```
