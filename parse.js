// Fast drop-in for marked 18.1.3 (the parser itself lives in
// vendor/marked/marked.esm.js, a fork of marked's MIT-licensed build — see
// vendor/marked/LICENSE and vendor/marked/NOTICE for its copyright).
// This module reuses one Lexer/Parser pair across calls and resets only the
// per-parse state, so repeated parses skip the per-call construction that
// marked.parse performs (fresh Lexer, Tokenizer, Parser and option spreads
// on every call). parse() returns exactly what marked.parse returns for
// every input: the shared Lexer is reset to a fresh Lexer's state before
// each parse, and no result or state is kept between calls.
import { Lexer, Parser, getDefaults } from './vendor/marked/marked.esm.js';

const options = getDefaults();
const lexer = new Lexer(options);
const parser = new Parser(options);

/** The HTML marked 18.1.3 renders for `markdown`, with marked's defaults. */
export function parse(markdown) {
  lexer.tokens = [];
  lexer.tokens.links = Object.create(null);
  lexer.inlineQueue = [];
  lexer.state.inLink = false;
  lexer.state.inRawBlock = false;
  lexer.state.linkEmitted = false;
  lexer.state.linkParenPossible = true;
  lexer.state.top = true;
  return parser.parse(lexer.lex(markdown));
}
