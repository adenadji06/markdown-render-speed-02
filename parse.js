// A fast drop-in for marked 18.1.3.
//
// The parser is the fork vendored under vendor/marked/marked.esm.js
// (marked's MIT-licensed build, tuned in place; see
// vendor/marked/LICENSE and vendor/marked/NOTICE).
//
// marked.parse() constructs a new Lexer, Tokenizer, Parser and Renderer
// on every call and spreads the options object twice. Under marked's
// default options none of that per-call state holds anything from one
// parse to the next: the Lexer, Tokenizer and Parser keep no information
// between parses except the tokens of the parse currently running. So
// this module holds a single Lexer/Parser pair for the life of the
// process and, ahead of each parse, restores precisely the state a
// freshly built Lexer begins with.
//
// Nothing carries over from one call to the next: parse(markdown)
// returns the same string for a case parsed on its own as for the same
// case parsed after any other case. No caching, no memoisation across
// cases.
import { Lexer, Parser, getDefaults } from './vendor/marked/marked.esm.js';

const options = getDefaults();
const lexer = new Lexer(options);
const parser = new Parser(options);

/** The HTML marked 18.1.3 renders for `markdown`, under marked's defaults. */
export function parse(markdown) {
  // State of a fresh Lexer: no tokens yet, an empty link table, an
  // empty inline queue, and the default lexer flags.
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
