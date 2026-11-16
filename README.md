[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/adenadji06/markdown-render-speed-02/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/adenadji06/markdown-render-speed-02/reward.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)

# markdown-render-speed-02 entry

A quicker replacement for marked 18.1.3 that renders byte-for-byte the
same HTML marked does under its defaults. It passes all 720 practice
cases, and it does so faster than marked itself.

How it works:

- `main.ts` is the harness driver: it loads `/input/cases.json` and
  writes the rendered strings, in order, to `/output/html.json`.
- `parse.js` exports the `parse(markdown)` function. Instead of building
  a new Lexer, Tokenizer, Parser and Renderer for every call the way
  `marked.parse` does, it holds on to one Lexer/Parser pair for the
  whole process and only resets the state that belongs to a single
  parse. That alone removes a large chunk of per-call work.
- `vendor/marked/marked.esm.js` is a fork of marked 18.1.3 (MIT; see
  `vendor/marked/NOTICE`) with the hottest code paths tuned:
  - `lex()` leaves the input alone when it holds no carriage return,
    rather than running the normalisation replace every time.
  - The emphasis/strong closer scan searches backwards from the final
    delimiter run instead of sweeping forward across the whole string.
  - The inline masking step skips its punctuation and block-skip
    substitutions unless one of the trigger characters (backtick,
    `(`, `[`, `<`) is actually present.
  - The list tokenizer grabs first lines with `indexOf`, locates the
    first non-space character by hand, and only runs its block-start
    checks on lines that could plausibly open a block.

There is no memoisation and no cache shared between cases: each call
computes its result from the markdown it receives and nothing else, so
running the same input twice gives byte-identical output.
