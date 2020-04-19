#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');

const t = new Date();

process.stdin.setEncoding('utf8');

process.stdout.write([
    '/*!',
    pkg.name, pkg.version,
    ['FullYear', 'Month', 'Date']
        .map(e => t['get' + e]())
        .join('-'),
    '*/\n'
].join(' '));

process.stdin.pipe(process.stdout);
