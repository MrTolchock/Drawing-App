# Naturdetektive

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `nature`
- Host: bird
- Related competence: **D.2.B.1.b; NMG.2.4.a** — Naturhinweise lesend verstehen
- Difficulty: 25 Rätsel mit je einem kurzen Satz
- Pool: 25 explicit iterations; a round selects five.
- Review: solve every unconfirmed iteration to approve it; × rejects with an optional note. The puzzle is released when all current iterations passed. Exact per-iteration revisions gate release; only affected iterations require review after changes.

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
| `nature/clue-0` | Ich trage Stacheln auf dem Rücken. — Ich trage Stacheln auf dem Rücken. | "hedgehog" |
| `nature/clue-1` | Mit meinen Flossen schwimme ich. — Mit meinen Flossen schwimme ich. | "fish" |
| `nature/clue-2` | Am Teich quake ich. — Am Teich quake ich. | "frog" |
| `nature/clue-3` | Aus Nektar mache ich Honig. — Aus Nektar mache ich Honig. | "bee" |
| `nature/clue-4` | Ich belle. — Ich belle. | "dog" |
| `nature/clue-5` | Ich miaue. — Ich miaue. | "cat" |
| `nature/clue-6` | Ich gebe Milch. — Ich gebe Milch. | "cow" |
| `nature/clue-7` | Ich baue ein Netz. — Ich baue ein Netz. | "spider" |
| `nature/clue-8` | Mein Haus trage ich mit. — Mein Haus trage ich mit. | "snail" |
| `nature/clue-9` | Mein Panzer schützt mich. — Mein Panzer schützt mich. | "tortoise" |
| `nature/clue-10` | Ich hüpfe mit langen Ohren über die Wiese. — Ich hüpfe mit langen Ohren über die Wiese. | "rabbit" |
| `nature/clue-11` | Aus einer Raupe werde ich zum Falter. — Aus einer Raupe werde ich zum Falter. | "butterfly" |
| `nature/clue-12` | Mein Nest ist im Baum. — Mein Nest ist im Baum. | "bird" |
| `nature/clue-13` | Mein roter Rücken hat schwarze Punkte. — Mein roter Rücken hat schwarze Punkte. | "ladybird" |
| `nature/clue-14` | Ich habe weiche Wolle. — Ich habe weiche Wolle. | "sheep" |
| `nature/clue-15` | Mit meinem buschigen Schwanz balanciere ich auf Ästen. — Mit meinem buschigen Schwanz balanciere ich auf Ästen. | "squirrel" |
| `nature/clue-16` | Mit dem Rüssel trinke ich. — Mit dem Rüssel trinke ich. | "elephant" |
| `nature/clue-17` | Mein Hals ist sehr lang. — Mein Hals ist sehr lang. | "giraffe" |
| `nature/clue-18` | Ich habe eine Mähne. — Ich habe eine Mähne. | "lion" |
| `nature/clue-19` | Mein Fell ist schwarz-weiss gestreift. — Mein Fell ist schwarz-weiss gestreift. | "zebra" |
| `nature/clue-20` | Auf dem Rücken habe ich Höcker. — Auf dem Rücken habe ich Höcker. | "camel" |
| `nature/clue-21` | Mein orangefarbenes Fell hat schwarze Streifen. — Mein orangefarbenes Fell hat schwarze Streifen. | "tiger" |
| `nature/clue-22` | Ich bin ein Vogel, der schwimmt und taucht. — Ich bin ein Vogel, der schwimmt und taucht. | "penguin" |
| `nature/clue-23` | Mein Gesicht hat schwarze und weisse Streifen. — Mein Gesicht hat schwarze und weisse Streifen. | "badger" |
| `nature/clue-24` | Mit Ästen baue ich einen Damm. — Mit Ästen baue ich einen Damm. | "beaver" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "nature/clue-0",
    "label": "Ich trage Stacheln auf dem Rücken.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich trage Stacheln auf dem Rücken.",
      "answer": "hedgehog",
      "choices": [
        "hedgehog",
        "fish",
        "frog"
      ]
    }
  },
  {
    "id": "nature/clue-1",
    "label": "Mit meinen Flossen schwimme ich.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mit meinen Flossen schwimme ich.",
      "answer": "fish",
      "choices": [
        "fish",
        "dog",
        "bee"
      ]
    }
  },
  {
    "id": "nature/clue-2",
    "label": "Am Teich quake ich.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Am Teich quake ich.",
      "answer": "frog",
      "choices": [
        "frog",
        "cat",
        "bird"
      ]
    }
  },
  {
    "id": "nature/clue-3",
    "label": "Aus Nektar mache ich Honig.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Aus Nektar mache ich Honig.",
      "answer": "bee",
      "choices": [
        "bee",
        "cow",
        "snail"
      ]
    }
  },
  {
    "id": "nature/clue-4",
    "label": "Ich belle.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich belle.",
      "answer": "dog",
      "choices": [
        "dog",
        "frog",
        "butterfly"
      ]
    }
  },
  {
    "id": "nature/clue-5",
    "label": "Ich miaue.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich miaue.",
      "answer": "cat",
      "choices": [
        "cat",
        "fish",
        "pig"
      ]
    }
  },
  {
    "id": "nature/clue-6",
    "label": "Ich gebe Milch.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich gebe Milch.",
      "answer": "cow",
      "choices": [
        "cow",
        "bee",
        "spider"
      ]
    }
  },
  {
    "id": "nature/clue-7",
    "label": "Ich baue ein Netz.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich baue ein Netz.",
      "answer": "spider",
      "choices": [
        "spider",
        "bird",
        "fish"
      ]
    }
  },
  {
    "id": "nature/clue-8",
    "label": "Mein Haus trage ich mit.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein Haus trage ich mit.",
      "answer": "snail",
      "choices": [
        "snail",
        "dog",
        "sheep"
      ]
    }
  },
  {
    "id": "nature/clue-9",
    "label": "Mein Panzer schützt mich.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein Panzer schützt mich.",
      "answer": "tortoise",
      "choices": [
        "tortoise",
        "rabbit",
        "bee"
      ]
    }
  },
  {
    "id": "nature/clue-10",
    "label": "Ich hüpfe mit langen Ohren über die Wiese.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich hüpfe mit langen Ohren über die Wiese.",
      "answer": "rabbit",
      "choices": [
        "rabbit",
        "fish",
        "snail"
      ]
    }
  },
  {
    "id": "nature/clue-11",
    "label": "Aus einer Raupe werde ich zum Falter.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Aus einer Raupe werde ich zum Falter.",
      "answer": "butterfly",
      "choices": [
        "butterfly",
        "pig",
        "frog"
      ]
    }
  },
  {
    "id": "nature/clue-12",
    "label": "Mein Nest ist im Baum.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein Nest ist im Baum.",
      "answer": "bird",
      "choices": [
        "bird",
        "cow",
        "spider"
      ]
    }
  },
  {
    "id": "nature/clue-13",
    "label": "Mein roter Rücken hat schwarze Punkte.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein roter Rücken hat schwarze Punkte.",
      "answer": "ladybird",
      "choices": [
        "ladybird",
        "sheep",
        "dog"
      ]
    }
  },
  {
    "id": "nature/clue-14",
    "label": "Ich habe weiche Wolle.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich habe weiche Wolle.",
      "answer": "sheep",
      "choices": [
        "sheep",
        "fish",
        "ant"
      ]
    }
  },
  {
    "id": "nature/clue-15",
    "label": "Mit meinem buschigen Schwanz balanciere ich auf Ästen.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mit meinem buschigen Schwanz balanciere ich auf Ästen.",
      "answer": "squirrel",
      "choices": [
        "squirrel",
        "spider",
        "fish"
      ]
    }
  },
  {
    "id": "nature/clue-16",
    "label": "Mit dem Rüssel trinke ich.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mit dem Rüssel trinke ich.",
      "answer": "elephant",
      "choices": [
        "elephant",
        "cat",
        "fish"
      ]
    }
  },
  {
    "id": "nature/clue-17",
    "label": "Mein Hals ist sehr lang.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein Hals ist sehr lang.",
      "answer": "giraffe",
      "choices": [
        "giraffe",
        "pig",
        "frog"
      ]
    }
  },
  {
    "id": "nature/clue-18",
    "label": "Ich habe eine Mähne.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich habe eine Mähne.",
      "answer": "lion",
      "choices": [
        "lion",
        "sheep",
        "snail"
      ]
    }
  },
  {
    "id": "nature/clue-19",
    "label": "Mein Fell ist schwarz-weiss gestreift.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein Fell ist schwarz-weiss gestreift.",
      "answer": "zebra",
      "choices": [
        "zebra",
        "dog",
        "bee"
      ]
    }
  },
  {
    "id": "nature/clue-20",
    "label": "Auf dem Rücken habe ich Höcker.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Auf dem Rücken habe ich Höcker.",
      "answer": "camel",
      "choices": [
        "camel",
        "cat",
        "spider"
      ]
    }
  },
  {
    "id": "nature/clue-21",
    "label": "Mein orangefarbenes Fell hat schwarze Streifen.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein orangefarbenes Fell hat schwarze Streifen.",
      "answer": "tiger",
      "choices": [
        "tiger",
        "cow",
        "snail"
      ]
    }
  },
  {
    "id": "nature/clue-22",
    "label": "Ich bin ein Vogel, der schwimmt und taucht.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Ich bin ein Vogel, der schwimmt und taucht.",
      "answer": "penguin",
      "choices": [
        "penguin",
        "bird",
        "butterfly"
      ]
    }
  },
  {
    "id": "nature/clue-23",
    "label": "Mein Gesicht hat schwarze und weisse Streifen.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mein Gesicht hat schwarze und weisse Streifen.",
      "answer": "badger",
      "choices": [
        "badger",
        "pig",
        "fish"
      ]
    }
  },
  {
    "id": "nature/clue-24",
    "label": "Mit Ästen baue ich einen Damm.",
    "question": {
      "kind": "reading",
      "prompt": "",
      "text": "Mit Ästen baue ich einen Damm.",
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
