// Driver for the markdown-render-speed-02 entry.
//
// The harness executes `node /bot/main.ts` on Node 22 (erasable
// TypeScript only, no dependencies, no network). It loads every case
// from /input/cases.json, renders each one on its own through parse()
// from parse.js, and writes the resulting HTML strings, in the cases'
// order, to /output/html.json.
//
// A run is deterministic: parse() carries no state from one case to the
// next, so the same input always yields the same output file, byte for
// byte. The output is a JSON array of 720 strings, one per case, in the
// same order as the input. When run outside a container,
// MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR take the place of /input and
// /output.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(
  readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8'),
) as { id: string; markdown: string }[];

const html = new Array<string>(cases.length);
const total = cases.length;
// Render one case at a time, in order. parse() keeps nothing between
// cases, so no case's output can depend on any earlier case.
for (let i = 0; i < total; i++) {
  html[i] = parse(cases[i].markdown);
}
writeFileSync(join(OUTPUT_DIR, 'html.json'), JSON.stringify(html));
