#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const onml = require('onml');
const json5 = require('json5');
const argv = require('yargs').argv;

const styles = {};

const marker1 = ['marker',
    {
        id: 'arrowhead',
        style: 'fill:#0041c4',
        markerHeight: 7,
        markerWidth: 10,
        markerUnits: 'strokeWidth',
        viewBox: '0 -4 11 8',
        refX: 15,
        refY: 0,
        orient: 'auto'
    },
    ['path', {'d':'M0 -4 11 0 0 4z'}]
];

const marker2 = ['marker',
    {
        id: 'arrowtail',
        style: 'fill:#0041c4',
        markerHeight: 7,
        markerWidth: 10,
        markerUnits: 'strokeWidth',
        viewBox: '-11 -4 11 8',
        refX: -15,
        refY: 0,
        orient: 'auto'
    },
    ['path', {'d':'M0 -4 -11 0 0 4z'}]
];

const marker3 = ['marker',
    {
        id: 'tee',
        style: 'fill:#0041c4',
        markerHeight: 6,
        markerWidth: 1,
        markerUnits: 'strokeWidth',
        viewBox: '0 0 1 6',
        refX: 0,
        refY: 3,
        orient: 'auto'
    },
    ['path', {'d':'M 0 0 L 0 6', 'style': 'stroke:#0041c4;stroke-width:2'}]
];

const defs = ['defs'];

const style = ['style', {type: 'text/css'}];

const getDefStyle = () => `
  text{
    font-size: 11pt;
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    font-stretch: normal;
    text-align: center;
    fill-opacity: 1;
    font-family: Helvetica
  }
  .h1 { font-size: 33pt; font-weight: bold }
  .h2 { font-size: 27pt; font-weight: bold }
  .h3 { font-size: 20pt; font-weight: bold }
  .h4 { font-size: 14pt; font-weight: bold }
  .h5 { font-size: 11pt; font-weight: bold }
  .h6 { font-size: 8pt;  font-weight: bold }
`.replace(/\s+/g, '');

const res = ['svg',
    {
        id: 'svg',
        xmlns: 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        height: '0'
    },
    style,
    defs,
    ['g', {id: 'waves'}, ['g', {id: 'lanes'}], ['g', {id: 'groups'}]]
];

function getFill (fillClasses, node) {
    const m = node.attr.style.match(/fill:(#[0-9a-fA-F]+);/);
    if (m) {
        const fill = m[1];
        const texts = node.full[2][2].split(':');
        const attr = texts[0];
        const klass = texts[1];
        if (attr === 'fill') {
            fillClasses[klass] = fill;
            console.error(attr, klass, fill);
        }
    }
}

function f2o (name, cb) {
    const full = path.resolve(process.cwd(), name);
    fs.readFile(full, { encoding: 'utf8'}, function (err, dat) {
        if (err) { throw err; }
        const ml = onml.parse(dat);
        const fillClasses = {
            '.muted': '#aaa',
            '.warning': '#f6b900',
            '.error': '#f60000',
            '.info': '#0041c4',
            '.success': '#00ab00'
        };
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
                case 'text':
                    getFill(fillClasses, node);
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
        defs.push(marker3);

        const fills = Object.keys(fillClasses).map(key =>
            key + '{fill:' + fillClasses[key] + '}');

        const extra = Object.keys(styles).map(key =>
            '.' + styles[key] + '{' + key + '}');

        style.push(getDefStyle() + fills.join('') + extra.join(''));
        // cb('module.exports = ' + jsof.stringify(res) + ';');
        cb(
            'var WaveSkin=WaveSkin||{};WaveSkin.' +
            path.basename(name, '.svg') + '=' +
            json5.stringify(res) +
            ';\ntry { module.exports = WaveSkin; } catch(err) {}\n'
        );
    });
}

if (typeof argv.i === 'string') {
    f2o(argv.i, console.log);
}

/* eslint no-console: 0 */
