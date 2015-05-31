'use strict';

function renderGaps (root, source, index, lane) {
    var i, gg, g, b, pos, Stack = [], text,
        svgns   = 'http://www.w3.org/2000/svg',
        xlinkns = 'http://www.w3.org/1999/xlink';

    if (source) {

        gg = document.createElementNS(svgns, 'g');
        gg.id = 'wavegaps_' + index;
        //gg.setAttribute('transform', 'translate(' + lane.xg + ')');
        root.insertBefore(gg, null);

        for (i in source) {
            lane.period = source[i].period ? source[i].period    : 1;
            lane.phase  = source[i].phase  ? source[i].phase * 2 : 0;
            g = document.createElementNS(svgns, 'g');
            g.id = 'wavegap_' + i + '_' + index;
            g.setAttribute('transform', 'translate(0,' + (lane.y0 + i * lane.yo) + ')');
            gg.insertBefore(g, null);

            text = source[i].wave;
            if (text) {
                Stack = text.split('');
                pos = 0;
                while (Stack.length) {
                    if (Stack.shift() === '|') {
                        b    = document.createElementNS(svgns, 'use');
                        // b.id = 'guse_' + pos + '_' + i + '_' + index;
                        b.setAttributeNS(xlinkns, 'xlink:href', '#gap');
                        b.setAttribute('transform', 'translate(' + (lane.xs * ((2 * pos + 1) * lane.period * lane.hscale - lane.phase)) + ')');
                        g.insertBefore(b, null);
                    }
                    pos += 1;
                }
            }
        }
    }
}

module.exports = renderGaps;

/* eslint-env browser */
