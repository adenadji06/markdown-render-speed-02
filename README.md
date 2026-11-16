[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/adenadji06/markdown-render-speed-02/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/adenadji06/markdown-render-speed-02/reward.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)

# markdown-render-speed-02 entry

A drop-in replacement for marked 18.1.3 that is faster yet renders the
exact same HTML under marked's defaults. It clears all 720 practice
cases while beating marked's own time.

How it works:

- `main.ts` drives the harness: it reads `/input/cases.json` and writes
  the rendered strings, in order, to `/output/html.json`.
- `parse.js` exports `parse(markdown)`. Rather than constructing a fresh
  Lexer, Tokenizer, Parser and Renderer on every call the way
  `marked.parse` does, it keeps a single Lexer/Parser pair alive for the
  whole run and only resets the per-parse state. That strips out a big
  share of the per-call overhead.
- `vendor/marked/marked.esm.js` is a fork of marked 18.1.3 (MIT; see
  `vendor/marked/NOTICE`) with the hot paths tuned:
  - `lex()` skips the carriage-return normalisation when the input has
    no carriage return at all.
  - The emphasis/strong closer search walks backwards from the last
    delimiter run instead of scanning forward over the entire string.
  - The inline masking pass skips its punctuation and block-skip
    replacements unless a trigger character (backtick, `(`, `[`, `<`)
    shows up.
  - The list tokenizer finds first lines with `indexOf`, finds the
    first non-space character directly, and only runs block-start
    checks on lines that might actually open a block.

No memoisation, no cache shared across cases: every call computes its
answer from the markdown it is given and nothing else, so the same
input always yields byte-identical output.
