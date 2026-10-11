#!/usr/bin/env node
'use strict';

const fs = require('fs');
const json5 = require('json5');
const onml = require('onml');

const pkg = require('../package.json');
const lib = require('../lib');
const def = require('../skins/default.js');
const narrow = require('../skins/narrow.js');
const lowkey = require('../skins/lowkey.js');

const skins = Object.assign({}, def, narrow, lowkey);

const argv = {
    input: undefined,
    indent: undefined,
    embedded: false
};

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-i' || arg === '--input') {
        argv.input = args[++i];
    } else if (arg === '-t' || arg === '--indent') {
        argv.indent = args[++i];
    } else if (arg === '-e' || arg === '--embedded') {
        argv.embedded = true;
    } else if (arg === '-h' || arg === '--help') {
        console.log('Usage: wavedrom --input <path> [--indent <indent>] [--embedded]');
        console.log('  <path>      WaveJSON source, or an SVG / PNG with embedded WaveJSON source');
        console.log('  --embedded  embed the WaveJSON source into the generated SVG');
        process.exit(0);
    } else if (arg === '-v' || arg === '--version') {
        console.log(pkg.version);
        process.exit(0);
    }
    // TODO: --skin / -s: Allowing users to specify the skin via CLI (rather than just inside the JSON) is very helpful.
}

if (!argv.input) {
    console.error('Error: --input <path> is required');
    process.exit(1);
}

const fileName = argv.input;
fs.readFile(fileName, (err, body) => {
if (err) { throw err; }
const text = lib.embedSource.extract(body);
if (text === undefined) {
    console.error('Error: no embedded WaveJSON source found in ' + fileName);
    process.exit(1);
}
const source = json5.parse(text);
const res = lib.renderAny(0, source, skins);
let svg = onml.stringify(res, argv.indent);
if (argv.embedded) {
    if (res[0] !== 'svg') {
        console.error('Error: nothing to embed, the source did not render an SVG');
        process.exit(1);
    }
    svg = lib.embedSource.embedSvg(svg, text);
}
console.log(svg);
});
/* eslint no-console: 0 */
