'use strict';

var w3 = require('./w3');

function renderDraggableGaps (root, text, index, lane, j) {
    var g, b, pos, Stack = [];

    //modified from render-gaps.js
    g = document.createElementNS(w3.svg, 'g');
    g.id = 'wavegap_' + j + '_' + index;
    //g.setAttribute('transform', 'translate(0,' + (lane.y0 + j * lane.yo) + ')');
    root.appendChild(g);

    if (text) {
        Stack = text.split('');
        pos = 0;
        while (Stack.length) {
            if (Stack.shift() === '|') {
                b    = document.createElementNS(w3.svg, 'use');
                // b.id = 'guse_' + pos + '_' + i + '_' + index;
                b.setAttributeNS(w3.xlink, 'xlink:href', '#gap');
                b.setAttribute('transform', 'translate(' + (lane.xs * ((2 * pos + 1) * lane.period * lane.hscale - lane.phase)) + ')');
                g.insertBefore(b, null);
            }
            pos += 1;
        }
    }
}

module.exports = renderDraggableGaps;

/* eslint-env browser */
