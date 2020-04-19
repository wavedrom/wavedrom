#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');

const t = new Date();

console.log([
    '/*!',
    pkg.name, pkg.version,
    ['FullYear', 'Month', 'Date']
        .map(e => t['get' + e]())
        .join('-'),
    '*/'
].join(' '));
