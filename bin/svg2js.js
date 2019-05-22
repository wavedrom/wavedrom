#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path = require('path'),
    onml = require('onml'),
    argv = require('yargs').argv;

var styles = {};

var marker1 = ['marker', {'id':'arrowhead', 'style':'fill:#0041c4', 'markerHeight':'7', 'markerWidth':'10', 'markerUnits':'strokeWidth', 'viewBox':'0 -4 11 8', 'refX':'15','refY':'0','orient':'auto'},
  ['path', {'d':'M0 -4 11 0 0 4z'}]
];

var marker2 = ['marker', {'id':'arrowtail', 'style':'fill:#0041c4', 'markerHeight':'7', 'markerWidth':'10', 'markerUnits':'strokeWidth', 'viewBox':'-11 -4 11 8', 'refX':'-15','refY':'0','orient':'auto'},
  ['path',{'d':'M0 -4 -11 0 0 4z'}]
];

var defs = ['defs'];
var style = ['style', { type: 'text/css' }];
var defStyle = 'text{font-size:11pt;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;fill-opacity:1;font-family:Helvetica}.muted{fill:#aaa}.warning{fill:#f6b900}.error{fill:#f60000}.info{fill:#0041c4}.success{fill:#00ab00}.h1{font-size:33pt;font-weight:bold}.h2{font-size:27pt;font-weight:bold}.h3{font-size:20pt;font-weight:bold}.h4{font-size:14pt;font-weight:bold}.h5{font-size:11pt;font-weight:bold}.h6{font-size:8pt;font-weight:bold}';

var res = ['svg',
    {
        id: 'svg',
        xmlns: 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        height: '0'
    },
    style,
    defs,
    ['g',{'id':'waves'},['g',{'id':'lanes'}],['g',{'id':'groups'}]]
];

function f2o (name, cb) {
    var full, ml;
    full = path.resolve(process.cwd(), name);
    fs.readFile(full, { encoding: 'utf8'}, function (err, dat) {
        if (err) { throw err; }
        ml = onml.parse(dat);
        onml.traverse(ml, {
            leave: function (node) {
                switch(node.name) {
                case 'g':
                    delete node.attr.transform;
                    defs.push(node.full);
                    break;
                case 'rect':
                    delete node.attr.id;
                    break;
                case 'path':
                    delete node.attr.id;
                    if (styles[node.attr.style] === undefined) {
                        styles[node.attr.style] = 's' + (Object.keys(styles).length + 1);
                    }
                    node.attr['class'] = styles[node.attr.style];
                    delete node.attr.style;
                    delete node.attr['sodipodi:nodetypes'];
                    delete node.attr['inkscape:connector-curvature'];
                    break;
                }
            }
        });
        defs.push(marker1);
        defs.push(marker2);
        Object.keys(styles).forEach(function (key) {
            defStyle += '.' + styles[key] + '{' + key + '}';
        });
        style.push(defStyle);
        // cb('module.exports = ' + jsof.stringify(res) + ';');
        cb('var WaveSkin=WaveSkin||{};WaveSkin.' + path.basename(name, '.svg') + '=' + JSON.stringify(res) + ';\ntry { module.exports = WaveSkin; } catch(err) {}\n');
    });
}

if (typeof argv.i === 'string') {
    f2o(argv.i, console.log);
}

/* eslint no-console: 0 */
