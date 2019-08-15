'use strict';

var arcShape = require('./arc-shape.js');
var renderLabel = require('./render-label.js');

function renderArc (Edge, from, to, shapeProps) {
    return ['path', {
        id: 'gmark_' + Edge.from + '_' + Edge.to,
        d: shapeProps.d || 'M ' + from.x + ',' + from.y + ' ' + to.x   + ',' + to.y,
        style: shapeProps.style || 'fill:none;stroke:#00F;stroke-width:1'
    }];
}

function renderArcs (source, index, top, lane) {
    var i, k, text,
        Stack = [],
        Edge = {words: [], from: 0, shape: '', to: 0, label: ''},
        Events = {},
        pos,
        eventname,
        shapeProps,
        from,
        to;

    var res = ['g', {id: 'wavearcs_' + index}];

    if (source) {

        for (i in source) {
            if (!source.hasOwnProperty(i)) {
               continue;
            }
            lane.period = source[i].period ? source[i].period    : 1;
            lane.phase  = (source[i].phase  ? source[i].phase * 2 : 0) + lane.xmin_cfg;
            text = source[i].node;
            if (text) {
                Stack = text.split('');
                pos = 0;
                while (Stack.length) {
                    eventname = Stack.shift();
                    if (eventname !== '.') {
                        Events[eventname] = {
                            'x' : lane.xs * (2 * pos * lane.period * lane.hscale - lane.phase) + lane.xlabel,
                            'y' : i * lane.yo + lane.y0 + lane.ys * 0.5
                        };
                    }
                    pos += 1;
                }
            }
        }

        if (top.edge) {
            for (i in top.edge) {
                if (!top.edge.hasOwnProperty(i)) {
                    continue;
                }
                Edge.words = top.edge[i].split(' ');
                Edge.label = top.edge[i].substring(Edge.words[0].length);
                Edge.label = Edge.label.substring(1);
                Edge.from  = Edge.words[0].substr(0, 1);
                Edge.to    = Edge.words[0].substr(-1, 1);
                Edge.shape = Edge.words[0].slice(1, -1);

                from  = Events[Edge.from];
                to    = Events[Edge.to];

                if (from && to) {
                    shapeProps = arcShape(Edge, from, to);
                    var lx = shapeProps.lx;
                    var ly = shapeProps.ly;
                    res = res.concat([renderArc(Edge, from, to, shapeProps)]);

                    if (Edge.label) {
                        res = res.concat([renderLabel({x: lx, y: ly}, Edge.label)]);
                    }
                }
            }
        }
        for (k in Events) {
            if (Events.hasOwnProperty(k) && k === k.toLowerCase()) {
                if (Events[k].x > 0) {
                    res = res.concat([renderLabel({x: Events[k].x, y: Events[k].y}, k + '')]);
                }
            }
        }
    }
    return res;
}

module.exports = renderArcs;
