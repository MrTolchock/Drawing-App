# Schreibspuren

[All puzzles](../PUZZLE-CATALOGUE.md) · [Shared blueprint](../PUZZLE-BLUEPRINT.md)

- Stable puzzle ID: `trace`
- Host: mouse
- Related competence: **D.4.A.1.c** — Buchstabenformen nachfahren
- Difficulty: A–Z und ÄÖÜ, gross und klein; 58 Formen; keine Handschriftbeurteilung
- Pool: 58 explicit iterations; a round selects five.
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
| `trace/letter-A` | A — Nachfahren: A | A |
| `trace/letter-B` | B — Nachfahren: B | B |
| `trace/letter-C` | C — Nachfahren: C | C |
| `trace/letter-D` | D — Nachfahren: D | D |
| `trace/letter-E` | E — Nachfahren: E | E |
| `trace/letter-F` | F — Nachfahren: F | F |
| `trace/letter-G` | G — Nachfahren: G | G |
| `trace/letter-H` | H — Nachfahren: H | H |
| `trace/letter-I` | I — Nachfahren: I | I |
| `trace/letter-J` | J — Nachfahren: J | J |
| `trace/letter-K` | K — Nachfahren: K | K |
| `trace/letter-L` | L — Nachfahren: L | L |
| `trace/letter-M` | M — Nachfahren: M | M |
| `trace/letter-N` | N — Nachfahren: N | N |
| `trace/letter-O` | O — Nachfahren: O | O |
| `trace/letter-P` | P — Nachfahren: P | P |
| `trace/letter-Q` | Q — Nachfahren: Q | Q |
| `trace/letter-R` | R — Nachfahren: R | R |
| `trace/letter-S` | S — Nachfahren: S | S |
| `trace/letter-T` | T — Nachfahren: T | T |
| `trace/letter-U` | U — Nachfahren: U | U |
| `trace/letter-V` | V — Nachfahren: V | V |
| `trace/letter-W` | W — Nachfahren: W | W |
| `trace/letter-X` | X — Nachfahren: X | X |
| `trace/letter-Y` | Y — Nachfahren: Y | Y |
| `trace/letter-Z` | Z — Nachfahren: Z | Z |
| `trace/letter-Ä` | Ä — Nachfahren: Ä | Ä |
| `trace/letter-Ö` | Ö — Nachfahren: Ö | Ö |
| `trace/letter-Ü` | Ü — Nachfahren: Ü | Ü |
| `trace/letter-a` | a — Nachfahren: a | a |
| `trace/letter-b` | b — Nachfahren: b | b |
| `trace/letter-c` | c — Nachfahren: c | c |
| `trace/letter-d` | d — Nachfahren: d | d |
| `trace/letter-e` | e — Nachfahren: e | e |
| `trace/letter-f` | f — Nachfahren: f | f |
| `trace/letter-g` | g — Nachfahren: g | g |
| `trace/letter-h` | h — Nachfahren: h | h |
| `trace/letter-i` | i — Nachfahren: i | i |
| `trace/letter-j` | j — Nachfahren: j | j |
| `trace/letter-k` | k — Nachfahren: k | k |
| `trace/letter-l` | l — Nachfahren: l | l |
| `trace/letter-m` | m — Nachfahren: m | m |
| `trace/letter-n` | n — Nachfahren: n | n |
| `trace/letter-o` | o — Nachfahren: o | o |
| `trace/letter-p` | p — Nachfahren: p | p |
| `trace/letter-q` | q — Nachfahren: q | q |
| `trace/letter-r` | r — Nachfahren: r | r |
| `trace/letter-s` | s — Nachfahren: s | s |
| `trace/letter-t` | t — Nachfahren: t | t |
| `trace/letter-u` | u — Nachfahren: u | u |
| `trace/letter-v` | v — Nachfahren: v | v |
| `trace/letter-w` | w — Nachfahren: w | w |
| `trace/letter-x` | x — Nachfahren: x | x |
| `trace/letter-y` | y — Nachfahren: y | y |
| `trace/letter-z` | z — Nachfahren: z | z |
| `trace/letter-ä` | ä — Nachfahren: ä | ä |
| `trace/letter-ö` | ö — Nachfahren: ö | ö |
| `trace/letter-ü` | ü — Nachfahren: ü | ü |

## Exact definitions

