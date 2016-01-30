'use strict';

var tspan = require('tspan'),
    jsonmlParse = require('./create-element');
    // w3 = require('./w3');

function renderMarks (root, content, index, lane) {
    var i, g, marks, mstep, mmstep, gy; // svgns

    function captext (cxt, anchor, y) {
        var tmark;

        if (cxt[anchor] && cxt[anchor].text) {
            tmark = tspan.parse(cxt[anchor].text);
            tmark.unshift(
                'text',
                {
                    x: cxt.xmax * cxt.xs / 2,
                    y: y,
                    'text-anchor': 'middle',
                    fill: '#000',
                    'xml:space': 'preserve'
                }
            );
            tmark = jsonmlParse(tmark);
            g.insertBefore(tmark, null);
        }
    }

    function ticktock (cxt, ref1, ref2, x, dx, y, len) {
        var tmark, step = 1, offset, dp = 0, val, L = [], tmp;

        if (cxt[ref1] === undefined || cxt[ref1][ref2] === undefined) { return; }
        val = cxt[ref1][ref2];
        if (typeof val === 'string') {
            val = val.split(' ');
        } else if (typeof val === 'number' || typeof val === 'boolean') {
            offset = Number(val);
            val = [];
            for (i = 0; i < len; i += 1) {
                val.push(i + offset);
            }
        }
        if (Object.prototype.toString.call(val) === '[object Array]') {
            if (val.length === 0) {
                return;
            } else if (val.length === 1) {
                offset = Number(val[0]);
                if (isNaN(offset)) {
                    L = val;
                } else {
                    for (i = 0; i < len; i += 1) {
                        L[i] = i + offset;
                    }
                }
            } else if (val.length === 2) {
                offset = Number(val[0]);
                step   = Number(val[1]);
                tmp = val[1].split('.');
                if ( tmp.length === 2 ) {
                    dp = tmp[1].length;
                }
                if (isNaN(offset) || isNaN(step)) {
                    L = val;
                } else {
                    offset = step * offset;
                    for (i = 0; i < len; i += 1) {
                        L[i] = (step * i + offset).toFixed(dp);
                    }
                }
            } else {
                L = val;
            }
        } else {
            return;
        }
        for (i = 0; i < len; i += 1) {
            tmp = L[i];
            //  if (typeof tmp === 'number') { tmp += ''; }
            tmark = tspan.parse(tmp);
            tmark.unshift(
                'text',
                {
                    x: i * dx + x,
                    y: y,
                    'text-anchor': 'middle',
                    class: 'muted',
                    'xml:space': 'preserve'
                }
            );
            tmark = jsonmlParse(tmark);
            g.insertBefore(tmark, null);
        }
    }

     mstep  = 2 * (lane.hscale);
     mmstep = mstep * lane.xs;
     marks  = lane.xmax / mstep;
     gy     = content.length * lane.yo;

     g = jsonmlParse(['g', {id: ('gmarks_' + index)}]);
     root.insertBefore(g, root.firstChild);

     for (i = 0; i < (marks + 1); i += 1) {
         g.insertBefore(
             jsonmlParse([
                 'path',
                 {
                     id:    'gmark_' + i + '_' + index,
                     d:     'm ' + (i * mmstep) + ',' + 0 + ' 0,' + gy,
                     style: 'stroke:#888;stroke-width:0.5;stroke-dasharray:1,3'
                 }
             ]),
             null
         );
     }

     captext(lane, 'head', (lane.yh0 ? -33 : -13));
     captext(lane, 'foot', gy + (lane.yf0 ? 45 : 25));

     ticktock(lane, 'head', 'tick',          0, mmstep,      -5, marks + 1);
     ticktock(lane, 'head', 'tock', mmstep / 2, mmstep,      -5, marks);
     ticktock(lane, 'foot', 'tick',          0, mmstep, gy + 15, marks + 1);
     ticktock(lane, 'foot', 'tock', mmstep / 2, mmstep, gy + 15, marks);
 }

module.exports = renderMarks;

/* eslint-env browser */
