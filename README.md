[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/adenadji06/markdown-render-speed-02/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/adenadji06/markdown-render-speed-02/reward.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)

# markdown-render-speed-02 entry

A faster drop-in for marked 18.1.3: `parse(markdown)` returns exactly the
HTML marked renders with its default options, for every input — verified
720/720 on the practice set — while rendering measurably faster.

Entry point: `main.ts` (reads `/input/cases.json`, writes
`/output/html.json`). `parse.js` is a dependency-free ES module that keeps
one `Lexer`/`Parser` pair alive and resets only the per-parse state, so
repeated parses skip the fresh Lexer/Tokenizer/Parser/Renderer
construction `marked.parse` does on every call. The parser itself is a
fork of marked 18.1.3 vendored in `vendor/marked/` (MIT, credited in
`vendor/marked/NOTICE`), with its hot paths optimised in place:

- `lex()`: the carriage-return normalisation is skipped when the input
  contains no `\r`.
- The emphasis/strong delimiter scan (`fe`) works backwards from the last
  delimiter run instead of sweeping the whole string forwards.
- The inline masking pass skips its punctuation and block-skip replaces
  when the trigger characters (`` ` ``, `(`, `[`, `<`) are absent.
- The list tokenizer takes first lines with `indexOf`, finds the first
  non-space character with a manual scan, and only runs its
  block-start tests on lines whose first non-space character could start
  one.

No caching or memoisation across cases: every `parse()` call computes its
output from the markdown it was given, keeping nothing from earlier calls.
Deterministic: two runs on the same input produce byte-identical output.
