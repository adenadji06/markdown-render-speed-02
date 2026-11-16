// Driver for the markdown-render-speed-02 entry.
//
// The harness runs `node /bot/main.ts` (Node 22, erasable TypeScript
// only, no dependencies, no network). It reads every case from
// /input/cases.json, renders each case on its own with parse() from
// parse.js, and writes the HTML strings, in the cases' order, to
// /output/html.json.
//
// The run is deterministic: parse() keeps no state between cases, so
// the same input always produces the same output file, byte for byte.
// Outside a container, MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /input and /output.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(
  readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8'),
) as { id: string; markdown: string }[];

const html = new Array<string>(cases.length);
const count = cases.length;
// One parse per case, in order, each on its own: parse() keeps no state
// between cases, so no case's output can depend on any earlier case.
for (let i = 0; i < count; i++) {
  html[i] = parse(cases[i].markdown);
}
writeFileSync(join(OUTPUT_DIR, 'html.json'), JSON.stringify(html));