These definitions are the same finite data used by the game and review previews. Answer order may be shuffled during play. Coordinates/cells are zero based. Construction parts are `[shape, x, y, width, height, rotation]`; holes identify the two parts to insert.

```json
[
  {
    "id": "trace/letter-A",
    "label": "A",
    "question": {
      "kind": "trace",
      "glyph": "A"
    }
  },
  {
    "id": "trace/letter-B",
    "label": "B",
    "question": {
      "kind": "trace",
      "glyph": "B"
    }
  },
  {
    "id": "trace/letter-C",
    "label": "C",
    "question": {
      "kind": "trace",
      "glyph": "C"
    }
  },
  {
    "id": "trace/letter-D",
    "label": "D",
    "question": {
      "kind": "trace",
      "glyph": "D"
    }
  },
  {
    "id": "trace/letter-E",
    "label": "E",
    "question": {
      "kind": "trace",
      "glyph": "E"
    }
  },
  {
    "id": "trace/letter-F",
    "label": "F",
    "question": {
      "kind": "trace",
      "glyph": "F"
    }
  },
  {
    "id": "trace/letter-G",
    "label": "G",
    "question": {
      "kind": "trace",
      "glyph": "G"
    }
  },
  {
    "id": "trace/letter-H",
    "label": "H",
    "question": {
      "kind": "trace",
      "glyph": "H"
    }
  },
  {
    "id": "trace/letter-I",
    "label": "I",
    "question": {
      "kind": "trace",
      "glyph": "I"
    }
  },
  {
    "id": "trace/letter-J",
    "label": "J",
    "question": {
      "kind": "trace",
      "glyph": "J"
    }
  },
  {
    "id": "trace/letter-K",
    "label": "K",
    "question": {
      "kind": "trace",
      "glyph": "K"
    }
  },
  {
    "id": "trace/letter-L",
    "label": "L",
    "question": {
      "kind": "trace",
      "glyph": "L"
    }
  },
  {
    "id": "trace/letter-M",
    "label": "M",
    "question": {
      "kind": "trace",
      "glyph": "M"
    }
  },
  {
    "id": "trace/letter-N",
    "label": "N",
    "question": {
      "kind": "trace",
      "glyph": "N"
    }
  },
  {
    "id": "trace/letter-O",
    "label": "O",
    "question": {
      "kind": "trace",
      "glyph": "O"
    }
  },
  {
    "id": "trace/letter-P",
    "label": "P",
    "question": {
      "kind": "trace",
      "glyph": "P"
    }
  },
  {
    "id": "trace/letter-Q",
    "label": "Q",
    "question": {
      "kind": "trace",
      "glyph": "Q"
    }
  },
  {
    "id": "trace/letter-R",
    "label": "R",
    "question": {
      "kind": "trace",
      "glyph": "R"
    }
  },
  {
    "id": "trace/letter-S",
    "label": "S",
    "question": {
      "kind": "trace",
      "glyph": "S"
    }
  },
  {
    "id": "trace/letter-T",
    "label": "T",
    "question": {
      "kind": "trace",
      "glyph": "T"
    }
  },
  {
    "id": "trace/letter-U",
    "label": "U",
    "question": {
      "kind": "trace",
      "glyph": "U"
    }
  },
  {
    "id": "trace/letter-V",
    "label": "V",
    "question": {
      "kind": "trace",
      "glyph": "V"
    }
  },
  {
    "id": "trace/letter-W",
    "label": "W",
    "question": {
      "kind": "trace",
      "glyph": "W"
    }
  },
  {
    "id": "trace/letter-X",
    "label": "X",
    "question": {
      "kind": "trace",
      "glyph": "X"
    }
  },
  {
    "id": "trace/letter-Y",
    "label": "Y",
    "question": {
      "kind": "trace",
      "glyph": "Y"
    }
  },
  {
    "id": "trace/letter-Z",
    "label": "Z",
    "question": {
      "kind": "trace",
      "glyph": "Z"
    }
  },
  {
    "id": "trace/letter-Ä",
    "label": "Ä",
    "question": {
      "kind": "trace",
      "glyph": "Ä"
    }
  },
  {
    "id": "trace/letter-Ö",
    "label": "Ö",
    "question": {
      "kind": "trace",
      "glyph": "Ö"
    }
  },
  {
    "id": "trace/letter-Ü",
    "label": "Ü",
    "question": {
      "kind": "trace",
      "glyph": "Ü"
    }
  },
  {
    "id": "trace/letter-a",
    "label": "a",
    "question": {
      "kind": "trace",
      "glyph": "a"
    }
  },
  {
    "id": "trace/letter-b",
    "label": "b",
    "question": {
      "kind": "trace",
      "glyph": "b"
    }
  },
  {
    "id": "trace/letter-c",
    "label": "c",
    "question": {
      "kind": "trace",
      "glyph": "c"
    }
  },
  {
    "id": "trace/letter-d",
    "label": "d",
    "question": {
      "kind": "trace",
      "glyph": "d"
    }
  },
  {
    "id": "trace/letter-e",
    "label": "e",
    "question": {
      "kind": "trace",
      "glyph": "e"
    }
  },
  {
    "id": "trace/letter-f",
    "label": "f",
    "question": {
      "kind": "trace",
      "glyph": "f"
    }
  },
  {
    "id": "trace/letter-g",
    "label": "g",
    "question": {
      "kind": "trace",
      "glyph": "g"
    }
  },
  {
    "id": "trace/letter-h",
    "label": "h",
    "question": {
      "kind": "trace",
      "glyph": "h"
    }
  },
  {
    "id": "trace/letter-i",
    "label": "i",
    "question": {
      "kind": "trace",
      "glyph": "i"
    }
  },
  {
    "id": "trace/letter-j",
    "label": "j",
    "question": {
      "kind": "trace",
      "glyph": "j"
    }
  },
  {
    "id": "trace/letter-k",
    "label": "k",
    "question": {
      "kind": "trace",
      "glyph": "k"
    }
  },
  {
    "id": "trace/letter-l",
    "label": "l",
    "question": {
      "kind": "trace",
      "glyph": "l"
    }
  },
  {
    "id": "trace/letter-m",
    "label": "m",
    "question": {
      "kind": "trace",
      "glyph": "m"
    }
  },
  {
    "id": "trace/letter-n",
    "label": "n",
    "question": {
      "kind": "trace",
      "glyph": "n"
    }
  },
  {
    "id": "trace/letter-o",
    "label": "o",
    "question": {
      "kind": "trace",
      "glyph": "o"
    }
  },
  {
    "id": "trace/letter-p",
    "label": "p",
    "question": {
      "kind": "trace",
      "glyph": "p"
    }
  },
  {
    "id": "trace/letter-q",
    "label": "q",
    "question": {
      "kind": "trace",
      "glyph": "q"
    }
  },
  {
    "id": "trace/letter-r",
    "label": "r",
    "question": {
      "kind": "trace",
      "glyph": "r"
    }
  },
  {
    "id": "trace/letter-s",
    "label": "s",
    "question": {
      "kind": "trace",
      "glyph": "s"
    }
  },
  {
    "id": "trace/letter-t",
    "label": "t",
    "question": {
      "kind": "trace",
      "glyph": "t"
    }
  },
  {
    "id": "trace/letter-u",
    "label": "u",
    "question": {
      "kind": "trace",
      "glyph": "u"
    }
  },
  {
    "id": "trace/letter-v",
    "label": "v",
    "question": {
      "kind": "trace",
      "glyph": "v"
    }
  },
  {
    "id": "trace/letter-w",
    "label": "w",
    "question": {
      "kind": "trace",
      "glyph": "w"
    }
  },
  {
    "id": "trace/letter-x",
    "label": "x",
    "question": {
      "kind": "trace",
      "glyph": "x"
    }
  },
  {
    "id": "trace/letter-y",
    "label": "y",
    "question": {
      "kind": "trace",
      "glyph": "y"
    }
  },
  {
    "id": "trace/letter-z",
    "label": "z",
    "question": {
      "kind": "trace",
      "glyph": "z"
    }
  },
  {
    "id": "trace/letter-ä",
    "label": "ä",
    "question": {
      "kind": "trace",
      "glyph": "ä"
    }
  },
  {
    "id": "trace/letter-ö",
    "label": "ö",
    "question": {
      "kind": "trace",
      "glyph": "ö"
    }
  },
  {
    "id": "trace/letter-ü",
    "label": "ü",
    "question": {
      "kind": "trace",
      "glyph": "ü"
    }
  }
]
```
