// Driver for the markdown-render-speed-02 entry. It reads every case
// from /input/cases.json, renders each one alone with parse() from
// parse.js, and writes the HTML strings, in the cases' order, to
// /output/html.json. Run as `node /bot/main.ts` on Node 22 (erasable
// TypeScript only, no dependencies, no network). The run is fully
// deterministic: the same input always produces the same output file,
// byte for byte, because parse() keeps no state between cases.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(
  readFileSync(join(INPUT_DIR, 'cases.json'), 'utf8'),
) as { id: string; markdown: string }[];

const html = new Array<string>(cases.length);
for (let i = 0; i < cases.length; i++) {
  html[i] = parse(cases[i].markdown);
}
writeFileSync(join(OUTPUT_DIR, 'html.json'), JSON.stringify(html));
