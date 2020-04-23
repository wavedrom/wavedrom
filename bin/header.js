#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');

const t = new Date();

process.stdin.setEncoding('utf8');

process.stdout.write([
    '/*!',
    pkg.name, pkg.version,
    [t.getFullYear(), t.getMonth() + 1, t.getDate()]
        .join('-'),
    'PDT',
    '*/\n'
].join(' '));

process.stdin.pipe(process.stdout);
