'use strict';

var w3 = require('./w3');

function renderGaps (root, source, index, lane) {
    var i, gg, g, b, pos, Stack = [], text, subCycle, next;

    if (source) {

        gg = document.createElementNS(w3.svg, 'g');
        gg.id = 'wavegaps_' + index;
        root.insertBefore(gg, null);
        subCycle = false;
        for (i in source) {
            lane.period = source[i].period ? source[i].period    : 1;
            lane.phase  = (source[i].phase  ? source[i].phase * 2 : 0) + lane.xmin_cfg;
            g = document.createElementNS(w3.svg, 'g');
            g.id = 'wavegap_' + i + '_' + index;
            g.setAttribute('transform', 'translate(0,' + (lane.y0 + i * lane.yo) + ')');
            gg.insertBefore(g, null);

            text = source[i].wave;
            if (text) {
                Stack = text.split('');
                pos = 0;
                while (Stack.length) {
                    next = Stack.shift();
                    if (next === '<') { // sub-cycles on
                        subCycle = true;
                        next = Stack.shift();
                    }
                    if (next === '>') { // sub-cycles off
                        subCycle = false;
                        next = Stack.shift();
                    }
                    if (subCycle) {
                        pos += 1;
                    } else {
                        pos += (2 * lane.period);
                    }
                    if (next === '|') {
                        b    = document.createElementNS(w3.svg, 'use');
                        // b.id = 'guse_' + pos + '_' + i + '_' + index;
                        b.setAttributeNS(w3.xlink, 'xlink:href', '#gap');
                        b.setAttribute('transform', 'translate(' + (lane.xs * ((pos - (subCycle ? 0 : lane.period)) * lane.hscale - lane.phase)) + ')');
                        g.insertBefore(b, null);
                    }
                }
            }
        }
    }
}

module.exports = renderGaps;

/* eslint-env browser */
