// Fast drop-in for marked 18.1.3. The parser itself is the vendored fork
// in vendor/marked/marked.esm.js (marked's MIT-licensed build, optimised
// in place; see vendor/marked/LICENSE and vendor/marked/NOTICE).
//
// marked.parse builds a fresh Lexer, Tokenizer, Parser and Renderer on
// every call, and spreads the options object twice. None of that state is
// needed per call: with marked's default options the Lexer, Tokenizer and
// Parser hold no information between parses except the tokens of the parse
// in progress. So this module keeps a single Lexer/Parser pair for the
// lifetime of the process and restores the exact state a brand-new Lexer
// starts with before each parse. Nothing is kept from one call to the
// next: parse(markdown) returns the same string for a case parsed alone
// as for the same case parsed after any other case.
import { Lexer, Parser, getDefaults } from './vendor/marked/marked.esm.js';

const options = getDefaults();
const lexer = new Lexer(options);
const parser = new Parser(options);

/** The HTML marked 18.1.3 renders for `markdown`, with marked's defaults. */
export function parse(markdown) {
  // Fresh-Lexer state: an empty token list with an empty link table, an
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
