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
            y: -5,
            width: w,
            height: 10,
            style: 'fill:#FFF;'
        }],
        ['text', {
            'text-anchor': 'middle',
            y: 3,
            style: 'font-size:' + fontSize + 'px;'
        }].concat(tspan.parse(text))
    ];
}

module.exports = renderLabel;
