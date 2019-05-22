#!/usr/bin/env node
'use strict';

var fs = require('fs-extra');
var json5 = require('json5');
var yargs = require('yargs');
var onml = require('onml');

var lib = require('../lib');
var def = require('../skins/default.js');
var narrow = require('../skins/narrow.js');
var lowkey = require('../skins/lowkey.js');

var skins = Object.assign({}, def, narrow, lowkey);

var argv = yargs
    .option('input', {describe: 'path to the source', alias: 'i'})
    .demandOption(['input'])
    .help()
    .argv;

var fileName;

fileName = argv.input;
fs.readFile(fileName, function (err, body) {
    var source = json5.parse(body);
    var res = lib.renderAny(0, source, skins);
    var svg = onml.s(res);
    console.log(svg);
});

/* eslint no-console: 0 */
