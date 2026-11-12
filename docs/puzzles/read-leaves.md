# Silbenblätter

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `read-leaves`
- Host: mouse
- Related competence: **D.2.A.1.b (Übung)** — Silben visuell unterscheiden
- Difficulty: 32 Silben: m/l/s/n/r/f/t/p mit a/i/o/u
- Pool: 32 explicit iterations; a round selects five.
- Review: every iteration plus the puzzle checklist must be approved for this exact revision. New/changed items or difficulty require review again.

## Mapping to the blueprint

| Contract | Implementation |
| --- | --- |
| Drawn pictures | Existing woodland sheets; SVG for geometry and tracing |
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
| `read-leaves/ma` | ma — ma | "ma" |
| `read-leaves/mi` | mi — mi | "mi" |
| `read-leaves/mo` | mo — mo | "mo" |
| `read-leaves/mu` | mu — mu | "mu" |
| `read-leaves/la` | la — la | "la" |
| `read-leaves/li` | li — li | "li" |
| `read-leaves/lo` | lo — lo | "lo" |
| `read-leaves/lu` | lu — lu | "lu" |
| `read-leaves/sa` | sa — sa | "sa" |
| `read-leaves/si` | si — si | "si" |
| `read-leaves/so` | so — so | "so" |
| `read-leaves/su` | su — su | "su" |
| `read-leaves/na` | na — na | "na" |
| `read-leaves/ni` | ni — ni | "ni" |
| `read-leaves/no` | no — no | "no" |
| `read-leaves/nu` | nu — nu | "nu" |
| `read-leaves/ra` | ra — ra | "ra" |
| `read-leaves/ri` | ri — ri | "ri" |
| `read-leaves/ro` | ro — ro | "ro" |
| `read-leaves/ru` | ru — ru | "ru" |
| `read-leaves/fa` | fa — fa | "fa" |
| `read-leaves/fi` | fi — fi | "fi" |
| `read-leaves/fo` | fo — fo | "fo" |
| `read-leaves/fu` | fu — fu | "fu" |
| `read-leaves/ta` | ta — ta | "ta" |
| `read-leaves/ti` | ti — ti | "ti" |
| `read-leaves/to` | to — to | "to" |
| `read-leaves/tu` | tu — tu | "tu" |
| `read-leaves/pa` | pa — pa | "pa" |
| `read-leaves/pi` | pi — pi | "pi" |
| `read-leaves/po` | po — po | "po" |
| `read-leaves/pu` | pu — pu | "pu" |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "read-leaves/ma",
    "label": "ma",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ma",
      "answer": "ma",
      "choices": [
        "ma",
        "mi",
        "mo",
        "mu"
      ]
    }
  },
  {
    "id": "read-leaves/mi",
    "label": "mi",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "mi",
      "answer": "mi",
      "choices": [
        "mi",
        "ma",
        "mo",
        "mu"
      ]
    }
  },
  {
    "id": "read-leaves/mo",
    "label": "mo",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "mo",
      "answer": "mo",
      "choices": [
        "mo",
        "ma",
        "mi",
        "mu"
      ]
    }
  },
  {
    "id": "read-leaves/mu",
    "label": "mu",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "mu",
      "answer": "mu",
      "choices": [
        "mu",
        "ma",
        "mi",
        "mo"
      ]
    }
  },
  {
    "id": "read-leaves/la",
    "label": "la",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "la",
      "answer": "la",
      "choices": [
        "la",
        "li",
        "lo",
        "lu"
      ]
    }
  },
  {
    "id": "read-leaves/li",
    "label": "li",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "li",
      "answer": "li",
      "choices": [
        "li",
        "la",
        "lo",
        "lu"
      ]
    }
  },
  {
    "id": "read-leaves/lo",
    "label": "lo",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "lo",
      "answer": "lo",
      "choices": [
        "lo",
        "la",
        "li",
        "lu"
      ]
    }
  },
  {
    "id": "read-leaves/lu",
    "label": "lu",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "lu",
      "answer": "lu",
      "choices": [
        "lu",
        "la",
        "li",
        "lo"
      ]
    }
  },
  {
    "id": "read-leaves/sa",
    "label": "sa",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "sa",
      "answer": "sa",
      "choices": [
        "sa",
        "si",
        "so",
        "su"
      ]
    }
  },
  {
    "id": "read-leaves/si",
    "label": "si",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "si",
      "answer": "si",
      "choices": [
        "si",
        "sa",
        "so",
        "su"
      ]
    }
  },
  {
    "id": "read-leaves/so",
    "label": "so",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "so",
      "answer": "so",
      "choices": [
        "so",
        "sa",
        "si",
        "su"
      ]
    }
  },
  {
    "id": "read-leaves/su",
    "label": "su",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "su",
      "answer": "su",
      "choices": [
        "su",
        "sa",
        "si",
        "so"
      ]
    }
  },
  {
    "id": "read-leaves/na",
    "label": "na",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "na",
      "answer": "na",
      "choices": [
        "na",
        "ni",
        "no",
        "nu"
      ]
    }
  },
  {
    "id": "read-leaves/ni",
    "label": "ni",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ni",
      "answer": "ni",
      "choices": [
        "ni",
        "na",
        "no",
        "nu"
      ]
    }
  },
  {
    "id": "read-leaves/no",
    "label": "no",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "no",
      "answer": "no",
      "choices": [
        "no",
        "na",
        "ni",
        "nu"
      ]
    }
  },
  {
    "id": "read-leaves/nu",
    "label": "nu",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "nu",
      "answer": "nu",
      "choices": [
        "nu",
        "na",
        "ni",
        "no"
      ]
    }
  },
  {
    "id": "read-leaves/ra",
    "label": "ra",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ra",
      "answer": "ra",
      "choices": [
        "ra",
        "ri",
        "ro",
        "ru"
      ]
    }
  },
  {
    "id": "read-leaves/ri",
    "label": "ri",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ri",
      "answer": "ri",
      "choices": [
        "ri",
        "ra",
        "ro",
        "ru"
      ]
    }
  },
  {
    "id": "read-leaves/ro",
    "label": "ro",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ro",
      "answer": "ro",
      "choices": [
        "ro",
        "ra",
        "ri",
        "ru"
      ]
    }
  },
  {
    "id": "read-leaves/ru",
    "label": "ru",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ru",
      "answer": "ru",
      "choices": [
        "ru",
        "ra",
        "ri",
        "ro"
      ]
    }
  },
  {
    "id": "read-leaves/fa",
    "label": "fa",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "fa",
      "answer": "fa",
      "choices": [
        "fa",
        "fi",
        "fo",
        "fu"
      ]
    }
  },
  {
    "id": "read-leaves/fi",
    "label": "fi",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "fi",
      "answer": "fi",
      "choices": [
        "fi",
        "fa",
        "fo",
        "fu"
      ]
    }
  },
  {
    "id": "read-leaves/fo",
    "label": "fo",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "fo",
      "answer": "fo",
      "choices": [
        "fo",
        "fa",
        "fi",
        "fu"
      ]
    }
  },
  {
    "id": "read-leaves/fu",
    "label": "fu",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "fu",
      "answer": "fu",
      "choices": [
        "fu",
        "fa",
        "fi",
        "fo"
      ]
    }
  },
  {
    "id": "read-leaves/ta",
    "label": "ta",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ta",
      "answer": "ta",
      "choices": [
        "ta",
        "ti",
        "to",
        "tu"
      ]
    }
  },
  {
    "id": "read-leaves/ti",
    "label": "ti",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "ti",
      "answer": "ti",
      "choices": [
        "ti",
        "ta",
        "to",
        "tu"
      ]
    }
  },
  {
    "id": "read-leaves/to",
    "label": "to",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "to",
      "answer": "to",
      "choices": [
        "to",
        "ta",
        "ti",
        "tu"
      ]
    }
  },
  {
    "id": "read-leaves/tu",
    "label": "tu",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "tu",
      "answer": "tu",
      "choices": [
        "tu",
        "ta",
        "ti",
        "to"
      ]
    }
  },
  {
    "id": "read-leaves/pa",
    "label": "pa",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "pa",
      "answer": "pa",
      "choices": [
        "pa",
        "pi",
        "po",
        "pu"
      ]
    }
  },
  {
    "id": "read-leaves/pi",
    "label": "pi",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "pi",
      "answer": "pi",
      "choices": [
        "pi",
        "pa",
        "po",
        "pu"
      ]
    }
  },
  {
    "id": "read-leaves/po",
    "label": "po",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "po",
      "answer": "po",
      "choices": [
        "po",
        "pa",
        "pi",
        "pu"
      ]
    }
  },
  {
    "id": "read-leaves/pu",
    "label": "pu",
    "question": {
      "kind": "leaves",
      "prompt": "Finde dieselbe Silbe auf einem Blatt.",
      "text": "pu",
      "answer": "pu",
      "choices": [
        "pu",
        "pa",
        "pi",
        "po"
      ]
    }
  }
]
```
