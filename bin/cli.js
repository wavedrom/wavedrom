#!/usr/bin/env node
'use strict';

const fs = require('fs');
const json5 = require('json5');
const onml = require('onml');

const pkg = require('../package.json');
const lib = require('../lib');
const def = require('../skins/default.js');
const narrow = require('../skins/narrow.js');
const narrower = require('../skins/narrower.js');
const narrowerer = require('../skins/narrowerer.js');
const lowkey = require('../skins/lowkey.js');
const dark = require('../skins/dark.js');
const bw = require('../skins/bw.js');
const bw_narrow = require('../skins/bw_narrow.js');//TODO: Add skins here

const skins = Object.assign({}, def, narrow, narrower, narrowerer, lowkey, dark, bw, bw_narrow);

const argv = {
    input: undefined,
    indent: undefined
};

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-i' || arg === '--input') {
        argv.input = args[++i];
    } else if (arg === '-t' || arg === '--indent') {
        argv.indent = args[++i];
    } else if (arg === '-h' || arg === '--help') {
        console.log('Usage: wavedrom --input <path> [--indent <indent>]');
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
const source = json5.parse(body);
const res = lib.renderAny(0, source, skins);
const svg = onml.stringify(res, argv.indent);
console.log(svg);
});
/* eslint no-console: 0 */
