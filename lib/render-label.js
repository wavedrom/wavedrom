'use strict';

const tspan = require('tspan');
const tt = require('onml/tt.js');
const textWidth = require('./text-width.js');

function renderLabel (p, text, fontSize) {
    fontSize = fontSize || 11;
    const w = textWidth(text, fontSize) + 2;
    return ['g',
        tt(p.x, p.y),
        ['rect', {
            x: -(w >> 1),
            y: -(fontSize >> 1),
            width: w,
            height: fontSize,
            class: 'arc_label_bg'
        }],
        ['text', {
            'text-anchor': 'middle',
            y: Math.round(0.3 * fontSize),
            style: 'font-size:' + fontSize + 'px;',
            class: 'arc_label'
        }].concat(tspan.parse(text))
    ];
}

module.exports = renderLabel;
