# Naturdetektive

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `nature`
- Host: bird
- Related competence: **D.2.B.1.b; NMG.2.4.a** — Naturhinweise lesend verstehen
- Difficulty: 25 Rätsel; zwei kurze Merkmale
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
| `nature/clue-0` | Ich trage Stacheln. Im Laub schlafe ich. — Ich trage Stacheln. Im Laub schlafe ich. | "hedgehog" |
| `nature/clue-1` | Ich habe Flossen. Im Wasser schwimme ich. — Ich habe Flossen. Im Wasser schwimme ich. | "fish" |
| `nature/clue-2` | Ich bin oft grün. Am Teich quake ich. — Ich bin oft grün. Am Teich quake ich. | "frog" |
| `nature/clue-3` | Ich habe sechs Beine. Aus Nektar mache ich Honig. — Ich habe sechs Beine. Aus Nektar mache ich Honig. | "bee" |
| `nature/clue-4` | Ich belle. Meine Nase riecht sehr gut. — Ich belle. Meine Nase riecht sehr gut. | "dog" |
| `nature/clue-5` | Ich miaue. Meine Pfoten sind weich. — Ich miaue. Meine Pfoten sind weich. | "cat" |
| `nature/clue-6` | Ich bin gross. Meine Milch wird getrunken. — Ich bin gross. Meine Milch wird getrunken. | "cow" |
| `nature/clue-7` | Ich habe acht Beine. Ich baue ein Netz. — Ich habe acht Beine. Ich baue ein Netz. | "spider" |
| `nature/clue-8` | Ich krieche langsam. Mein Haus trage ich mit. — Ich krieche langsam. Mein Haus trage ich mit. | "snail" |
| `nature/clue-9` | Ich habe vier Beine. Mein Panzer schützt mich. — Ich habe vier Beine. Mein Panzer schützt mich. | "tortoise" |
| `nature/clue-10` | Ich habe lange Ohren. Ich hüpfe über die Wiese. — Ich habe lange Ohren. Ich hüpfe über die Wiese. | "rabbit" |
| `nature/clue-11` | Ich hatte als Raupe viele Beine. Nun habe ich bunte Flügel. — Ich hatte als Raupe viele Beine. Nun habe ich bunte Flügel. | "butterfly" |
| `nature/clue-12` | Ich habe Federn. Mein Nest ist im Baum. — Ich habe Federn. Mein Nest ist im Baum. | "bird" |
| `nature/clue-13` | Ich bin klein und rot. Mein Rücken hat schwarze Punkte. — Ich bin klein und rot. Mein Rücken hat schwarze Punkte. | "ladybird" |
| `nature/clue-14` | Ich trage Wolle. Auf der Weide blöke ich. — Ich trage Wolle. Auf der Weide blöke ich. | "sheep" |
| `nature/clue-15` | Ich habe einen buschigen Schwanz. Ich sammle Nüsse. — Ich habe einen buschigen Schwanz. Ich sammle Nüsse. | "squirrel" |
| `nature/clue-16` | Ich bin sehr gross. Mit dem Rüssel trinke ich. — Ich bin sehr gross. Mit dem Rüssel trinke ich. | "elephant" |
| `nature/clue-17` | Mein Hals ist sehr lang. Ich erreiche hohe Blätter. — Mein Hals ist sehr lang. Ich erreiche hohe Blätter. | "giraffe" |
| `nature/clue-18` | Ich bin eine grosse Katze. Das Männchen trägt eine Mähne. — Ich bin eine grosse Katze. Das Männchen trägt eine Mähne. | "lion" |
| `nature/clue-19` | Ich sehe einem Pferd ähnlich. Mein Fell ist schwarz-weiss gestreift. — Ich sehe einem Pferd ähnlich. Mein Fell ist schwarz-weiss gestreift. | "zebra" |
| `nature/clue-20` | Ich kann lange ohne Wasser auskommen. Auf dem Rücken habe ich Höcker. — Ich kann lange ohne Wasser auskommen. Auf dem Rücken habe ich Höcker. | "camel" |
| `nature/clue-21` | Ich bin eine grosse Katze. Mein orangefarbenes Fell hat schwarze Streifen. — Ich bin eine grosse Katze. Mein orangefarbenes Fell hat schwarze Streifen. | "tiger" |
| `nature/clue-22` | Ich bin ein Vogel. Ich kann gut schwimmen, aber nicht fliegen. — Ich bin ein Vogel. Ich kann gut schwimmen, aber nicht fliegen. | "penguin" |
| `nature/clue-23` | Ich grabe einen Bau in der Erde. Mein Gesicht hat schwarze und weisse Streifen. — Ich grabe einen Bau in der Erde. Mein Gesicht hat schwarze und weisse Streifen. | "badger" |
| `nature/clue-24` | Meine Zähne fällen Bäume. Mit Ästen baue ich einen Damm. — Meine Zähne fällen Bäume. Mit Ästen baue ich einen Damm. | "beaver" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "nature/clue-0",
    "label": "Ich trage Stacheln. Im Laub schlafe ich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich trage Stacheln. Im Laub schlafe ich.",
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
    "label": "Ich habe Flossen. Im Wasser schwimme ich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe Flossen. Im Wasser schwimme ich.",
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
    "label": "Ich bin oft grün. Am Teich quake ich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin oft grün. Am Teich quake ich.",
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
    "label": "Ich habe sechs Beine. Aus Nektar mache ich Honig.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe sechs Beine. Aus Nektar mache ich Honig.",
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
    "label": "Ich belle. Meine Nase riecht sehr gut.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich belle. Meine Nase riecht sehr gut.",
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
    "label": "Ich miaue. Meine Pfoten sind weich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich miaue. Meine Pfoten sind weich.",
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
    "label": "Ich bin gross. Meine Milch wird getrunken.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin gross. Meine Milch wird getrunken.",
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
    "label": "Ich habe acht Beine. Ich baue ein Netz.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe acht Beine. Ich baue ein Netz.",
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
    "label": "Ich krieche langsam. Mein Haus trage ich mit.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich krieche langsam. Mein Haus trage ich mit.",
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
    "label": "Ich habe vier Beine. Mein Panzer schützt mich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe vier Beine. Mein Panzer schützt mich.",
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
    "label": "Ich habe lange Ohren. Ich hüpfe über die Wiese.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe lange Ohren. Ich hüpfe über die Wiese.",
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
    "label": "Ich hatte als Raupe viele Beine. Nun habe ich bunte Flügel.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich hatte als Raupe viele Beine. Nun habe ich bunte Flügel.",
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
    "label": "Ich habe Federn. Mein Nest ist im Baum.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe Federn. Mein Nest ist im Baum.",
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
    "label": "Ich bin klein und rot. Mein Rücken hat schwarze Punkte.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin klein und rot. Mein Rücken hat schwarze Punkte.",
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
    "label": "Ich trage Wolle. Auf der Weide blöke ich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich trage Wolle. Auf der Weide blöke ich.",
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
    "label": "Ich habe einen buschigen Schwanz. Ich sammle Nüsse.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich habe einen buschigen Schwanz. Ich sammle Nüsse.",
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
    "label": "Ich bin sehr gross. Mit dem Rüssel trinke ich.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin sehr gross. Mit dem Rüssel trinke ich.",
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
    "label": "Mein Hals ist sehr lang. Ich erreiche hohe Blätter.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Mein Hals ist sehr lang. Ich erreiche hohe Blätter.",
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
    "label": "Ich bin eine grosse Katze. Das Männchen trägt eine Mähne.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin eine grosse Katze. Das Männchen trägt eine Mähne.",
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
    "label": "Ich sehe einem Pferd ähnlich. Mein Fell ist schwarz-weiss gestreift.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich sehe einem Pferd ähnlich. Mein Fell ist schwarz-weiss gestreift.",
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
    "label": "Ich kann lange ohne Wasser auskommen. Auf dem Rücken habe ich Höcker.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich kann lange ohne Wasser auskommen. Auf dem Rücken habe ich Höcker.",
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
    "label": "Ich bin eine grosse Katze. Mein orangefarbenes Fell hat schwarze Streifen.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin eine grosse Katze. Mein orangefarbenes Fell hat schwarze Streifen.",
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
    "label": "Ich bin ein Vogel. Ich kann gut schwimmen, aber nicht fliegen.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich bin ein Vogel. Ich kann gut schwimmen, aber nicht fliegen.",
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
    "label": "Ich grabe einen Bau in der Erde. Mein Gesicht hat schwarze und weisse Streifen.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Ich grabe einen Bau in der Erde. Mein Gesicht hat schwarze und weisse Streifen.",
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
    "label": "Meine Zähne fällen Bäume. Mit Ästen baue ich einen Damm.",
    "question": {
      "kind": "reading",
      "prompt": "Welches Tier passt?",
      "text": "Meine Zähne fällen Bäume. Mit Ästen baue ich einen Damm.",
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
